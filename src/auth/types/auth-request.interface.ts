// src/auth/types/auth-request.interface.ts
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}
