import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';
import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';

export class FindCollaboratorByIdUseCase {
  constructor(
    private readonly collaboratorRepository: ICollaboratorPort,
    private readonly onboardingRepository: IOnboardingPort,
  ) {}

  async execute(id: string) {
    try {
      const collaborator = await this.collaboratorRepository.findById(id);
      const { technical, welcome } =
        await this.onboardingRepository.getAssignmentsTechnicalAndWelcomeByCollaboratorId(
          id,
        );
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
          technical_onboarding: technical,
          welcome_onboarding: welcome,
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
