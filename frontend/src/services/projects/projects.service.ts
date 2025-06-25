import { BaseApiService } from '../__shared/api';
import { type ApiResponse } from '../__shared/types';
import { type Project, type CreateProjectData, type UpdateProjectData } from './project.types';

export class ProjectsService extends BaseApiService {
  /**
   * Get all projects
   */
  async getProjects(): Promise<ApiResponse<Project[]>> {
    const response = await this.request<Project[]>('/projects');
    return response;
  }

  /**
   * Get a specific project by ID
   */
  async getProject(id: number): Promise<ApiResponse<Project>> {
    const response = await this.request<Project>(`/projects/${id}`);
    return response;
  }

  /**
   * Create a new project
   */
  async createProject(projectData: CreateProjectData): Promise<ApiResponse<Project>> {
    const response = await this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
    return response;
  }

  /**
   * Update an existing project
   */
  async updateProject(id: number, projectData: UpdateProjectData): Promise<ApiResponse<Project>> {
    const response = await this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
    return response;
  }

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<ApiResponse<void>> {
    const response = await this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    });
    return response;
  }
  /**
   * Get project statistics
   */
  async getStatistics(): Promise<ApiResponse<{
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalBudget: number;
  }>> {
    const response = await this.request<{
      totalProjects: number;
      activeProjects: number;
      completedProjects: number;
      totalBudget: number;
    }>('/projects/statistics');
    return response;
  }
}