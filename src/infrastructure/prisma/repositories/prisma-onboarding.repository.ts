import { Inject } from '@nestjs/common';
import { envConfig } from 'src/config/env.config';
import { PrismaService } from 'src/config/prisma.service';
import { Assign } from 'src/core/domain/entities/assign.entity';
import {
  Meeting,
  MeetingWithAssignments,
  Onboarding,
  OnboardingType,
} from 'src/core/domain/entities/onboarding.entity';
import { IOnboardingPort } from 'src/core/ports/repositories/onboarding.port';

export class PrismaOnboardingRepository implements IOnboardingPort {
  private readonly nameAssignmentTables: {
    technical: string;
    welcome: string;
  } = {
    technical: 'onboardingAssignment',
    welcome: 'welcomeOnboardingAssignment',
  };

  private readonly nameOnboardingTables: {
    technical: string;
    welcome: string;
  } = {
    technical: 'technicalOnboarding',
    welcome: 'welcomeOnboarding',
  };

  constructor(
    private readonly prisma: PrismaService,
    @Inject('CONFIG') private readonly config: typeof envConfig,
  ) {}
  async getMeetingWithAssignmentsById(
    id: string,
  ): Promise<MeetingWithAssignments> {
    const technicalMeeting = await this.prisma.technicalOnboarding.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            collaborator: true,
          },
        },
      },
    });

    if (technicalMeeting) {
      return new MeetingWithAssignments(
        technicalMeeting.id,
        technicalMeeting.name,
        technicalMeeting.description,
        technicalMeeting.startDate,
        technicalMeeting.endDate,
        'technical',
        technicalMeeting.assignments.map(a => a.collaborator),
      );
    }

    const welcomeMeeting = await this.prisma.welcomeOnboarding.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            collaborator: true,
          },
        },
      },
    });

    if (welcomeMeeting) {
      return new MeetingWithAssignments(
        welcomeMeeting.id,
        welcomeMeeting.name,
        welcomeMeeting.description,
        welcomeMeeting.startDate,
        welcomeMeeting.endDate,
        'welcome',
        welcomeMeeting.assignments.map(a => a.collaborator),
      );
    }

    throw new Error('Meeting not found');
  }
  async getMeetingsByDay(day: Date): Promise<Meeting[]> {
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    const [technicalMeetings, welcomeMeetings] = await Promise.all([
      this.prisma.technicalOnboarding.findMany({
        where: {
          startDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      this.prisma.welcomeOnboarding.findMany({
        where: {
          startDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ]);

    const meetings = [
      ...technicalMeetings.map(
        meeting =>
          new Meeting(
            meeting.id,
            meeting.name,
            meeting.description,
            meeting.startDate.toString(),
            meeting.endDate.toString(),
            'technical',
          ),
      ),
      ...welcomeMeetings.map(
        meeting =>
          new Meeting(
            meeting.id,
            meeting.name,
            meeting.description,
            meeting.startDate.toString(),
            meeting.endDate.toString(),
            'welcome',
          ),
      ),
    ];

    return meetings;
  }
  async findById(type: OnboardingType, id: string): Promise<Onboarding | null> {
    return await this.prisma[this.nameOnboardingTables[type]].findUnique({
      where: {
        id,
      },
    });
  }
  async findAllAssignments(
    type: OnboardingType,
    id: string,
  ): Promise<string[]> {
    const assignments = await this.prisma[
      this.nameAssignmentTables[type]
    ].findMany({
      where: {
        onboardingId: id,
      },
    });

    return assignments.map(assignment => assignment.collaboratorId);
  }

  async create(type: OnboardingType, data: Onboarding): Promise<string> {
    // Create the technical onboarding meeting
    const onboarding = await this.prisma[
      this.nameOnboardingTables[type]
    ].create({
      data: {
        name: data.name,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        meetingUrl: data.meetingUrl,
      },
    });

    // Create assignments for each collaborator
    if (data.collaboratorIds && data.collaboratorIds.length > 0) {
      await this.prisma[this.nameAssignmentTables[type]].createMany({
        data: data.collaboratorIds.map(collaboratorId => ({
          collaboratorId,
          onboardingId: onboarding.id,
          completed: false,
        })),
      });
    }

    return onboarding.id;
  }

  async update(
    type: OnboardingType,
    id: string,
    collaboratorIds: string[],
    removedCollaboratorIds: string[],
    data: Onboarding,
  ): Promise<{
    idsDeletedAssignments: string[];
    idsNewAssignments: string[];
  }> {
    const idsDeletedAssignments: string[] = [];
    const idsNewAssignments: string[] = [];
    // Delete removed collaborators if they exist
    if (removedCollaboratorIds.length > 0) {
      // First find the assignments that will be deleted to get their IDs
      const assignmentsToDelete = await this.prisma[
        this.nameAssignmentTables[type]
      ].findMany({
        where: {
          onboardingId: id,
          collaboratorId: {
            in: removedCollaboratorIds,
          },
        },
        select: {
          collaboratorId: true,
        },
      });

      // Delete the assignments
      await this.prisma[this.nameAssignmentTables[type]].deleteMany({
        where: {
          onboardingId: id,
          collaboratorId: {
            in: removedCollaboratorIds,
          },
        },
      });

      // Store the deleted collaborator IDs
      idsDeletedAssignments.push(
        ...assignmentsToDelete.map(assignment => assignment.collaboratorId),
      );
    }

    // Add new collaborators if they don't exist
    if (collaboratorIds.length > 0) {
      // Get existing assignments
      const existingAssignments = await this.prisma[
        this.nameAssignmentTables[type]
      ].findMany({
        where: {
          onboardingId: id,
          collaboratorId: {
            in: collaboratorIds,
          },
        },
        select: {
          collaboratorId: true,
        },
      });

      const existingCollaboratorIds = existingAssignments.map(
        a => a.collaboratorId,
      );

      // Filter out collaborators that already have assignments
      const newCollaboratorIds = collaboratorIds.filter(
        id => !existingCollaboratorIds.includes(id),
      );

      idsNewAssignments.push(...newCollaboratorIds);

      // Create assignments for new collaborators
      if (newCollaboratorIds.length > 0) {
        await this.prisma.onboardingAssignment.createMany({
          data: newCollaboratorIds.map(collaboratorId => ({
            collaboratorId,
            onboardingId: id,
            completed: false,
          })),
        });
      }
    }
    const existMeetingUrl =
      data.meetingUrl.length > 0 ? { meetingUrl: data.meetingUrl } : {};

    // Update onboarding data including meeting details
    await this.prisma[this.nameOnboardingTables[type]].update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        ...existMeetingUrl,
      },
    });

    return {
      idsDeletedAssignments,
      idsNewAssignments,
    };
  }

  async delete(type: OnboardingType, id: string): Promise<void> {
    // Delete all assignments (relations) for this onboarding
    await this.prisma[this.nameAssignmentTables[type]].deleteMany({
      where: {
        onboardingId: id,
      },
    });

    // Delete the onboarding tech record
    await this.prisma[this.nameOnboardingTables[type]].delete({
      where: {
        id,
      },
    });
  }

  async getAssignmentsTechnicalAndWelcomeByCollaboratorId(
    collaboratorId: string,
  ): Promise<{
    technical: {
      technicalOnboarding: Onboarding | null;
      assignments: Assign[];
    }[];
    welcome: {
      welcomeOnboarding: Onboarding | null;
      assignments: Assign[];
    }[];
  }> {
    // Get technical onboarding assignments
    const technicalAssignments =
      await this.prisma.onboardingAssignment.findMany({
        where: {
          collaboratorId,
        },
        include: {
          onboarding: true,
        },
      });

    // Get welcome onboarding assignments
    const welcomeAssignments =
      await this.prisma.welcomeOnboardingAssignment.findMany({
        where: {
          collaboratorId,
        },
        include: {
          onboarding: true,
        },
      });

    // Map technical assignments
    const technical = technicalAssignments.map(assignment => ({
      technicalOnboarding: assignment.onboarding
        ? {
            id: assignment.onboarding.id,
            name: assignment.onboarding.name,
            description: assignment.onboarding.description,
            startDate: assignment.onboarding.startDate.toISOString(),
            endDate: assignment.onboarding.endDate.toISOString(),
            meetingUrl: assignment.onboarding.meetingUrl,
            notificationSent: assignment.onboarding.notificationSent,
            createdAt: assignment.onboarding.createdAt.toISOString(),
            updatedAt: assignment.onboarding.updatedAt.toISOString(),
          }
        : null,
      assignments: [
        {
          id: assignment.id,
          collaboratorId: assignment.collaboratorId,
          onboardingId: assignment.onboardingId,
          completed: assignment.completed,
          createdAt: assignment.createdAt.toISOString(),
          updatedAt: assignment.updatedAt.toISOString(),
        },
      ],
    }));

    // Map welcome assignments
    const welcome = welcomeAssignments.map(assignment => ({
      welcomeOnboarding: assignment.onboarding
        ? {
            id: assignment.onboarding.id,
            name: assignment.onboarding.name,
            description: assignment.onboarding.description,
            startDate: assignment.onboarding.startDate.toISOString(),
            endDate: assignment.onboarding.endDate.toISOString(),
            meetingUrl: assignment.onboarding.meetingUrl,
            notificationSent: assignment.onboarding.notificationSent,
            createdAt: assignment.onboarding.createdAt.toISOString(),
            updatedAt: assignment.onboarding.updatedAt.toISOString(),
          }
        : null,
      assignments: [
        {
          id: assignment.id,
          collaboratorId: assignment.collaboratorId,
          onboardingId: assignment.onboardingId,
          completed: assignment.completed,
          createdAt: assignment.createdAt.toISOString(),
          updatedAt: assignment.updatedAt.toISOString(),
        },
      ],
    }));

    return {
      technical,
      welcome,
    };
  }
}
