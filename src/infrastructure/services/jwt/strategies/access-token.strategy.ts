import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from 'src/config/env.config';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'access-token',
) {
  constructor(@Inject('CONFIG') private readonly config: typeof envConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: { id: string }): Promise<{ id: string }> {
    if (!payload) {
      throw new UnauthorizedException('Token de acceso no válido');
    }
    return payload;
  }
}
