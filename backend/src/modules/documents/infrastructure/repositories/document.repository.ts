import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { DocumentRepository } from '../../domain/interfaces/document.interface';
import { Document, Prisma, DocumentType } from '@prisma/client';

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    return this.prisma.document.create({
      data,
      include: {
        resident: true,
      },
    });
  }

  async findById(id: string): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { id },
      include: {
        resident: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DocumentWhereInput;
    orderBy?: Prisma.DocumentOrderByWithRelationInput;
    include?: Prisma.DocumentInclude;
  }): Promise<Document[]> {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.document.findMany({
      skip,
      take,
      where,
      orderBy,
      include: include || {
        resident: true,
      },
    });
  }

  async update(id: string, data: Prisma.DocumentUpdateInput): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data,
      include: {
        resident: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({
      where: { id },
    });
  }

  async count(where?: Prisma.DocumentWhereInput): Promise<number> {
    return this.prisma.document.count({ where });
  }

  async findByResidentId(residentId: string): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: { residentId },
      include: {
        resident: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByDocumentNumber(documentNumber: string): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { documentNumber },
      include: {
        resident: true,
      },
    });
  }

  async generateDocumentNumber(documentType: string): Promise<string> {
    // Generate document number based on type and current year
    const year = new Date().getFullYear();
    const typePrefix = this.getDocumentTypePrefix(documentType);
    
    // Get the count of documents of this type for this year
    const count = await this.prisma.document.count({
      where: {
        documentType: documentType as DocumentType,
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `${typePrefix}-${year}-${sequence}`;
  }

  private getDocumentTypePrefix(documentType: string): string {
    const prefixes: Record<string, string> = {
      'BARANGAY_CLEARANCE': 'BC',
      'BUSINESS_PERMIT': 'BP',
      'CERTIFICATE_OF_INDIGENCY': 'CI',
      'CERTIFICATE_OF_RESIDENCY': 'CR',
      'CERTIFICATE_OF_EMPLOYMENT': 'CE',
      'CERTIFICATE_OF_LOW_INCOME': 'CLI',
    };
    return prefixes[documentType] || 'DOC';
  }
}
