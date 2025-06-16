import { Inject, Injectable } from '@nestjs/common';
import { IJwtService } from 'src/core/ports/services/jwt.port';
import { JwtService as JwtServiceNest } from '@nestjs/jwt';
import { envConfig } from 'src/config/env.config';

@Injectable()
export class JwtService implements IJwtService {
  constructor(
    @Inject('CONFIG') private readonly config: typeof envConfig,
    private readonly jwtService: JwtServiceNest,
  ) {}

  private getTimeUnit(timeString: string): string {
    if (timeString.includes('d')) return 'd';
    if (timeString.includes('h')) return 'h';
    if (timeString.includes('m')) return 'm';
    return 's';
  }

  generateTokens(userId: string): {
    accessToken: string;
    accessTokenExpiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
  } {
    const payload = {
      id: userId,
    };

    const splitLetterAccessToken = this.getTimeUnit(
      this.config.jwt.accessTokenExpiresIn,
    );
    const splitLetterRefreshToken = this.getTimeUnit(
      this.config.jwt.refreshTokenExpiresIn,
    );

    const dateNow = new Date();
    const accessTokenExpired = new Date(
      dateNow.getTime() +
        parseInt(
          this.config.jwt.accessTokenExpiresIn.split(splitLetterAccessToken)[0],
          10,
        ) *
          60 *
          60 *
          1000,
    ).toISOString();

    const refreshTokenExpired = new Date(
      dateNow.getTime() +
        parseInt(
          this.config.jwt.refreshTokenExpiresIn.split(
            splitLetterRefreshToken,
          )[0],
          10,
        ) *
          60 *
          60 *
          1000,
    ).toISOString();

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.jwt.secret,
      expiresIn: this.config.jwt.accessTokenExpiresIn,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.jwt.refreshTokenSecret,
      expiresIn: this.config.jwt.refreshTokenExpiresIn,
    });

    return {
      accessToken,
      accessTokenExpiresAt: accessTokenExpired,
      refreshToken,
      refreshTokenExpiresAt: refreshTokenExpired,
    };
  }
}
