import { Global, Module } from '@nestjs/common';
import { JwtModule as JwtModuleNest } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from './jwt.service';
import { IJwtServiceSymbol } from 'src/core/ports/services/jwt.port';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModuleNest.register({}),
  ],
  providers: [
    {
      provide: IJwtServiceSymbol, // Token abstracto
      useClass: JwtService, // Implementación concreta
    },
  ],
  exports: [IJwtServiceSymbol],
})
export class JwtModule {}
