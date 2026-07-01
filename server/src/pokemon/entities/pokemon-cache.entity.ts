import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('pokemon_cache')
export class PokemonCache {
  @PrimaryColumn()
  pokemonId: number;

  @Column('json')
  data: Record<string, unknown>;

  @CreateDateColumn()
  @Index()
  cachedAt: Date;
}
