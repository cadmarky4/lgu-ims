import { Resident, Prisma } from '@prisma/client';

export interface ResidentRepository {
  create(data: Prisma.ResidentCreateInput): Promise<Resident>;
  findById(id: string): Promise<Resident | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ResidentWhereInput;
    orderBy?: Prisma.ResidentOrderByWithRelationInput;
    include?: Prisma.ResidentInclude;
  }): Promise<Resident[]>;
  update(id: string, data: Prisma.ResidentUpdateInput): Promise<Resident>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.ResidentWhereInput): Promise<number>;
  findByHouseholdId(householdId: string): Promise<Resident[]>;
  findHouseholdHeads(): Promise<Resident[]>;
  search(query: string): Promise<Resident[]>;
}
