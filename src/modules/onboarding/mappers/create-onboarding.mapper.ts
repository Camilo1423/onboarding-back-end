import { Onboarding } from 'src/core/domain/entities/onboarding.entity';
import { CreateOnboardingDto } from '../dtos/create-onboarding.dto';

export class CreateOnboardingMapper {
  static toDomain(dto: CreateOnboardingDto): Onboarding {
    return new Onboarding(
      '',
      dto.name_onboarding,
      dto.description_onboarding,
      dto.start_date,
      dto.end_date,
      '',
      dto.collaborator_ids,
    );
  }
}
