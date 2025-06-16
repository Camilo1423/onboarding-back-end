export interface IJwtService {
  generateTokens(userId: string): {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  };
}

export const IJwtServiceSymbol = Symbol('IJwtService');
