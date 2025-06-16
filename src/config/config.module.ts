import { Global, Module } from '@nestjs/common';
import { envConfig } from './env.config';

@Global()
@Module({
  providers: [
    {
      provide: 'CONFIG',
      useValue: envConfig,
    },
  ],
  exports: ['CONFIG'],
})
export class ConfigModule {}
