import { Complaint, Suggestion, BlotterCase, Appointment, Prisma } from '@prisma/client';

export interface ComplaintRepository {
  create(data: Prisma.ComplaintCreateInput): Promise<Complaint>;
  findById(id: string): Promise<Complaint | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ComplaintWhereInput;
    orderBy?: Prisma.ComplaintOrderByWithRelationInput;
  }): Promise<Complaint[]>;
  update(id: string, data: Prisma.ComplaintUpdateInput): Promise<Complaint>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.ComplaintWhereInput): Promise<number>;
}

export interface SuggestionRepository {
  create(data: Prisma.SuggestionCreateInput): Promise<Suggestion>;
  findById(id: string): Promise<Suggestion | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SuggestionWhereInput;
    orderBy?: Prisma.SuggestionOrderByWithRelationInput;
  }): Promise<Suggestion[]>;
  update(id: string, data: Prisma.SuggestionUpdateInput): Promise<Suggestion>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.SuggestionWhereInput): Promise<number>;
}

export interface BlotterCaseRepository {
  create(data: Prisma.BlotterCaseCreateInput): Promise<BlotterCase>;
  findById(id: string): Promise<BlotterCase | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BlotterCaseWhereInput;
    orderBy?: Prisma.BlotterCaseOrderByWithRelationInput;
  }): Promise<BlotterCase[]>;
  update(id: string, data: Prisma.BlotterCaseUpdateInput): Promise<BlotterCase>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.BlotterCaseWhereInput): Promise<number>;
  generateCaseNumber(): Promise<string>;
  findByCaseNumber(caseNumber: string): Promise<BlotterCase | null>;
}

export interface AppointmentRepository {
  create(data: Prisma.AppointmentCreateInput): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AppointmentWhereInput;
    orderBy?: Prisma.AppointmentOrderByWithRelationInput;
    include?: Prisma.AppointmentInclude;
  }): Promise<Appointment[]>;
  update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.AppointmentWhereInput): Promise<number>;
  findByOfficialId(officialId: string): Promise<Appointment[]>;
}
