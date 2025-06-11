import { Project, ProjectMilestone, ProjectTeamMember, Prisma } from '@prisma/client';

export interface ProjectRepository {
  create(data: Prisma.ProjectCreateInput): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
    include?: Prisma.ProjectInclude;
  }): Promise<Project[]>;
  update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project>;
  delete(id: string): Promise<void>;
  count(where?: Prisma.ProjectWhereInput): Promise<number>;
  getStatistics(): Promise<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
  }>;
}

export interface ProjectMilestoneRepository {
  create(data: Prisma.ProjectMilestoneCreateInput): Promise<ProjectMilestone>;
  findByProjectId(projectId: string): Promise<ProjectMilestone[]>;
  update(id: string, data: Prisma.ProjectMilestoneUpdateInput): Promise<ProjectMilestone>;
  delete(id: string): Promise<void>;
}

export interface ProjectTeamMemberRepository {
  create(data: Prisma.ProjectTeamMemberCreateInput): Promise<ProjectTeamMember>;
  findByProjectId(projectId: string): Promise<ProjectTeamMember[]>;
  delete(projectId: string, officialId: string): Promise<void>;
  deleteByProjectId(projectId: string): Promise<void>;
}
