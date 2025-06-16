import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { OnboardingType } from 'src/core/domain/entities/onboarding.entity';

export class CreateOnboardingDto {
  @ApiProperty({
    description: 'Type of onboarding process',
    enum: ['technical', 'welcome'],
    example: 'technical',
  })
  @IsString({ message: 'Tipo de proceso de onboarding inválido' })
  @IsIn(['technical', 'welcome'], {
    message: 'Tipo de proceso de onboarding inválido',
  })
  type: OnboardingType;

  @ApiProperty({
    description: 'Name of the onboarding process',
    example: 'New Employee Onboarding 2024',
  })
  @IsString()
  name_onboarding: string;

  @ApiProperty({
    description: 'Description of the onboarding process',
    example: 'Onboarding process for new employees joining in Q1 2024',
  })
  @IsString()
  description_onboarding: string;

  @ApiProperty({
    description: 'Start date of the onboarding process',
    example: '2024-01-01',
  })
  @IsString({ message: 'Fecha de inicio inválida' })
  start_date: string;

  @ApiProperty({
    description: 'End date of the onboarding process',
    example: '2024-01-31',
  })
  @IsString({ message: 'Fecha de fin inválida' })
  end_date: string;

  @ApiProperty({
    description: 'Array of collaborator IDs',
    example: ['123', '456'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collaborator_ids?: string[];
}
