import { Document, Prisma } from '@prisma/client';

export interface DocumentRepository {
  create(data: Prisma.DocumentCreateInput): Promise<Document>;
  findById(id: string): Promise<Document | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DocumentWhereInput;
    orderBy?: Prisma.DocumentOrderByWithRelationInput;
    include?: Prisma.DocumentInclude;
  }): Promise<Document[]>;
  update(id: string, data: Prisma.DocumentUpdateInput): Promise<Document>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.DocumentWhereInput): Promise<number>;
  findByResidentId(residentId: string): Promise<Document[]>;
  findByDocumentNumber(documentNumber: string): Promise<Document | null>;
  generateDocumentNumber(documentType: string): Promise<string>;
}
