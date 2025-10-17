// src/user/user.repository.ts
import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  async findUserByEmail(email: string): Promise<User | undefined> {
    const queryText = 'SELECT * FROM "User" WHERE email = $1';
    // Beritahu mesin query bahwa hasilnya akan berbentuk 'User'
    const { rows } = await db.query<User>(queryText, [email]);
    return rows[0]; // Sekarang TypeScript tahu rows[0] adalah tipe 'User'
  }

  async createUser(
    email: string,
    hashedPassword: string,
    name?: string,
  ): Promise<User> {
    const queryText =
      'INSERT INTO "User"(email, password, name) VALUES($1, $2, $3) RETURNING id, email, name';
    const values = [email, hashedPassword, name];
    // Beritahu mesin query bahwa hasilnya akan berbentuk 'User'
    const { rows } = await db.query<User>(queryText, values);
    return rows[0]; // Sekarang TypeScript tahu rows[0] adalah tipe 'User'
  }
}
