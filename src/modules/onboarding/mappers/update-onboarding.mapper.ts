import { Onboarding } from 'src/core/domain/entities/onboarding.entity';
import { UpdateOnboardingDto } from '../dtos/update-onboarding.dto';

export class UpdateOnboardingMapper {
  static toDomain(dto: UpdateOnboardingDto): Onboarding {
    return new Onboarding(
      '',
      dto.name_onboarding,
      dto.description_onboarding,
      dto.start_date,
      dto.end_date,
      '',
      dto.new_collaborator_ids,
    );
  }
}
