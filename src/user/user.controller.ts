// src/user/user.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
// Impor "label" DTO kita
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  // Gunakan DTO sebagai "label" untuk body
  async register(@Body() createUserDto: CreateUserDto) {
    // Sekarang TypeScript tahu persis bentuk dari createUserDto
    const user = await this.userService.registerUser(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
    );
    return { id: user.id, email: user.email, name: user.name };
  }

  @Post('/login')
  // Gunakan DTO sebagai "label" untuk body
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(
      loginUserDto.email,
      loginUserDto.password,
    );
  }
}
