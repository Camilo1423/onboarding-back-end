import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { envConfig } from 'src/config/env.config';
import { PrismaService } from 'src/config/prisma.service';
import { User } from 'src/core/domain/entities/user.entity';
import { IUserRepository } from 'src/core/ports/repositories/user.repository.port';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CONFIG') private readonly config: typeof envConfig,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return new User(user.id, user.email, user.password, user.name, user.role);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    return new User(user.id, user.email, user.password, user.name, user.role);
  }

  async create(user: User): Promise<{ success: boolean; message: string }> {
    const found = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (found)
      return {
        success: false,
        message: 'El correo electrónico ya está en uso',
      };

    const hashedPassword = await bcrypt.hash(
      user.password,
      this.config.bcrypt.saltRounds,
    );

    await this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
      },
    });

    return {
      success: true,
      message: 'Usuario creado correctamente',
    };
  }
}
