import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Team } from '../../teams/entities/team.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  favoritesRaw: string | null;

  get favorites(): number[] {
    if (!this.favoritesRaw) return [];
    return this.favoritesRaw.split(',').filter(Boolean).map(Number);
  }

  set favorites(ids: number[]) {
    this.favoritesRaw = ids.length ? ids.join(',') : null;
  }

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Team, (team) => team.owner)
  teams: Team[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  toSafeObject(): Omit<User, 'password' | 'hashPassword' | 'toSafeObject'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safe } = this;
    return safe as Omit<User, 'password' | 'hashPassword' | 'toSafeObject'>;
  }
}
