import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/database/prisma.service';
import { ComplaintRepository, SuggestionRepository, BlotterCaseRepository, AppointmentRepository } from '../../domain/interfaces/helpdesk.interface';
import { Complaint, Suggestion, BlotterCase, Appointment, Prisma } from '@prisma/client';

@Injectable()
export class PrismaComplaintRepository implements ComplaintRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ComplaintCreateInput): Promise<Complaint> {
    return this.prisma.complaint.create({ data });
  }

  async findById(id: string): Promise<Complaint | null> {
    return this.prisma.complaint.findUnique({ where: { id } });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ComplaintWhereInput;
    orderBy?: Prisma.ComplaintOrderByWithRelationInput;
  }): Promise<Complaint[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.complaint.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async update(id: string, data: Prisma.ComplaintUpdateInput): Promise<Complaint> {
    return this.prisma.complaint.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.complaint.delete({ where: { id } });
  }

  async count(where?: Prisma.ComplaintWhereInput): Promise<number> {
    return this.prisma.complaint.count({ where });
  }
}

@Injectable()
export class PrismaSuggestionRepository implements SuggestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SuggestionCreateInput): Promise<Suggestion> {
    return this.prisma.suggestion.create({ data });
  }

  async findById(id: string): Promise<Suggestion | null> {
    return this.prisma.suggestion.findUnique({ where: { id } });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SuggestionWhereInput;
    orderBy?: Prisma.SuggestionOrderByWithRelationInput;
  }): Promise<Suggestion[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.suggestion.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async update(id: string, data: Prisma.SuggestionUpdateInput): Promise<Suggestion> {
    return this.prisma.suggestion.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.suggestion.delete({ where: { id } });
  }

  async count(where?: Prisma.SuggestionWhereInput): Promise<number> {
    return this.prisma.suggestion.count({ where });
  }
}

@Injectable()
export class PrismaBlotterCaseRepository implements BlotterCaseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.BlotterCaseCreateInput): Promise<BlotterCase> {
    return this.prisma.blotterCase.create({ data });
  }

  async findById(id: string): Promise<BlotterCase | null> {
    return this.prisma.blotterCase.findUnique({ where: { id } });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BlotterCaseWhereInput;
    orderBy?: Prisma.BlotterCaseOrderByWithRelationInput;
  }): Promise<BlotterCase[]> {
    const { skip, take, where, orderBy } = params;
    return this.prisma.blotterCase.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async update(id: string, data: Prisma.BlotterCaseUpdateInput): Promise<BlotterCase> {
    return this.prisma.blotterCase.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.blotterCase.delete({ where: { id } });
  }

  async count(where?: Prisma.BlotterCaseWhereInput): Promise<number> {
    return this.prisma.blotterCase.count({ where });
  }

  async generateCaseNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.blotterCase.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });
    const sequence = (count + 1).toString().padStart(4, '0');
    return `BLT-${year}-${sequence}`;
  }

  async findByCaseNumber(caseNumber: string): Promise<BlotterCase | null> {
    return this.prisma.blotterCase.findUnique({
      where: { caseNumber },
    });
  }
}

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return this.prisma.appointment.create({
      data,
      include: {
        assignedOfficial: true,
      },
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        assignedOfficial: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput;
    include?: Prisma.AppointmentInclude;
  }): Promise<Appointment[]> {
    const { skip, take, where, orderBy, include } = params;
    return this.prisma.appointment.findMany({
      skip,
      take,
      where,
      orderBy,
      include: include || {
        assignedOfficial: true,
      },
    });
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment> {
    return this.prisma.appointment.update({
      where: { id },
      data,
      include: {
        assignedOfficial: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }

  async count(where?: Prisma.AppointmentWhereInput): Promise<number> {
    return this.prisma.appointment.count({ where });
  }

  async findByOfficialId(officialId: string): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: { assignedOfficialId: officialId },
      include: {
        assignedOfficial: true,
      },
      orderBy: { preferredDate: 'asc' },
    });
  }
}
