import { Household, Prisma } from '@prisma/client';

export interface HouseholdRepository {
  create(data: Prisma.HouseholdCreateInput): Promise<Household>;
  findById(id: string): Promise<Household | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.HouseholdWhereInput;
    orderBy?: Prisma.HouseholdOrderByWithRelationInput;
    include?: Prisma.HouseholdInclude;
  }): Promise<Household[]>;
  update(id: string, data: Prisma.HouseholdUpdateInput): Promise<Household>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.HouseholdWhereInput): Promise<number>;
  findByHeadId(headId: string): Promise<Household | null>;
  getStatistics(): Promise<{
    totalHouseholds: number;
    totalMembers: number;
    fourPsBeneficiaries: number;
    lowIncomeHouseholds: number;
  }>;
}
