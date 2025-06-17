import { Module } from '@nestjs/common';
import {
  ICollaboratorPortSymbol,
  PrismaCollaboratorRepository,
} from 'src/infrastructure/prisma/repositories/prisma-collaborator.repository';
import { CollaboratorController } from './controllers/collaborator.controller';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';
import { CreateCollaboratorUseCase } from './use-cases/create-collaborator.use-case';
import { FindAllCollaboratorsUseCase } from './use-cases/find-all-collaborators.use-case';
import { FindCollaboratorByIdUseCase } from './use-cases/find-collaborator-by-id.use-case';
import { UpdateCollaboratorUseCase } from './use-cases/update-collaborator.use-case';
import { DeleteCollaboratorUseCase } from './use-cases/delete-collaborator.use-case';
import {
  IOnboardingPort,
  IOnboardingPortSymbol,
} from 'src/core/ports/repositories/onboarding.port';
import { PrismaOnboardingRepository } from 'src/infrastructure/prisma/repositories/prisma-onboarding.repository';

@Module({
  controllers: [CollaboratorController],
  providers: [
    // Use cases
    {
      provide: CreateCollaboratorUseCase,
      useFactory: (collaboratorRepo: ICollaboratorPort) =>
        new CreateCollaboratorUseCase(collaboratorRepo),
      inject: [ICollaboratorPortSymbol],
    },
    {
      provide: FindAllCollaboratorsUseCase,
      useFactory: (collaboratorRepo: ICollaboratorPort) =>
        new FindAllCollaboratorsUseCase(collaboratorRepo),
      inject: [ICollaboratorPortSymbol],
    },
    {
      provide: FindCollaboratorByIdUseCase,
      useFactory: (
        collaboratorRepo: ICollaboratorPort,
        onboardingRepo: IOnboardingPort,
      ) => new FindCollaboratorByIdUseCase(collaboratorRepo, onboardingRepo),
      inject: [ICollaboratorPortSymbol, IOnboardingPortSymbol],
    },
    {
      provide: UpdateCollaboratorUseCase,
      useFactory: (collaboratorRepo: ICollaboratorPort) =>
        new UpdateCollaboratorUseCase(collaboratorRepo),
      inject: [ICollaboratorPortSymbol],
    },
    {
      provide: DeleteCollaboratorUseCase,
      useFactory: (collaboratorRepo: ICollaboratorPort) =>
        new DeleteCollaboratorUseCase(collaboratorRepo),
      inject: [ICollaboratorPortSymbol],
    },
    // Adaptadores concretos
    {
      provide: ICollaboratorPortSymbol,
      useClass: PrismaCollaboratorRepository,
    },
    {
      provide: IOnboardingPortSymbol,
      useClass: PrismaOnboardingRepository,
    },
  ],
})
export class CollaboratorModule {}
