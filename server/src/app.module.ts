import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { User } from './users/entities/user.entity';
import { Team } from './teams/entities/team.entity';
import { PokemonCache } from './pokemon/entities/pokemon-cache.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASS', ''),
        database: config.get('DB_NAME', 'pokedex'),
        entities: [User, Team, PokemonCache],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    TeamsModule,
    PokemonModule,
  ],
})
export class AppModule {}
