import { BaseApiService } from './api';
import { type ApiResponse } from './types';

export interface DashboardStatistics {
  totalResidents: number;
  totalHouseholds: number;
  activeBarangayOfficials: number;
  totalBlotterCases: number;
  totalIssuedClearance: number;
  ongoingProjects: number;
}

export interface ResidentDemographics {
  children: number; // 0-17
  adults: number;   // 18-59
  seniors: number;  // 60+
}

export interface DashboardNotification {
  id: number;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface RecentActivity {
  id: number;
  description: string;
  time: string;
  type: 'resident' | 'project' | 'document' | 'blotter';
}

export interface BarangayOfficial {
  id: number;
  name: string;
  position: string;
  email: string;
  contact: string;
  photo: string;
}

export class DashboardService extends BaseApiService {
  /**
   * Get dashboard statistics
   */
  async getStatistics(): Promise<ApiResponse<DashboardStatistics>> {
    const response = await this.request<DashboardStatistics>('/dashboard/statistics');
    return response;
  }

  /**
   * Get resident demographics for charts
   */
  async getResidentDemographics(): Promise<ApiResponse<ResidentDemographics>> {
    const response = await this.request<ResidentDemographics>('/dashboard/demographics');
    return response;
  }

  /**
   * Get recent notifications
   */
  async getNotifications(): Promise<ApiResponse<DashboardNotification[]>> {
    const response = await this.request<DashboardNotification[]>('/dashboard/notifications');
    return response;
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(): Promise<ApiResponse<RecentActivity[]>> {
    const response = await this.request<RecentActivity[]>('/dashboard/activities');
    return response;
  }

  /**
   * Get barangay officials for dashboard
   */
  async getBarangayOfficials(): Promise<ApiResponse<BarangayOfficial[]>> {
    const response = await this.request<BarangayOfficial[]>('/dashboard/barangay-officials');
    return response;
  }
}
