import {
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { IRefreshTokenRepository } from 'src/core/ports/repositories/refresh-token.port';
import { IUserRepository } from 'src/core/ports/repositories/user.repository.port';
import { IJwtService } from 'src/core/ports/services/jwt.port';

export class LoginUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshRepo: IRefreshTokenRepository,
    private readonly jwt: IJwtService,
  ) {}

  async execute(email: string, password: string) {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) throw new UnauthorizedException('Credenciales inválidas');

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

      const {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
      } = this.jwt.generateTokens(user.id);

      await this.refreshRepo.save(user.id, refreshToken, refreshTokenExpiresAt);

      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Inicio de sesión exitoso',
        {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
          user: {
            user_id: user.id,
            user_email: user.email,
            user_name: user.name,
          },
        },
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error interno:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
