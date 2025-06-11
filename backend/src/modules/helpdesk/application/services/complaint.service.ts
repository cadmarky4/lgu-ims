import { Injectable, NotFoundException } from '@nestjs/common';
import { ComplaintRepository } from '../../domain/interfaces/helpdesk.interface';
import { CreateComplaintDto, UpdateComplaintDto, ComplaintQueryDto } from '../dto/complaint.dto';
import { Complaint, Prisma, ComplaintStatus } from '@prisma/client';

@Injectable()
export class ComplaintService {
  constructor(private readonly complaintRepository: ComplaintRepository) {}

  async create(createComplaintDto: CreateComplaintDto): Promise<Complaint> {
    const complaintData: Prisma.ComplaintCreateInput = {
      ...createComplaintDto,
      status: ComplaintStatus.FILED,
    };

    return await this.complaintRepository.create(complaintData);
  }

  async findAll(query: ComplaintQueryDto): Promise<{
    data: Complaint[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ComplaintWhereInput = {};

    if (query.search) {
      where.OR = [
        { complainantName: { contains: query.search, mode: 'insensitive' } },
        { subject: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.complaintType) {
      where.complaintType = query.complaintType;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.priority) {
      where.priority = query.priority;
    }

    if (query.assignedTo) {
      where.assignedTo = { contains: query.assignedTo, mode: 'insensitive' };
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.createdAt.lte = new Date(query.dateTo);
      }
    }

    // Build orderBy clause
    const orderBy: Prisma.ComplaintOrderByWithRelationInput = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [data, total] = await Promise.all([
      this.complaintRepository.findAll({ skip, take: limit, where, orderBy }),
      this.complaintRepository.count(where),
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

  async findOne(id: string): Promise<Complaint> {
    const complaint = await this.complaintRepository.findById(id);
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }
    return complaint;
  }

  async update(id: string, updateComplaintDto: UpdateComplaintDto): Promise<Complaint> {
    // Check if complaint exists
    await this.findOne(id);

    const updateData: Prisma.ComplaintUpdateInput = {
      ...updateComplaintDto,
      ...(updateComplaintDto.assignedDate && {
        assignedDate: new Date(updateComplaintDto.assignedDate)
      }),
      ...(updateComplaintDto.resolvedDate && {
        resolvedDate: new Date(updateComplaintDto.resolvedDate)
      }),
    };

    return await this.complaintRepository.update(id, updateData);
  }

  async assignComplaint(id: string, assignedTo: string): Promise<Complaint> {
    return await this.complaintRepository.update(id, {
      assignedTo,
      assignedDate: new Date(),
      status: ComplaintStatus.IN_PROGRESS,
    });
  }

  async resolveComplaint(id: string, resolution: string): Promise<Complaint> {
    return await this.complaintRepository.update(id, {
      status: ComplaintStatus.RESOLVED,
      resolution,
      resolvedDate: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    // Check if complaint exists
    await this.findOne(id);
    
    await this.complaintRepository.delete(id);
  }

  async getStatistics(): Promise<{
    totalComplaints: number;
    filedComplaints: number;
    inProgressComplaints: number;
    resolvedComplaints: number;
    dismissedComplaints: number;
    complaintsByType: Record<string, number>;
  }> {
    const [
      totalComplaints,
      filedComplaints,
      inProgressComplaints,
      resolvedComplaints,
      dismissedComplaints,
    ] = await Promise.all([
      this.complaintRepository.count(),
      this.complaintRepository.count({ status: ComplaintStatus.FILED }),
      this.complaintRepository.count({ status: ComplaintStatus.IN_PROGRESS }),
      this.complaintRepository.count({ status: ComplaintStatus.RESOLVED }),
      this.complaintRepository.count({ status: ComplaintStatus.DISMISSED }),
    ]);

    // Get complaint counts by type
    const complaintTypes = ['NOISE_COMPLAINT', 'PROPERTY_DISPUTE', 'HARASSMENT', 'VIOLENCE', 'THEFT'];
    const complaintsByType: Record<string, number> = {};
    
    for (const type of complaintTypes) {
      complaintsByType[type] = await this.complaintRepository.count({ complaintType: type as any });
    }

    return {
      totalComplaints,
      filedComplaints,
      inProgressComplaints,
      resolvedComplaints,
      dismissedComplaints,
      complaintsByType,
    };
  }
}
