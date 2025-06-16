import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserRepository } from 'src/core/ports/repositories/user.repository.port';
import { NewAccountDto } from '../dtos/new-account.dto';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class NewAccountUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: NewAccountDto) {
    try {
      const user = UserMapper.toDomain(dto);
      const result = await this.userRepo.create(user);

      if (!result.success) return new BadRequestException(result.message);

      return new GenericResponse(
        TypeResponse.SUCCESS,
        result.message,
        result.success,
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
