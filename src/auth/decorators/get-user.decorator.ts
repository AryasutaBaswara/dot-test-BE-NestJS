// src/auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../types/auth-request.interface'; // <-- Impor cetak biru kita

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // Gunakan cetak biru <AuthRequest> untuk membuat 'request' menjadi transparan
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    // Sekarang TypeScript dan ESLint tahu bahwa 'request.user' itu ada dan aman
    return request.user;
  },
);
