import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { IUserRepository } from 'src/core/ports/repositories/user.repository.port';

@Injectable()
export class GetInfoUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(id: string) {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) throw new NotFoundException('Usuario no encontrado');

      return new GenericResponse(TypeResponse.SUCCESS, 'Usuario encontrado', {
        user_id: user.id,
        user_email: user.email,
        user_name: user.name,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error interno:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
