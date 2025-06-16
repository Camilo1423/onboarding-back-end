export interface IRefreshTokenRepository {
  save(userId: string, refreshToken: string, expiresAt: string): Promise<void>;
  delete(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  findValid(token: string): Promise<{ userId: string } | null>;
}

export const IRefreshTokenRepositorySymbol = Symbol('IRefreshTokenRepository');
