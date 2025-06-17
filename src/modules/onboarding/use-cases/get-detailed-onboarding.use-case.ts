import { HttpException, InternalServerErrorException } from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';

export class GetDetailedOnboardingUseCase {
  constructor(private readonly onboardingRepository: IOnboardingPort) {}

  async execute(id: string) {
    try {
      const meeting =
        await this.onboardingRepository.getMeetingWithAssignmentsById(id);
      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Onboarding obtenido',
        meeting,
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
