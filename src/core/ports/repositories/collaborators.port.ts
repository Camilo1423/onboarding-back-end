import { Collaborator } from '../../domain/entities/collaborator.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICollaboratorPort {
  create(collaborator: Collaborator): Promise<Collaborator>;
  findById(id: string): Promise<Collaborator | null>;
  findByEmail(email: string): Promise<Collaborator | null>;
  findAll(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<PaginatedResult<Collaborator>>;
  findByIds(ids: string[]): Promise<Collaborator[]>;
  update(id: string, collaborator: Collaborator): Promise<Collaborator>;
  delete(id: string): Promise<void>;
}
