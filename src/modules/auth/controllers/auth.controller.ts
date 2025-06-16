import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { NewAccountDto } from '../dtos/new-account.dto';
import { GetInfoUserUseCase } from '../use-cases/get-info-user.use-case';
import { LoginUseCase } from '../use-cases/login.use-case';
import { NewAccountUseCase } from '../use-cases/new-account.use-case';
import { AccessTokenGuard } from '../../../infrastructure/services/jwt/guards/access-token.guard';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { RefreshTokenGuard } from 'src/infrastructure/services/jwt/guards/refresh-token.guard';
import { LogoutUseCase } from '../use-cases/logout.use-case';
import { Request } from 'src/common/type/Request';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly newAccountUseCase: NewAccountUseCase,
    private readonly getInfoUserUseCase: GetInfoUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const result = await this.loginUseCase.execute(
      dto.user_email,
      dto.user_password,
    );
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Req() req: Request) {
    const result = await this.refreshTokenUseCase.execute(req.user.token);
    return result;
  }

  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request) {
    const result = await this.logoutUseCase.execute(req.user.id);
    return result;
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @HttpCode(200)
  async me(@Req() req: Request) {
    const result = await this.getInfoUserUseCase.execute(req.user.id);
    return result;
  }

  @Post('create-account')
  @HttpCode(200)
  async createAccount(@Body() dto: NewAccountDto) {
    const result = await this.newAccountUseCase.execute(dto);
    return result;
  }
}
