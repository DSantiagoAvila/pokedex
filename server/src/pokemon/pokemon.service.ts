import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { PokemonCache } from './entities/pokemon-cache.entity';

const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable()
export class PokemonService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(PokemonCache)
    private readonly pokemonCacheRepository: Repository<PokemonCache>,
  ) {}

  async getList(limit: number, offset: number): Promise<Record<string, unknown>> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Record<string, unknown>>(
          `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`,
        ),
      );
      return response.data;
    } catch {
      throw new InternalServerErrorException('Failed to fetch Pokémon list from PokeAPI');
    }
  }

  async getById(id: number): Promise<Record<string, unknown>> {
    const cached = await this.pokemonCacheRepository.findOne({
      where: { pokemonId: id },
    });

    const isStale =
      !cached || Date.now() - cached.cachedAt.getTime() > CACHE_TTL_MS;

    if (!isStale) {
      return cached!.data;
    }

    // Cache miss or stale — fetch from PokeAPI
    let data: Record<string, unknown>;
    try {
      const response = await firstValueFrom(
        this.httpService.get<Record<string, unknown>>(`${POKEAPI_BASE}/pokemon/${id}`),
      );
      data = response.data;
    } catch {
      throw new NotFoundException(`Pokémon with id ${id} not found`);
    }

    // Upsert into cache — merge onto existing row if present, otherwise insert
    const entry = cached ?? this.pokemonCacheRepository.create({ pokemonId: id });
    entry.data = data;
    entry.cachedAt = new Date();
    await this.pokemonCacheRepository.save(entry);

    return data;
  }
}
