import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from 'src/config/env.config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(@Inject('CONFIG') private readonly config: typeof envConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.refreshTokenSecret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: string }): Promise<{ id: string }> {
    if (!payload) {
      throw new UnauthorizedException('Token de actualización no válido');
    }
    return payload;
  }
}
