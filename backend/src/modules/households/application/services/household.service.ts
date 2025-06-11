import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { HouseholdRepository } from '../../domain/interfaces/household.interface';
import { CreateHouseholdDto, UpdateHouseholdDto, HouseholdQueryDto } from '../dto/household.dto';
import { Household, Prisma } from '@prisma/client';

@Injectable()
export class HouseholdService {
  constructor(private readonly householdRepository: HouseholdRepository) {}

  async create(createHouseholdDto: CreateHouseholdDto): Promise<Household> {
    try {
      const householdData: Prisma.HouseholdCreateInput = {
        ...createHouseholdDto,
        head: {
          connect: { id: createHouseholdDto.headId }
        },
        totalMembers: 1, // Initial count with head
      };

      // Remove headId from the data since we're using connect
      const { headId, ...dataWithoutHeadId } = householdData;
      
      return await this.householdRepository.create(dataWithoutHeadId);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Head is already assigned to another household');
      }
      if (error.code === 'P2025') {
        throw new BadRequestException('Resident selected as head does not exist');
      }
      throw error;
    }
  }

  async findAll(query: HouseholdQueryDto): Promise<{
    data: Household[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.HouseholdWhereInput = {};

    if (query.search) {
      where.OR = [
        { completeAddress: { contains: query.search, mode: 'insensitive' } },
        { barangay: { contains: query.search, mode: 'insensitive' } },
        { streetSitio: { contains: query.search, mode: 'insensitive' } },
        { head: {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ]
        }},
      ];
    }

    if (query.barangay) {
      where.barangay = { contains: query.barangay, mode: 'insensitive' };
    }

    if (query.houseType) {
      where.houseType = query.houseType;
    }

    if (query.ownershipStatus) {
      where.ownershipStatus = query.ownershipStatus;
    }

    if (query.fourPsBeneficiary !== undefined) {
      where.fourPsBeneficiary = query.fourPsBeneficiary;
    }

    if (query.indigentFamily !== undefined) {
      where.indigentFamily = query.indigentFamily;
    }

    if (query.hasSeniorCitizen !== undefined) {
      where.hasSeniorCitizen = query.hasSeniorCitizen;
    }

    if (query.hasPwdMember !== undefined) {
      where.hasPwdMember = query.hasPwdMember;
    }

    // Build orderBy clause
    const orderBy: Prisma.HouseholdOrderByWithRelationInput = {};
    if (query.sortBy) {
      if (query.sortBy === 'headName') {
        orderBy.head = { lastName: query.sortOrder || 'asc' };
      } else {
        orderBy[query.sortBy] = query.sortOrder || 'asc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.householdRepository.findAll({ skip, take: limit, where, orderBy }),
      this.householdRepository.count(where),
    ]);

    // Update total members count for each household
    const householdsWithUpdatedCount = await Promise.all(
      data.map(async (household) => {
        const memberCount = household.members?.length || 0;
        if (memberCount !== household.totalMembers) {
          // Update the count in database
          await this.householdRepository.update(household.id, {
            totalMembers: memberCount
          });
          household.totalMembers = memberCount;
        }
        return household;
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      data: householdsWithUpdatedCount,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Household> {
    const household = await this.householdRepository.findById(id);
    if (!household) {
      throw new NotFoundException(`Household with ID ${id} not found`);
    }
    return household;
  }

  async update(id: string, updateHouseholdDto: UpdateHouseholdDto): Promise<Household> {
    // Check if household exists
    await this.findOne(id);

    const updateData: Prisma.HouseholdUpdateInput = {
      ...updateHouseholdDto,
      ...(updateHouseholdDto.headId && {
        head: {
          connect: { id: updateHouseholdDto.headId }
        }
      })
    };

    // Remove headId from the data since we're using connect
    const { headId, ...dataWithoutHeadId } = updateData;

    return await this.householdRepository.update(id, dataWithoutHeadId);
  }

  async remove(id: string): Promise<void> {
    // Check if household exists
    await this.findOne(id);
    
    // TODO: Check if there are any dependencies (documents, etc.) before deleting
    
    await this.householdRepository.delete(id);
  }

  async getStatistics(): Promise<{
    totalHouseholds: number;
    totalMembers: number;
    fourPsBeneficiaries: number;
    lowIncomeHouseholds: number;
    averageMembersPerHousehold: number;
    ownershipDistribution: {
      owned: number;
      rented: number;
      freeUse: number;
      other: number;
    };
  }> {
    const stats = await this.householdRepository.getStatistics();
    
    const [ownedCount, rentedCount, freeUseCount, otherCount] = await Promise.all([
      this.householdRepository.count({ ownershipStatus: 'OWNED' }),
      this.householdRepository.count({ ownershipStatus: 'RENTED' }),
      this.householdRepository.count({ ownershipStatus: 'FREE_USE' }),
      this.householdRepository.count({ ownershipStatus: 'OTHER' }),
    ]);

    const averageMembersPerHousehold = stats.totalHouseholds > 0 
      ? Math.round((stats.totalMembers / stats.totalHouseholds) * 100) / 100
      : 0;

    return {
      ...stats,
      averageMembersPerHousehold,
      ownershipDistribution: {
        owned: ownedCount,
        rented: rentedCount,
        freeUse: freeUseCount,
        other: otherCount,
      },
    };
  }
}
