import {
  IsString,
  MaxLength,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TeamMemberDto {
  @IsNumber()
  pokemonId: number;

  @IsString()
  @IsNotEmpty()
  pokemonName: string;

  @IsString()
  @IsNotEmpty()
  sprite: string;
}

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  name: string;

  @IsArray()
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  members: TeamMemberDto[];
}
