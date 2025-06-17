import {
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';
import { UpdateOnboardingDto } from '../dtos/update-onboarding.dto';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { UpdateOnboardingMapper } from '../mappers/update-onboarding.mapper';
import { FindByIdsUseCase } from 'src/modules/collaborators/use-cases/find-by-ids.use-case';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Email } from 'src/common/type/Email';
import { splitDateTime } from 'src/common/utils';
import { Collaborator } from 'src/core/domain/entities/collaborator.entity';

export class UpdateOnboardingUseCase {
  constructor(
    private readonly onboardingRepository: IOnboardingPort,
    private readonly findByIdsUseCase: FindByIdsUseCase,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(onboarding: UpdateOnboardingDto) {
    try {
      const onboardingEntityOld = await this.onboardingRepository.findById(
        onboarding.type,
        onboarding.id_onboarding,
      );

      if (!onboardingEntityOld)
        throw new NotFoundException('Proceso de onboarding no encontrado');

      const entityNew = UpdateOnboardingMapper.toDomain(onboarding);

      const idsNotify = await this.onboardingRepository.update(
        onboarding.type,
        onboarding.id_onboarding,
        onboarding.new_collaborator_ids,
        onboarding.removed_collaborator_ids,
        entityNew,
      );

      const allIds = [
        ...idsNotify.idsDeletedAssignments,
        ...idsNotify.idsNewAssignments,
      ];

      let collaborators: Collaborator[] = [];

      if (allIds.length > 0) {
        collaborators = await this.findByIdsUseCase.execute(allIds);
      }

      if (idsNotify.idsDeletedAssignments.length > 0) {
        const collaboratorsDeleted = collaborators.filter(collaborator =>
          idsNotify.idsDeletedAssignments.includes(collaborator.id),
        );

        const splitDate = splitDateTime(onboarding.start_date);

        const payload: Email[] = collaboratorsDeleted.map(collaborator => ({
          email: collaborator.email,
          name: collaborator.fullName,
          start_date: splitDate.date,
          start_time: splitDate.time,
          end_date: onboarding.end_date,
          description_text: onboarding.description_onboarding,
          meeting_url: onboardingEntityOld.meetingUrl,
        }));

        this.eventEmitter.emit(
          'notification.welcome-onboarding.deleted',
          payload,
        );
      }

      if (idsNotify.idsNewAssignments.length > 0) {
        const collaboratorsNew = collaborators.filter(collaborator =>
          idsNotify.idsNewAssignments.includes(collaborator.id),
        );

        const splitDate = splitDateTime(onboardingEntityOld.startDate);
        const splitDateNew = splitDateTime(onboarding.end_date);

        const payload: Email[] = collaboratorsNew.map(collaborator => ({
          email: collaborator.email,
          name: collaborator.fullName,
          start_date: splitDate.date,
          start_time: splitDate.time,
          end_date: onboarding.end_date,
          new_start_date: splitDateNew.date,
          new_start_time: splitDateNew.time,
          description_text: onboarding.description_onboarding,
          meeting_url: onboardingEntityOld.meetingUrl,
        }));

        this.eventEmitter.emit(
          `notification.${onboarding.type}-onboarding.created`,
          payload,
        );
      }

      const allCollaborators =
        await this.onboardingRepository.findAllAssignments(
          onboarding.type,
          onboarding.id_onboarding,
        );

      if (allCollaborators.length > 0) {
        const oldStartDate = new Date(onboardingEntityOld.startDate);
        const oldEndDate = new Date(onboardingEntityOld.endDate);
        const newStartDate = new Date(onboarding.start_date);
        const newEndDate = new Date(onboarding.end_date);

        const isChangeTime =
          oldStartDate.getTime() !== newStartDate.getTime() ||
          oldEndDate.getTime() !== newEndDate.getTime();

        const changeDescription =
          onboarding.description_onboarding !== onboardingEntityOld.description;

        const changeTitle =
          onboarding.name_onboarding !== onboardingEntityOld.name;

        if (isChangeTime || changeDescription || changeTitle) {
          const excludedNewCollaborators = allCollaborators.filter(
            collaborator => !idsNotify.idsNewAssignments.includes(collaborator),
          );

          const collaborators = await this.findByIdsUseCase.execute(
            excludedNewCollaborators,
          );

          const splitDate = splitDateTime(onboardingEntityOld.startDate);
          const splitDateNew = splitDateTime(onboarding.start_date);

          const payload: Email[] = collaborators.map(collaborator => ({
            email: collaborator.email,
            name: collaborator.fullName,
            start_date: splitDate.date,
            start_time: splitDate.time,
            end_date: onboarding.end_date,
            description_text: onboarding.description_onboarding,
            meeting_url: onboardingEntityOld.meetingUrl,
            new_start_date: splitDateNew.date,
            new_start_time: splitDateNew.time,
          }));

          this.eventEmitter.emit(
            `notification.${onboarding.type}-onboarding.updated`,
            payload,
          );
        }
      }

      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Proceso de onboarding actualizado correctamente',
        idsNotify,
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
