import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;

    if (!activate) {
      throw new UnauthorizedException('Token de actualización no válido');
    }

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];
    const token = authHeader.split(' ')[1];

    request.user = {
      ...request.user,
      token,
    };

    return true;
  }
}
