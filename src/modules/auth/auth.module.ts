import { Module } from '@nestjs/common';
import {
  IRefreshTokenRepository,
  IRefreshTokenRepositorySymbol,
} from 'src/core/ports/repositories/refresh-token.port';
import {
  IUserRepository,
  IUserRepositorySymbol,
} from 'src/core/ports/repositories/user.repository.port';
import { PrismaRefreshTokenRepository } from 'src/infrastructure/prisma/repositories/prisma-refresh-token.repository';
import { PrismaUserRepository } from 'src/infrastructure/prisma/repositories/prisma-user.repository';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';
import {
  IJwtService,
  IJwtServiceSymbol,
} from 'src/core/ports/services/jwt.port';
import { NewAccountUseCase } from './use-cases/new-account.use-case';
import { GetInfoUserUseCase } from './use-cases/get-info-user.use-case';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';

@Module({
  controllers: [AuthController],
  providers: [
    // Use cases
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: IUserRepository,
        refreshRepo: IRefreshTokenRepository,
        jwt: IJwtService,
      ) => new LoginUseCase(userRepo, refreshRepo, jwt),
      inject: [
        IUserRepositorySymbol,
        IRefreshTokenRepositorySymbol,
        IJwtServiceSymbol,
      ],
    },
    {
      provide: NewAccountUseCase,
      useFactory: (userRepo: IUserRepository) =>
        new NewAccountUseCase(userRepo),
      inject: [IUserRepositorySymbol],
    },
    {
      provide: GetInfoUserUseCase,
      useFactory: (userRepo: IUserRepository) =>
        new GetInfoUserUseCase(userRepo),
      inject: [IUserRepositorySymbol],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        userRepo: IUserRepository,
        refreshRepo: IRefreshTokenRepository,
        jwt: IJwtService,
      ) => new RefreshTokenUseCase(userRepo, refreshRepo, jwt),
      inject: [
        IUserRepositorySymbol,
        IRefreshTokenRepositorySymbol,
        IJwtServiceSymbol,
      ],
    },
    {
      provide: LogoutUseCase,
      useFactory: (
        refreshRepo: IRefreshTokenRepository,
        userRepo: IUserRepository,
      ) => new LogoutUseCase(refreshRepo, userRepo),
      inject: [IRefreshTokenRepositorySymbol, IUserRepositorySymbol],
    },
    // Adaptadores concretos
    {
      provide: IUserRepositorySymbol,
      useClass: PrismaUserRepository,
    },
    {
      provide: IRefreshTokenRepositorySymbol,
      useClass: PrismaRefreshTokenRepository,
    },
  ],
})
export class AuthModule {}
