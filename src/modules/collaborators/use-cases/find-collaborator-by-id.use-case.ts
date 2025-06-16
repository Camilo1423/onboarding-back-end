import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';

export class FindCollaboratorByIdUseCase {
  constructor(private readonly collaboratorRepository: ICollaboratorPort) {}

  async execute(id: string) {
    try {
      const collaborator = await this.collaboratorRepository.findById(id);
      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Colaborador encontrado',
        {
          id: collaborator.id,
          name: collaborator.fullName,
          email: collaborator.email,
          entry_date: collaborator.entryDate,
          technical_onboarding_done: collaborator.technicalOnboardingDone,
          welcome_onboarding_done: collaborator.welcomeOnboardingDone,
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
