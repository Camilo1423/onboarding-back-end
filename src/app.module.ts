import { Module } from '@nestjs/common';
import { PrismaModule } from './config/prisma.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from './infrastructure/services/jwt/jwt.module';
import { AccessTokenStrategy } from './infrastructure/services/jwt/strategies/access-token.strategy';
import { RefreshTokenStrategy } from './infrastructure/services/jwt/strategies/refresh-token.strategy';
import { CollaboratorModule } from './modules/collaborators/collaborator.module';
import { SmtpSender } from './providers/smtp/sender.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { NotifySevenDaysJob } from './jobs/notify-seven-days.job';
import { NotifyFiveMinutesJob } from './jobs/notify-five-minutes.job';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule,
    PrismaModule,
    AuthModule,
    JwtModule,
    CollaboratorModule,
    OnboardingModule,
  ],
  controllers: [],
  providers: [
    AccessTokenStrategy,
    RefreshTokenStrategy,
    SmtpSender,
    NotifySevenDaysJob,
    NotifyFiveMinutesJob,
  ],
})
export class AppModule {}
