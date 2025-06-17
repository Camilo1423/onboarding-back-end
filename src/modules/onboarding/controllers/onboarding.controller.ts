import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOnboardingUseCase } from '../use-cases/create-onboarding.use-case';
import { CreateOnboardingDto } from '../dtos/create-onboarding.dto';
import { UpdateOnboardingDto } from '../dtos/update-onboarding.dto';
import { UpdateOnboardingUseCase } from '../use-cases/update-onboarding.use-case';
import { DeleteOnboardingUseCase } from '../use-cases/delete-onboarding.use-case';
import { ApiQuery } from '@nestjs/swagger';
import { OnboardingType } from 'src/core/domain/entities/onboarding.entity';
import { AccessTokenGuard } from 'src/infrastructure/services/jwt/guards/access-token.guard';
import { GetOnboardingByDayUseCase } from '../use-cases/get-onboarding-by-day.use-case';
import { GetDetailedOnboardingUseCase } from '../use-cases/get-detailed-onboarding.use-case';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly createOnboardingUseCase: CreateOnboardingUseCase,
    private readonly updateOnboardingUseCase: UpdateOnboardingUseCase,
    private readonly deleteOnboardingUseCase: DeleteOnboardingUseCase,
    private readonly getOnboardingByDayUseCase: GetOnboardingByDayUseCase,
    private readonly getDetailedOnboardingUseCase: GetDetailedOnboardingUseCase,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post('create-onboarding')
  async createOnboarding(@Body() createOnboardingDto: CreateOnboardingDto) {
    return this.createOnboardingUseCase.execute(createOnboardingDto);
  }

  @UseGuards(AccessTokenGuard)
  @Put('update-onboarding')
  async updateOnboarding(@Body() updateOnboardingDto: UpdateOnboardingDto) {
    return this.updateOnboardingUseCase.execute(updateOnboardingDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('delete-onboarding')
  @ApiQuery({
    name: 'type',
    type: String,
    enum: ['technical', 'welcome'],
    required: true,
  })
  @ApiQuery({ name: 'id', type: String, required: true })
  async deleteOnboarding(
    @Query('type') type: OnboardingType,
    @Query('id') id: string,
  ) {
    return this.deleteOnboardingUseCase.execute(type, id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-onboarding-by-day')
  @ApiQuery({ name: 'day', type: String, required: true })
  async getOnboardingByDay(@Query('day') day: string) {
    const response = await this.getOnboardingByDayUseCase.execute(day);
    return response;
  }

  @UseGuards(AccessTokenGuard)
  @Get('get-detailed-onboarding')
  @ApiQuery({ name: 'id', type: String, required: true })
  async getDetailedOnboarding(@Query('id') id: string) {
    const response = await this.getDetailedOnboardingUseCase.execute(id);
    return response;
  }
}
