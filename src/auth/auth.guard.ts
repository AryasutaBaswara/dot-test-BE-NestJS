// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  InternalServerErrorException, // <-- Impor ini untuk error server
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  // PERBAIKAN #1: Hapus 'async' karena kita tidak menggunakan 'await'
  canActivate(context: ExecutionContext): boolean {
    // PERBAIKAN #2: Beri tipe data yang jelas pada 'request'
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    // PERBAIKAN #3: Cek JWT_SECRET sebelum digunakan
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException(
        'JWT secret key is not configured.',
      );
    }

    try {
      const payload = jwt.verify(token, secret);
      // 'request' sekarang punya tipe data, jadi kita bisa menempelkan 'user'
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
