import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';
import { CreateOnboardingDto } from '../dtos/create-onboarding.dto';
import { CreateOnboardingMapper } from '../mappers/create-onboarding.mapper';
import {
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { envConfig } from 'src/config/env.config';
import { encrypt, splitDateTime } from 'src/common/utils';
import { FindByIdsUseCase } from 'src/modules/collaborators/use-cases/find-by-ids.use-case';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Email } from 'src/common/type/Email';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';

export class CreateOnboardingUseCase {
  constructor(
    private readonly onboardingRepository: IOnboardingPort,
    @Inject('CONFIG') private readonly env: typeof envConfig,
    private readonly findByIdsUseCase: FindByIdsUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(onboarding: CreateOnboardingDto) {
    try {
      const onboardingEntity = CreateOnboardingMapper.toDomain(onboarding);
      const idMeeting = await this.onboardingRepository.create(
        onboarding.type,
        onboardingEntity,
      );

      const idMeetingEncrypted = encrypt(
        idMeeting,
        this.env.meeting.key_encript,
      );

      const urlMeeting = `${this.env.meeting.url}/${encodeURIComponent(idMeetingEncrypted)}`;

      await this.onboardingRepository.update(
        onboarding.type,
        idMeeting,
        [],
        [],
        {
          ...onboardingEntity,
          meetingUrl: urlMeeting,
        },
      );

      const collaborators = await this.findByIdsUseCase.execute(
        onboardingEntity.collaboratorIds,
      );

      if (collaborators.length > 0) {
        const splitDate = splitDateTime(onboarding.start_date);

        const payload: Email[] = collaborators.map(collaborator => ({
          email: collaborator.email,
          name: collaborator.fullName,
          start_date: splitDate.date,
          start_time: splitDate.time,
          end_date: onboarding.end_date,
          description_text: onboarding.description_onboarding,
          meeting_url: urlMeeting,
        }));

        this.eventEmitter.emit(
          `notification.${onboarding.type}-onboarding.created`,
          payload,
        );
      }

      return new GenericResponse(TypeResponse.SUCCESS, 'Onboarding creado');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error interno:', error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
