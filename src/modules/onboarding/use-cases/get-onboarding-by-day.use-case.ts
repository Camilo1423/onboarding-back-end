import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GenericResponse } from 'src/common/response/GenericResponse';
import { TypeResponse } from 'src/common/response/TypeResponse';
import { splitDateTime } from 'src/common/utils/split-date';
import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';

export class GetOnboardingByDayUseCase {
  constructor(private readonly onboardingRepository: IOnboardingPort) {}

  async execute(day: string) {
    try {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
        throw new BadRequestException(
          'La fecha debe ser en formato aaaa-mm-dd',
        );
      }

      const meetings = await this.onboardingRepository.getMeetingsByDay(
        new Date(day),
      );

      const meetingsResponse = meetings.map(meeting => {
        const startDateTime = splitDateTime(meeting.startDate);
        const endDateTime = splitDateTime(meeting.endDate);

        return {
          id: meeting.id,
          title: meeting.name,
          description: meeting.description,
          startTime: startDateTime.time,
          endTime: endDateTime.time,
          meetingType: meeting.meetingType,
        };
      });

      return new GenericResponse(
        TypeResponse.SUCCESS,
        'Onboarding obtenido',
        meetingsResponse,
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
