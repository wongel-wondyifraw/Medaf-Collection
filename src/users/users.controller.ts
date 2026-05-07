import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from './user.entity';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  // POST /users/create-admin
  // Creates admin account — no token returned
  // Admin must login separately via POST /auth/login
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN) // ← Add this to protect the rout
  @Post('create-admin')
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(
      dto.email,
      dto.password,
      dto.name,
      dto.imageUrl,
    );
  }
}