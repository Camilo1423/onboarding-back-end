import { Collaborator } from 'src/core/domain/entities/collaborator.entity';
import { NewCollaboratorDto } from '../dtos/new-collaborator.dto';

export class CollaboratorMapper {
  static toDomain(dto: NewCollaboratorDto): Collaborator {
    return Collaborator.create(
      dto.name_collaborator,
      dto.email_collaborator,
      dto.entry_date,
    );
  }
}
