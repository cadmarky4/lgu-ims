import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsDecimal, IsInt, IsArray, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectCategory, ProjectStatus, PriorityLevel } from '@prisma/client';

export class CreateProjectMilestoneDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  targetDate: string;
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsEnum(ProjectCategory)
  category: ProjectCategory;

  @IsString()
  @IsNotEmpty()
  projectDescription: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priorityLevel?: PriorityLevel;

  @IsDecimal({ decimal_digits: '2' })
  @Transform(({ value }) => parseFloat(value))
  totalBudget: number;

  @IsString()
  @IsNotEmpty()
  fundingSource: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  materialSupplies?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  laborServices?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  equipment?: number;

  @IsString()
  @IsNotEmpty()
  projectManager: string;

  @IsString()
  @IsOptional()
  expectedBeneficiaries?: string;

  @IsString()
  @IsOptional()
  teamDepartment?: string;

  @IsString()
  @IsOptional()
  keyStakeholders?: string;

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsString()
  @IsOptional()
  successMetrics?: string;

  @IsString()
  @IsOptional()
  potentialRisks?: string;

  @IsArray()
  @IsOptional()
  @Type(() => CreateProjectMilestoneDto)
  milestones?: CreateProjectMilestoneDto[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  teamMemberIds?: string[];
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  projectName?: string;

  @IsEnum(ProjectCategory)
  @IsOptional()
  category?: ProjectCategory;

  @IsString()
  @IsOptional()
  projectDescription?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priorityLevel?: PriorityLevel;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  totalBudget?: number;

  @IsString()
  @IsOptional()
  fundingSource?: string;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  materialSupplies?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  laborServices?: number;

  @IsDecimal({ decimal_digits: '2' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  equipment?: number;

  @IsString()
  @IsOptional()
  projectManager?: string;

  @IsString()
  @IsOptional()
  expectedBeneficiaries?: string;

  @IsString()
  @IsOptional()
  teamDepartment?: string;

  @IsString()
  @IsOptional()
  keyStakeholders?: string;

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsString()
  @IsOptional()
  successMetrics?: string;

  @IsString()
  @IsOptional()
  potentialRisks?: string;
}

export class ProjectQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsEnum(ProjectCategory)
  @IsOptional()
  category?: ProjectCategory;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsString()
  @IsOptional()
  projectManager?: string;

  @IsDateString()
  @IsOptional()
  startDateFrom?: string;

  @IsDateString()
  @IsOptional()
  startDateTo?: string;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}
