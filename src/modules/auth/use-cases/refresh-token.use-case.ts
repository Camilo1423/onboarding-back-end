import {
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { IRefreshTokenRepository } from 'src/core/ports/repositories/refresh-token.port';
import { IUserRepository } from 'src/core/ports/repositories/user.repository.port';
import { IJwtService } from 'src/core/ports/services/jwt.port';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(oldRefreshToken: string) {
    try {
      const isValid = await this.refreshTokenRepo.findValid(oldRefreshToken);

      if (!isValid)
        throw new UnauthorizedException('Token de refresco inválido');

      const user = await this.userRepo.findById(isValid.userId);

      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      const accessToken = this.jwtService.generateTokens(user.id);

      await this.refreshTokenRepo.deleteByUserId(user.id);

      await this.refreshTokenRepo.save(
        user.id,
        accessToken.refreshToken,
        accessToken.refreshTokenExpiresAt,
      );

      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Token de acceso actualizado',
        accessToken,
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
