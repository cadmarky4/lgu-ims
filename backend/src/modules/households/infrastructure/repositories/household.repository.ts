import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { HouseholdRepository } from '../../domain/interfaces/household.interface';
import { Household, Prisma } from '@prisma/client';

@Injectable()
export class PrismaHouseholdRepository implements HouseholdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.HouseholdCreateInput): Promise<Household> {
    return this.prisma.household.create({
      data,
      include: {
        head: true,
        members: true,
      },
    });
  }

  async findById(id: string): Promise<Household | null> {
    return this.prisma.household.findUnique({
      where: { id },
      include: {
        head: true,
        members: {
          orderBy: { firstName: 'asc' },
        },
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.HouseholdWhereInput;
    orderBy?: Prisma.HouseholdOrderByWithRelationInput;
    include?: Prisma.HouseholdInclude;
  }): Promise<Household[]> {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.household.findMany({
      skip,
      take,
      where,
      orderBy,
      include: include || {
        head: true,
        members: {
          take: 10,
          orderBy: { firstName: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: Prisma.HouseholdUpdateInput): Promise<Household> {
    return this.prisma.household.update({
      where: { id },
      data,
      include: {
        head: true,
        members: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.household.delete({
      where: { id },
    });
  }

  async count(where?: Prisma.HouseholdWhereInput): Promise<number> {
    return this.prisma.household.count({ where });
  }

  async findByHeadId(headId: string): Promise<Household | null> {
    return this.prisma.household.findUnique({
      where: { headId },
      include: {
        head: true,
        members: true,
      },
    });
  }

  async getStatistics(): Promise<{
    totalHouseholds: number;
    totalMembers: number;
    fourPsBeneficiaries: number;
    lowIncomeHouseholds: number;
  }> {
    const [
      totalHouseholds,
      totalMembersResult,
      fourPsBeneficiaries,
      lowIncomeHouseholds,
    ] = await Promise.all([
      this.prisma.household.count(),
      this.prisma.household.aggregate({
        _sum: {
          totalMembers: true,
        },
      }),
      this.prisma.household.count({ where: { fourPsBeneficiary: true } }),
      this.prisma.household.count({ 
        where: { 
          monthlyIncome: { 
            lte: 15000 // Assuming low income threshold
          } 
        } 
      }),
    ]);

    return {
      totalHouseholds,
      totalMembers: totalMembersResult._sum.totalMembers || 0,
      fourPsBeneficiaries,
      lowIncomeHouseholds,
    };
  }
}
