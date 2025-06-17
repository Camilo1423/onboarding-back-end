import { Module } from '@nestjs/common';
import { OnboardingController } from './controllers/onboarding.controller';
import { CreateOnboardingUseCase } from './use-cases/create-onboarding.use-case';
import {
  IOnboardingPort,
  IOnboardingPortSymbol,
} from 'src/core/ports/repositories/onboarding.port';
import { PrismaOnboardingRepository } from 'src/infrastructure/prisma/repositories/prisma-onboarding.repository';
import { FindByIdsUseCase } from '../collaborators/use-cases/find-by-ids.use-case';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';
import {
  ICollaboratorPortSymbol,
  PrismaCollaboratorRepository,
} from 'src/infrastructure/prisma/repositories/prisma-collaborator.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { envConfig } from '../../config/env.config';
import { UpdateOnboardingUseCase } from './use-cases/update-onboarding.use-case';
import { DeleteOnboardingUseCase } from './use-cases/delete-onboarding.use-case';
import { GetOnboardingByDayUseCase } from './use-cases/get-onboarding-by-day.use-case';
import { GetDetailedOnboardingUseCase } from './use-cases/get-detailed-onboarding.use-case';

@Module({
  controllers: [OnboardingController],
  providers: [
    // Other use cases
    {
      provide: FindByIdsUseCase,
      useFactory: (collaboratorRepo: ICollaboratorPort) =>
        new FindByIdsUseCase(collaboratorRepo),
      inject: [ICollaboratorPortSymbol],
    },
    // Use cases
    {
      provide: CreateOnboardingUseCase,
      useFactory: (
        onboardingRepo: IOnboardingPort,
        findByIdsUseCase: FindByIdsUseCase,
        eventEmitter: EventEmitter2,
        config: typeof envConfig,
      ) =>
        new CreateOnboardingUseCase(
          onboardingRepo,
          config,
          findByIdsUseCase,
          eventEmitter,
        ),
      inject: [
        IOnboardingPortSymbol,
        FindByIdsUseCase,
        EventEmitter2,
        'CONFIG',
      ],
    },
    {
      provide: UpdateOnboardingUseCase,
      useFactory: (
        onboardingRepo: IOnboardingPort,
        findByIdsUseCase: FindByIdsUseCase,
        eventEmitter: EventEmitter2,
      ) =>
        new UpdateOnboardingUseCase(
          onboardingRepo,
          findByIdsUseCase,
          eventEmitter,
        ),
      inject: [IOnboardingPortSymbol, FindByIdsUseCase, EventEmitter2],
    },
    {
      provide: DeleteOnboardingUseCase,
      useFactory: (
        onboardingRepo: IOnboardingPort,
        findByIdsUseCase: FindByIdsUseCase,
        eventEmitter: EventEmitter2,
      ) =>
        new DeleteOnboardingUseCase(
          onboardingRepo,
          findByIdsUseCase,
          eventEmitter,
        ),
      inject: [IOnboardingPortSymbol, FindByIdsUseCase, EventEmitter2],
    },
    {
      provide: GetOnboardingByDayUseCase,
      useFactory: (onboardingRepo: IOnboardingPort) =>
        new GetOnboardingByDayUseCase(onboardingRepo),
      inject: [IOnboardingPortSymbol],
    },
    {
      provide: GetDetailedOnboardingUseCase,
      useFactory: (onboardingRepo: IOnboardingPort) =>
        new GetDetailedOnboardingUseCase(onboardingRepo),
      inject: [IOnboardingPortSymbol],
    },
    // Adaptadores concretos
    {
      provide: IOnboardingPortSymbol,
      useClass: PrismaOnboardingRepository,
    },
    // Otros adaptadores concretos
    {
      provide: ICollaboratorPortSymbol,
      useClass: PrismaCollaboratorRepository,
    },
  ],
})
export class OnboardingModule {}
