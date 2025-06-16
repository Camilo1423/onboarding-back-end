import { User } from 'src/core/domain/entities/user.entity';
import { NewAccountDto } from '../dtos/new-account.dto';

export class UserMapper {
  static toDomain(user: NewAccountDto): User {
    return new User(
      '1',
      user.user_email,
      user.user_password,
      user.user_name,
      '',
    );
  }
}
