import {
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
}

export const IOnboardingPortSymbol = Symbol('IOnboardingPort');
