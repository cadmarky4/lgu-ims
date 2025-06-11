import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DocumentRepository } from '../../domain/interfaces/document.interface';
import { CreateDocumentDto, UpdateDocumentDto, DocumentQueryDto } from '../dto/document.dto';
import { Document, Prisma, DocumentStatus } from '@prisma/client';

@Injectable()
export class DocumentService {
  constructor(private readonly documentRepository: DocumentRepository) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    try {
      // Generate unique document number
      const documentNumber = await this.documentRepository.generateDocumentNumber(
        createDocumentDto.documentType
      );

      const documentData: Prisma.DocumentCreateInput = {
        ...createDocumentDto,
        documentNumber,
        resident: {
          connect: { id: createDocumentDto.residentId }
        },
        status: DocumentStatus.PENDING,
      };

      // Remove residentId from the data since we're using connect
      const { residentId, ...dataWithoutResidentId } = documentData;

      return await this.documentRepository.create(dataWithoutResidentId);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Resident does not exist');
      }
      throw error;
    }
  }

  async findAll(query: DocumentQueryDto): Promise<{
    data: Document[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.DocumentWhereInput = {};

    if (query.search) {
      where.OR = [
        { documentNumber: { contains: query.search, mode: 'insensitive' } },
        { purposeOfRequest: { contains: query.search, mode: 'insensitive' } },
        { resident: {
          OR: [
            { firstName: { contains: query.search, mode: 'insensitive' } },
            { lastName: { contains: query.search, mode: 'insensitive' } },
          ]
        }},
      ];
    }

    if (query.documentType) {
      where.documentType = query.documentType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.residentId) {
      where.residentId = query.residentId;
    }

    if (query.certifyingOfficial) {
      where.certifyingOfficial = { contains: query.certifyingOfficial, mode: 'insensitive' };
    }

    if (query.dateFrom || query.dateTo) {
      where.applicationDate = {};
      if (query.dateFrom) {
        where.applicationDate.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.applicationDate.lte = new Date(query.dateTo);
      }
    }

    // Build orderBy clause
    const orderBy: Prisma.DocumentOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'asc';
    } else {
      orderBy.applicationDate = 'desc';
    }

    const [data, total] = await Promise.all([
      this.documentRepository.findAll({ skip, take: limit, where, orderBy }),
      this.documentRepository.count(where),
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

  async findOne(id: string): Promise<Document> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  async findByDocumentNumber(documentNumber: string): Promise<Document> {
    const document = await this.documentRepository.findByDocumentNumber(documentNumber);
    if (!document) {
      throw new NotFoundException(`Document with number ${documentNumber} not found`);
    }
    return document;
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    // Check if document exists
    await this.findOne(id);

    const updateData: Prisma.DocumentUpdateInput = {
      ...updateDocumentDto,
      ...(updateDocumentDto.processedDate && {
        processedDate: new Date(updateDocumentDto.processedDate)
      }),
      ...(updateDocumentDto.approvedDate && {
        approvedDate: new Date(updateDocumentDto.approvedDate)
      }),
      ...(updateDocumentDto.rejectedDate && {
        rejectedDate: new Date(updateDocumentDto.rejectedDate)
      }),
    };

    return await this.documentRepository.update(id, updateData);
  }

  async updateStatus(id: string, status: DocumentStatus, notes?: string): Promise<Document> {
    const updateData: Prisma.DocumentUpdateInput = {
      status,
      ...(status === DocumentStatus.IN_PROGRESS && {
        processedDate: new Date()
      }),
      ...(status === DocumentStatus.APPROVED && {
        approvedDate: new Date()
      }),
      ...(status === DocumentStatus.REJECTED && {
        rejectedDate: new Date(),
        rejectionReason: notes
      }),
      ...(status === DocumentStatus.COMPLETED && {
        approvedDate: new Date()
      }),
    };

    return await this.documentRepository.update(id, updateData);
  }

  async remove(id: string): Promise<void> {
    // Check if document exists
    await this.findOne(id);
    
    await this.documentRepository.delete(id);
  }

  async findByResidentId(residentId: string): Promise<Document[]> {
    return await this.documentRepository.findByResidentId(residentId);
  }

  async getStatistics(): Promise<{
    totalDocuments: number;
    pendingDocuments: number;
    approvedDocuments: number;
    rejectedDocuments: number;
    inProgressDocuments: number;
    completedDocuments: number;
    documentsByType: Record<string, number>;
  }> {
    const [
      totalDocuments,
      pendingDocuments,
      approvedDocuments,
      rejectedDocuments,
      inProgressDocuments,
      completedDocuments,
    ] = await Promise.all([
      this.documentRepository.count(),
      this.documentRepository.count({ status: DocumentStatus.PENDING }),
      this.documentRepository.count({ status: DocumentStatus.APPROVED }),
      this.documentRepository.count({ status: DocumentStatus.REJECTED }),
      this.documentRepository.count({ status: DocumentStatus.IN_PROGRESS }),
      this.documentRepository.count({ status: DocumentStatus.COMPLETED }),
    ]);

    // Get document counts by type
    const documentTypes = ['BARANGAY_CLEARANCE', 'BUSINESS_PERMIT', 'CERTIFICATE_OF_INDIGENCY', 'CERTIFICATE_OF_RESIDENCY'];
    const documentsByType: Record<string, number> = {};
    
    for (const type of documentTypes) {
      documentsByType[type] = await this.documentRepository.count({ documentType: type as any });
    }

    return {
      totalDocuments,
      pendingDocuments,
      approvedDocuments,
      rejectedDocuments,
      inProgressDocuments,
      completedDocuments,
      documentsByType,
    };
  }
}
