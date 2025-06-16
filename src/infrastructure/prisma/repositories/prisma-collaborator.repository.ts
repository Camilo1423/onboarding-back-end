import { PrismaService } from 'src/config/prisma.service';
import { Collaborator } from '../../../core/domain/entities/collaborator.entity';
import {
  ICollaboratorPort,
  PaginatedResult,
} from '../../../core/ports/repositories/collaborators.port';
import { envConfig } from 'src/config/env.config';
import { Inject } from '@nestjs/common';

export class PrismaCollaboratorRepository implements ICollaboratorPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('CONFIG') private readonly config: typeof envConfig,
  ) {}

  async findByIds(ids: string[]): Promise<Collaborator[]> {
    const collaborators = await this.prisma.collaborator.findMany({
      where: {
        id: { in: ids },
      },
    });

    return collaborators.map(this.mapToEntity);
  }

  async create(collaborator: Collaborator): Promise<Collaborator> {
    const created = await this.prisma.collaborator.create({
      data: {
        fullName: collaborator.fullName,
        email: collaborator.email,
        entryDate: new Date(collaborator.entryDate),
        technicalOnboardingDone: collaborator.technicalOnboardingDone,
        welcomeOnboardingDone: collaborator.welcomeOnboardingDone,
      },
    });

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Collaborator | null> {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { id },
    });

    return collaborator ? this.mapToEntity(collaborator) : null;
  }

  async findByEmail(email: string): Promise<Collaborator | null> {
    const collaborator = await this.prisma.collaborator.findUnique({
      where: { email },
    });

    return collaborator ? this.mapToEntity(collaborator) : null;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<PaginatedResult<Collaborator>> {
    const skip = (page - 1) * limit;

    const [total, collaborators] = await Promise.all([
      this.prisma.collaborator.count({
        where: search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : undefined,
      }),
      this.prisma.collaborator.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        where: search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : undefined,
      }),
    ]);

    return {
      data: collaborators.map(this.mapToEntity),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, collaborator: Collaborator): Promise<Collaborator> {
    const updated = await this.prisma.collaborator.update({
      where: { id },
      data: {
        fullName: collaborator.fullName,
        email: collaborator.email,
        entryDate: collaborator.entryDate,
        technicalOnboardingDone: collaborator.technicalOnboardingDone,
        welcomeOnboardingDone: collaborator.welcomeOnboardingDone,
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.onboardingAssignment.deleteMany({
      where: {
        collaboratorId: id,
      },
    });

    await this.prisma.welcomeOnboardingAssignment.deleteMany({
      where: {
        collaboratorId: id,
      },
    });

    await this.prisma.collaborator.delete({
      where: { id },
    });
  }

  private mapToEntity(prismaCollaborator: any): Collaborator {
    return new Collaborator(
      prismaCollaborator.id,
      prismaCollaborator.fullName,
      prismaCollaborator.email,
      prismaCollaborator.entryDate,
      prismaCollaborator.technicalOnboardingDone,
      prismaCollaborator.welcomeOnboardingDone,
      prismaCollaborator.createdAt,
      prismaCollaborator.updatedAt,
    );
  }
}

export const ICollaboratorPortSymbol = Symbol('ICollaboratorPort');
