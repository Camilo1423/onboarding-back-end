import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { IRefreshTokenRepository } from 'src/core/ports/repositories/refresh-token.port';

@Injectable()
export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: string, token: string, expiresAt: string): Promise<void> {
    await this.prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(expiresAt),
      },
    });
  }

  async delete(token: string): Promise<void> {
    await this.prisma.refreshToken.delete({
      where: { token },
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  async findValid(token: string): Promise<{ userId: string } | null> {
    const result = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!result) return null;
    if (new Date(result.expiresAt) < new Date()) return null;

    return { userId: result.userId };
  }
}
