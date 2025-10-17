// src/user/user.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(email: string, password: string, name?: string) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.createUser(email, hashedPassword, name);
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Jika JWT_SECRET tidak ada di .env, hentikan proses dan beri error di server
      throw new InternalServerErrorException(
        'JWT secret key is not configured.',
      );
    }

    const payload = { id: user.id, email: user.email };
    // Sekarang TypeScript tahu bahwa 'secret' pasti sebuah string
    const token = jwt.sign(payload, secret, {
      expiresIn: '1h',
    });

    return { accessToken: token };
  }
}
