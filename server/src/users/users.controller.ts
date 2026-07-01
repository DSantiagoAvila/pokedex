import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

interface AuthenticatedRequest extends Request {
  user: { userId: string; username: string; email: string };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: AuthenticatedRequest) {
    return this.usersService.findById(req.user.userId);
  }

  @Post('favorites/:pokemonId')
  addFavorite(
    @Request() req: AuthenticatedRequest,
    @Param('pokemonId', ParseIntPipe) pokemonId: number,
  ) {
    return this.usersService.addFavorite(req.user.userId, pokemonId);
  }

  @Delete('favorites/:pokemonId')
  removeFavorite(
    @Request() req: AuthenticatedRequest,
    @Param('pokemonId', ParseIntPipe) pokemonId: number,
  ) {
    return this.usersService.removeFavorite(req.user.userId, pokemonId);
  }
}
