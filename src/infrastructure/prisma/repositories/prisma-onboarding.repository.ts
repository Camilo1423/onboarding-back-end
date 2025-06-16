import { Inject } from '@nestjs/common';
import { envConfig } from 'src/config/env.config';
import { PrismaService } from 'src/config/prisma.service';
import {
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
        startDate: data.startDate,
        endDate: data.endDate,
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
}
