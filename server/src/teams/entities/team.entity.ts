import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export interface TeamMember {
  pokemonId: number;
  pokemonName: string;
  sprite: string;
}

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.teams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: number;

  @Column({ length: 30 })
  name: string;

  @Column('json')
  members: TeamMember[];

  @CreateDateColumn()
  createdAt: Date;
}
