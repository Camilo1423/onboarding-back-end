import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { IRefreshTokenRepository } from 'src/core/ports/repositories/refresh-token.port';
import { IUserRepository } from 'src/core/ports/repositories/user.repository.port';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepo: IRefreshTokenRepository,
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string) {
    try {
      const user = await this.userRepo.findById(userId);

      if (!user) throw new NotFoundException('Error al cerrar sesión');

      await this.refreshTokenRepo.deleteByUserId(userId);

      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Sesión cerrada exitosamente',
        null,
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
