// src/user/dto/create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  name?: string; // Tanda tanya (?) berarti properti ini opsional
}
