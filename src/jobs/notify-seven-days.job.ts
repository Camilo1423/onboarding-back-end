import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../config/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { splitDateTime } from '../common/utils';
import { Email } from '../common/type/Email';

@Injectable()
export class NotifySevenDaysJob {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    try {
      // Get current date
      const today = new Date();

      // Calculate date 7 days from now
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      // Format the date to match the database format (YYYY-MM-DD)
      const targetDate = sevenDaysFromNow.toISOString().split('T')[0];

      // Find all onboarding sessions that start in exactly 7 days
      const technicalOnboardings =
        await this.prisma.technicalOnboarding.findMany({
          where: {
            startDate: {
              gte: new Date(`${targetDate}T00:00:00.000Z`),
              lt: new Date(`${targetDate}T23:59:59.999Z`),
            },
          },
          include: {
            assignments: {
              include: {
                collaborator: true,
              },
            },
          },
        });

      const welcomeOnboardings = await this.prisma.welcomeOnboarding.findMany({
        where: {
          startDate: {
            gte: new Date(`${targetDate}T00:00:00.000Z`),
            lt: new Date(`${targetDate}T23:59:59.999Z`),
          },
        },
        include: {
          assignments: {
            include: {
              collaborator: true,
            },
          },
        },
      });

      // Process technical onboardings
      for (const onboarding of technicalOnboardings) {
        const splitDate = splitDateTime(onboarding.startDate.toString());

        // Calculate duration in minutes between start and end date
        const startDate = new Date(onboarding.startDate);
        const endDate = new Date(onboarding.endDate);
        const durationInMinutes = Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60),
        );

        const payload: Email[] = onboarding.assignments.map(assignment => ({
          email: assignment.collaborator.email,
          name: assignment.collaborator.fullName,
          start_date: splitDate.date,
          start_time: splitDate.time,
          end_date: onboarding.endDate.toString(),
          description_text: onboarding.description || '',
          meeting_url: onboarding.meetingUrl || '',
          time_until_start: '7 días',
          estimated_duration: durationInMinutes,
        }));

        this.eventEmitter.emit(
          'notification.technical-onboarding.notify',
          payload,
        );
      }

      // Process welcome onboardings
      for (const onboarding of welcomeOnboardings) {
        const splitDate = splitDateTime(onboarding.startDate.toString());

        const startDate = new Date(onboarding.startDate);
        const endDate = new Date(onboarding.endDate);
        const durationInMinutes = Math.round(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60),
        );

        const payload: Email[] = onboarding.assignments.map(assignment => ({
          email: assignment.collaborator.email,
          name: assignment.collaborator.fullName,
          start_date: splitDate.date,
          start_time: splitDate.time,
          end_date: onboarding.endDate.toString(),
          description_text: onboarding.description || '',
          meeting_url: onboarding.meetingUrl || '',
          time_until_start: '7 días',
          estimated_duration: durationInMinutes,
        }));

        this.eventEmitter.emit(
          'notification.welcome-onboarding.notify',
          payload,
        );
      }
    } catch (error) {
      console.error('Error in NotifySevenDaysJob:', error);
    }
  }
}
