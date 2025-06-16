import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';

export class FindAllCollaboratorsUseCase {
  constructor(private readonly collaboratorRepository: ICollaboratorPort) {}

  async execute(page: number = 1, limit: number = 10, search?: string) {
    try {
      const collaborators = await this.collaboratorRepository.findAll(
        page,
        limit,
        search,
      );
      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Colaboradores encontrados',
        {
          total_items: collaborators.total,
          page_number: collaborators.page,
          page_size: collaborators.limit,
          total_pages: collaborators.totalPages,
          collaborators: collaborators.data.map((collab) => ({
            id: collab.id,
            name: collab.fullName,
            email: collab.email,
            entry_date: collab.entryDate,
            technical_onboarding_done: collab.technicalOnboardingDone,
            welcome_onboarding_done: collab.welcomeOnboardingDone,
          })),
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
