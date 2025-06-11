import { BarangayOfficial, Prisma } from '@prisma/client';

export interface BarangayOfficialRepository {
  create(data: Prisma.BarangayOfficialCreateInput): Promise<BarangayOfficial>;
  findById(id: string): Promise<BarangayOfficial | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BarangayOfficialWhereInput;
    orderBy?: Prisma.BarangayOfficialOrderByWithRelationInput;
    include?: Prisma.BarangayOfficialInclude;
  }): Promise<BarangayOfficial[]>;
  update(id: string, data: Prisma.BarangayOfficialUpdateInput): Promise<BarangayOfficial>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.BarangayOfficialWhereInput): Promise<number>;
  findActiveOfficials(): Promise<BarangayOfficial[]>;
  findByPosition(position: string): Promise<BarangayOfficial[]>;
}
