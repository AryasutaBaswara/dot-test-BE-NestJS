// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller'; // Kita impor controllernya sekarang, walau filenya belum dibuat

@Module({
  imports: [],
  controllers: [UserController], // Daftarkan "Pramusaji" di sini
  providers: [UserService, UserRepository], // Daftarkan "Koki" dan "Petugas Gudang" di sini
})
export class UserModule {}
