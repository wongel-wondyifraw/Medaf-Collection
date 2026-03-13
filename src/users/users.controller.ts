import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  // POST /users/create-admin
  // Creates admin account — no token returned
  // Admin must login separately via POST /auth/login
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