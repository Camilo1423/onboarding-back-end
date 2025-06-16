import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { Email } from 'src/common/type/Email';
import { splitDateTime } from 'src/common/utils';
import { OnboardingType } from 'src/core/domain/entities/onboarding.entity';
import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';
import { FindByIdsUseCase } from 'src/modules/collaborators/use-cases/find-by-ids.use-case';

export class DeleteOnboardingUseCase {
  constructor(
    private readonly onboardingRepository: IOnboardingPort,
    private readonly findByIdsUseCase: FindByIdsUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(type: OnboardingType, id: string) {
    try {
      const onboarding = await this.onboardingRepository.findById(type, id);

      if (!onboarding) {
        throw new NotFoundException('Onboarding no encontrado');
      }

      const assignments = await this.onboardingRepository.findAllAssignments(
        type,
        id,
      );

      await this.onboardingRepository.delete(type, id);

      if (assignments.length > 0) {
        const collaborators = await this.findByIdsUseCase.execute(assignments);

        const splitDate = splitDateTime(onboarding.startDate);

        const payload: Email[] = collaborators.map(collaborator => ({
          email: collaborator.email,
          name: collaborator.fullName,
          start_date: splitDate.date,
          start_time: splitDate.time,
          end_date: onboarding.endDate,
          description_text: onboarding.description,
          meeting_url: onboarding.meetingUrl,
        }));

        this.eventEmitter.emit(
          `notification.${type}-onboarding.deleted`,
          payload,
        );
      }

      return new GenericResponse(TypeResponse.SUCCESS, 'Onboarding eliminado');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error interno:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
