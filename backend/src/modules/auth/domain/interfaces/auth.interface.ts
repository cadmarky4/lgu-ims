import { User } from '@prisma/client';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
}

export interface RefreshTokenRepository {
  create(userId: string, token: string, expiresAt: Date): Promise<void>;
  findByToken(token: string): Promise<{ userId: string; expiresAt: Date; isRevoked: boolean } | null>;
  revokeToken(token: string): Promise<void>;
  revokeAllUserTokens(userId: string): Promise<void>;
}
