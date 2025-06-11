import { PrismaClient } from '@prisma/client';
import { getDatabase } from '@/infrastructure/database/connection';
import { ResidentRepository } from '../../domain/interfaces/resident.interface';
import { Resident, Prisma } from '@prisma/client';

export class PrismaResidentRepository implements ResidentRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = getDatabase();
  }

  async create(data: Prisma.ResidentCreateInput): Promise<Resident> {
    return this.prisma.resident.create({
      data,
      include: {
        household: true,
        householdsAsHead: true,
        documents: true,
      },
    });
  }

  async findById(id: string): Promise<Resident | null> {
    return this.prisma.resident.findUnique({
      where: { id },
      include: {
        household: true,
        householdsAsHead: true,
        documents: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ResidentWhereInput;
    orderBy?: Prisma.ResidentOrderByWithRelationInput;
    include?: Prisma.ResidentInclude;
  }): Promise<Resident[]> {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.resident.findMany({
      skip,
      take,
      where,
      orderBy,
      include: include || {
        household: true,
        householdsAsHead: true,
        documents: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async update(id: string, data: Prisma.ResidentUpdateInput): Promise<Resident> {
    return this.prisma.resident.update({
      where: { id },
      data,
      include: {
        household: true,
        householdsAsHead: true,
        documents: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.resident.delete({
      where: { id },
    });
  }

  async count(where?: Prisma.ResidentWhereInput): Promise<number> {
    return this.prisma.resident.count({ where });
  }

  async findByHouseholdId(householdId: string): Promise<Resident[]> {
    return this.prisma.resident.findMany({
      where: { householdId },
      include: {
        household: true,
      },
    });
  }

  async findHouseholdHeads(): Promise<Resident[]> {
    return this.prisma.resident.findMany({
      where: { isHouseholdHead: true },
      include: {
        householdsAsHead: true,
      },
    });
  }

  async search(query: string): Promise<Resident[]> {
    return this.prisma.resident.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { middleName: { contains: query, mode: 'insensitive' } },
          { completeAddress: { contains: query, mode: 'insensitive' } },
          { mobileNumber: { contains: query, mode: 'insensitive' } },
          { emailAddress: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
      include: {
        household: true,
      },
    });
  }
}
