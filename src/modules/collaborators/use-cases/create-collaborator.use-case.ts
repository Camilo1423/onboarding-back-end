import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';
import { NewCollaboratorDto } from '../dtos/new-collaborator.dto';
import { CollaboratorMapper } from '../mappers/collaborator.mapper';

export class CreateCollaboratorUseCase {
  constructor(private readonly collaboratorRepository: ICollaboratorPort) {}

  async execute(collaborator: NewCollaboratorDto) {
    try {
      const collaboratorEntity = CollaboratorMapper.toDomain(collaborator);
      const existingCollaborator =
        await this.collaboratorRepository.findByEmail(collaboratorEntity.email);
      if (existingCollaborator)
        throw new BadRequestException('El correo electrónico ya está en uso');

      const createdCollaborator =
        await this.collaboratorRepository.create(collaboratorEntity);

      return new GenericResponse(TypeResponse.SUCCESS, 'Colaborador creado', {
        collaborator_id: createdCollaborator.id,
        collaborator_name: collaboratorEntity.fullName,
        collaborator_email: collaboratorEntity.email,
        collaborator_entry_date: collaboratorEntity.entryDate,
        technical_onboarding_done: collaboratorEntity.technicalOnboardingDone,
        welcome_onboarding_done: collaboratorEntity.welcomeOnboardingDone,
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
