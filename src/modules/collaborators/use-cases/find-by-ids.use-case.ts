import { Collaborator } from 'src/core/domain/entities/collaborator.entity';
import { ICollaboratorPort } from 'src/core/ports/repositories/collaborators.port';

export class FindByIdsUseCase {
  constructor(private readonly collaboratorRepository: ICollaboratorPort) {}

  async execute(ids: string[]): Promise<Collaborator[]> {
    return this.collaboratorRepository.findByIds(ids);
  }
}
