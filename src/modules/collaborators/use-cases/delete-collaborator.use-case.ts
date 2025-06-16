import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';

export class DeleteCollaboratorUseCase {
  constructor(private readonly collaboratorRepository: ICollaboratorPort) {}

  async execute(id: string) {
    try {
      await this.collaboratorRepository.delete(id);
      return new GenericResponse(TypeResponse.SUCCESS, 'Colaborador eliminado');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error interno:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
