import { User } from '../../domain/entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<{
    success: boolean;
    message: string;
  }>;
}

export const IUserRepositorySymbol = Symbol('IUserRepository');
