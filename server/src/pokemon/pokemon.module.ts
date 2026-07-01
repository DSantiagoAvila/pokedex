import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokemonCache } from './entities/pokemon-cache.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([PokemonCache])],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
