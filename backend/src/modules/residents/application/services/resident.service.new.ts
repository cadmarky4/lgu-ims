// Note: Adapted to Express.js patterns, removing NestJS dependencies
import { ResidentRepository } from '../../domain/interfaces/resident.interface';
import { CreateResidentDto, UpdateResidentDto, ResidentQueryDto } from '../dto/resident.dto';
import { Resident, Prisma } from '@prisma/client';
import { ValidationError, NotFoundError, ConflictError } from '@/shared/utils/errors';

export class ResidentService {
  constructor(private readonly residentRepository: ResidentRepository) {}

  async create(createResidentDto: CreateResidentDto): Promise<Resident> {
    try {
      // Convert birthDate string to Date object
      const birthDate = new Date(createResidentDto.birthDate);
      
      const residentData: Prisma.ResidentCreateInput = {
        ...createResidentDto,
        birthDate,
        // Handle household connection if provided
        ...(createResidentDto.householdId && {
          household: {
            connect: { id: createResidentDto.householdId }
          }
        })
      };

      return await this.residentRepository.create(residentData);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictError('Duplicate entry for unique field');
      }
      throw new ValidationError('Failed to create resident');
    }
  }

  async findAll(query: ResidentQueryDto): Promise<{
    data: Resident[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ResidentWhereInput = {};

    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { middleName: { contains: query.search, mode: 'insensitive' } },
        { completeAddress: { contains: query.search, mode: 'insensitive' } },
        { mobileNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.gender) {
      where.gender = query.gender;
    }

    if (query.civilStatus) {
      where.civilStatus = query.civilStatus;
    }

    if (query.purok) {
      where.purok = { contains: query.purok, mode: 'insensitive' };
    }

    if (query.seniorCitizen !== undefined) {
      where.seniorCitizen = query.seniorCitizen;
    }

    if (query.personWithDisability !== undefined) {
      where.personWithDisability = query.personWithDisability;
    }

    if (query.fourPsBeneficiary !== undefined) {
      where.fourPsBeneficiary = query.fourPsBeneficiary;
    }

    if (query.isHouseholdHead !== undefined) {
      where.isHouseholdHead = query.isHouseholdHead;
    }

    // Build orderBy clause
    const orderBy: Prisma.ResidentOrderByWithRelationInput = {};
    if (query.sortBy) {
      // Type-safe property access
      const sortByField = query.sortBy as keyof Prisma.ResidentOrderByWithRelationInput;
      orderBy[sortByField] = query.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.residentRepository.findAll({ skip, take: limit, where, orderBy }),
      this.residentRepository.count(where),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<Resident> {
    const resident = await this.residentRepository.findById(id);
    if (!resident) {
      throw new NotFoundError(`Resident with ID ${id} not found`);
    }
    return resident;
  }

  async update(id: string, updateResidentDto: UpdateResidentDto): Promise<Resident> {
    // Check if resident exists
    await this.findOne(id);

    const updateData: Prisma.ResidentUpdateInput = {
      ...updateResidentDto,
      ...(updateResidentDto.birthDate && {
        birthDate: new Date(updateResidentDto.birthDate)
      }),
      ...(updateResidentDto.householdId && {
        household: {
          connect: { id: updateResidentDto.householdId }
        }
      })
    };

    return await this.residentRepository.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    // Check if resident exists
    await this.findOne(id);
    
    // Check if resident is a household head
    const resident = await this.residentRepository.findById(id);
    if (resident?.isHouseholdHead) {
      throw new ValidationError('Cannot delete resident who is a household head');
    }

    await this.residentRepository.delete(id);
  }

  async search(query: string): Promise<Resident[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }
    return await this.residentRepository.search(query.trim());
  }

  async getHouseholdHeads(): Promise<Resident[]> {
    return await this.residentRepository.findHouseholdHeads();
  }

  async getStatistics(): Promise<{
    totalResidents: number;
    maleResidents: number;
    femaleResidents: number;
    seniorCitizens: number;
    pwdMembers: number;
    fourPsBeneficiaries: number;
    householdHeads: number;
  }> {
    const [
      totalResidents,
      maleResidents,
      femaleResidents,
      seniorCitizens,
      pwdMembers,
      fourPsBeneficiaries,
      householdHeads,
    ] = await Promise.all([
      this.residentRepository.count(),
      this.residentRepository.count({ gender: 'MALE' }),
      this.residentRepository.count({ gender: 'FEMALE' }),
      this.residentRepository.count({ seniorCitizen: true }),
      this.residentRepository.count({ personWithDisability: true }),
      this.residentRepository.count({ fourPsBeneficiary: true }),
      this.residentRepository.count({ isHouseholdHead: true }),
    ]);

    return {
      totalResidents,
      maleResidents,
      femaleResidents,
      seniorCitizens,
      pwdMembers,
      fourPsBeneficiaries,
      householdHeads,
    };
  }
}
