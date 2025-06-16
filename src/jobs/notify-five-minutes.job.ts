import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../config/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { splitDateTime } from '../common/utils';
import { Email } from '../common/type/Email';

@Injectable()
export class NotifyFiveMinutesJob {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      // Get current date
      const now = new Date();

      // Calculate time range for 5 minutes from now
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      const fourMinutesFromNow = new Date(now.getTime() + 4 * 60 * 1000);

      // Find all onboarding sessions that start in 5 minutes and haven't been notified
      const technicalOnboardings =
        await this.prisma.technicalOnboarding.findMany({
          where: {
            startDate: {
              gte: fourMinutesFromNow,
              lt: fiveMinutesFromNow,
            },
            notificationSent: false,
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
            gte: fourMinutesFromNow,
            lt: fiveMinutesFromNow,
          },
          notificationSent: false,
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
          time_until_start: '5 minutos',
          estimated_duration: durationInMinutes,
        }));

        // Send notification
        this.eventEmitter.emit(
          'notification.technical-onboarding.notify',
          payload,
        );

        // Mark as notified
        await this.prisma.technicalOnboarding.update({
          where: { id: onboarding.id },
          data: { notificationSent: true },
        });
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
          time_until_start: '5 minutos',
          estimated_duration: durationInMinutes,
        }));

        // Send notification
        this.eventEmitter.emit(
          'notification.welcome-onboarding.notify',
          payload,
        );

        // Mark as notified
        await this.prisma.welcomeOnboarding.update({
          where: { id: onboarding.id },
          data: { notificationSent: true },
        });
      }
    } catch (error) {
      console.error('Error in NotifyFiveMinutesJob:', error);
    }
  }
}
