import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async findAllByOwner(ownerId: string): Promise<Team[]> {
    return this.teamRepository.find({
      where: { ownerId: parseInt(ownerId, 10) },
    });
  }

  async create(ownerId: string, dto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create({
      ownerId: parseInt(ownerId, 10),
      name: dto.name,
      members: dto.members ?? [],
    });
    return this.teamRepository.save(team);
  }

  async update(teamId: string, ownerId: string, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: parseInt(teamId, 10) },
    });
    if (!team) throw new NotFoundException('Team not found');
    if (team.ownerId !== parseInt(ownerId, 10)) {
      throw new ForbiddenException('You do not own this team');
    }

    if (dto.name !== undefined) team.name = dto.name;
    if (dto.members !== undefined) team.members = dto.members;

    return this.teamRepository.save(team);
  }

  async remove(teamId: string, ownerId: string): Promise<void> {
    const team = await this.teamRepository.findOne({
      where: { id: parseInt(teamId, 10) },
    });
    if (!team) throw new NotFoundException('Team not found');
    if (team.ownerId !== parseInt(ownerId, 10)) {
      throw new ForbiddenException('You do not own this team');
    }
    await this.teamRepository.remove(team);
  }
}
