import { Assign } from 'src/core/domain/entities/assign.entity';
import {
  Meeting,
  MeetingWithAssignments,
  Onboarding,
  OnboardingType,
} from 'src/core/domain/entities/onboarding.entity';

export interface IOnboardingPort {
  create(type: OnboardingType, data: Onboarding): Promise<string>;
  update(
    type: OnboardingType,
    id: string,
    collaboratorIds: string[],
    removedCollaboratorIds: string[],
    data: Onboarding,
  ): Promise<{
    idsDeletedAssignments: string[];
    idsNewAssignments: string[];
  }>;
  delete(type: OnboardingType, id: string): Promise<void>;
  findById(type: OnboardingType, id: string): Promise<Onboarding | null>;
  findAllAssignments(type: OnboardingType, id: string): Promise<string[]>;
  getAssignmentsTechnicalAndWelcomeByCollaboratorId(
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
  }>;
  getMeetingsByDay(day: Date): Promise<Meeting[]>;
  getMeetingWithAssignmentsById(id: string): Promise<MeetingWithAssignments>;
}

export const IOnboardingPortSymbol = Symbol('IOnboardingPort');
