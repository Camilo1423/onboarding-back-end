import { Collaborator } from 'src/core/domain/entities/collaborator.entity';
import { UpdateCollaboratorDto } from '../dtos/update-collaborator.dto';

export class UpdateCollaboratorMapper {
  static toDomain(dto: UpdateCollaboratorDto): Collaborator {
    return Collaborator.create(
      dto.name_collaborator,
      dto.email_collaborator,
      dto.entry_date,
      dto.id,
      dto.technical_onboarding_done,
      dto.welcome_onboarding_done,
    );
  }
}
