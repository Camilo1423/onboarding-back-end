import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';
import { UpdateCollaboratorDto } from '../dtos/update-collaborator.dto';
import { UpdateCollaboratorMapper } from '../mappers/update-collaborator.mapper';

export class UpdateCollaboratorUseCase {
  constructor(private readonly collaboratorRepository: ICollaboratorPort) {}

  async execute(data: UpdateCollaboratorDto) {
    try {
      const foundCollaborator = await this.collaboratorRepository.findById(
        data.id,
      );
      if (!foundCollaborator)
        throw new NotFoundException('Colaborador no encontrado');

      const collaboratorEntity = UpdateCollaboratorMapper.toDomain(data);
      await this.collaboratorRepository.update(data.id, collaboratorEntity);
      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Colaborador actualizado',
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
