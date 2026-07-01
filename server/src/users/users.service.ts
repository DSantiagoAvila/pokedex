import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: RegisterDto): Promise<User> {
    const user = this.userRepository.create({
      username: dto.username,
      email: dto.email.toLowerCase(),
      password: dto.password,
      favorites: [],
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<Omit<User, 'password' | 'hashPassword' | 'toSafeObject'>> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id, 10) },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.toSafeObject();
  }

  async addFavorite(
    userId: string,
    pokemonId: number,
  ): Promise<Omit<User, 'password' | 'hashPassword' | 'toSafeObject'>> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId, 10) },
    });
    if (!user) throw new NotFoundException('User not found');

    // simple-array columns are deserialized as strings — coerce to numbers
    const favorites = (user.favorites ?? []).map(Number);

    if (favorites.includes(pokemonId)) {
      throw new ConflictException('Pokémon is already in favorites');
    }
    if (favorites.length >= 100) {
      throw new BadRequestException('Cannot have more than 100 favourite Pokémon');
    }

    user.favorites = [...favorites, pokemonId];
    const saved = await this.userRepository.save(user);
    return saved.toSafeObject();
  }

  async removeFavorite(
    userId: string,
    pokemonId: number,
  ): Promise<Omit<User, 'password' | 'hashPassword' | 'toSafeObject'>> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(userId, 10) },
    });
    if (!user) throw new NotFoundException('User not found');

    user.favorites = (user.favorites ?? []).map(Number).filter((id) => id !== pokemonId);
    const saved = await this.userRepository.save(user);
    return saved.toSafeObject();
  }
}
