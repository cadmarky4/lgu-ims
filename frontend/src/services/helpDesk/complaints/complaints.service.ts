// services/api/complaints.service.ts
import { BaseApiService } from '../../__shared/api';
import { type PaginatedResponse } from '../../__shared/types';
import { 
  type Complaint, 
  type ComplaintParams, 
  type CreateComplaintData, 
  type UpdateComplaintData,
  type AcknowledgeComplaintData,
  type AssignComplaintData,
  type ResolveComplaintData,
  type SubmitFeedbackData,
  type ComplaintStatistics,
  type ComplaintStatus
} from './complaints.types';

export class ComplaintsService extends BaseApiService {
  async getComplaints(params: ComplaintParams = {}): Promise<PaginatedResponse<Complaint>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.requestAll<Complaint>(
      `/complaints?${searchParams.toString()}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get complaints');
  }

  async getComplaint(id: number): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get complaint');
  }

  async createComplaint(complaintData: CreateComplaintData): Promise<Complaint> {
    const response = await this.request<Complaint>('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to create complaint');
  }

  async updateComplaint(id: number, complaintData: UpdateComplaintData): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}`, {
      method: 'PUT',
      body: JSON.stringify(complaintData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update complaint');
  }

  async deleteComplaint(id: number): Promise<void> {
    const response = await this.request(`/complaints/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error('Failed to delete complaint');
    }
  }

  async acknowledgeComplaint(id: number, acknowledgeData: AcknowledgeComplaintData): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify(acknowledgeData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to acknowledge complaint');
  }

  async assignComplaint(id: number, assignData: AssignComplaintData): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify(assignData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to assign complaint');
  }

  async resolveComplaint(id: number, resolveData: ResolveComplaintData): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify(resolveData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to resolve complaint');
  }

  async submitFeedback(id: number, feedbackData: SubmitFeedbackData): Promise<Complaint> {
    const response = await this.request<Complaint>(`/complaints/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to submit feedback');
  }

  async getStatistics(): Promise<ComplaintStatistics> {
    const response = await this.request<ComplaintStatistics>('/complaints/statistics');
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get complaint statistics');
  }

  // Additional utility methods
  async getComplaintsByCategory(category: string): Promise<Complaint[]> {
    const params: ComplaintParams = {
      complaint_category: category,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }

  async getComplaintsByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    const params: ComplaintParams = {
      status,
      sort_by: 'date_received',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }

  async getComplaintsByDepartment(department: string): Promise<Complaint[]> {
    const params: ComplaintParams = {
      department,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }

  async getOpenComplaints(): Promise<Complaint[]> {
    return await this.getComplaintsByStatus('OPEN');
  }

  async getResolvedComplaints(): Promise<Complaint[]> {
    return await this.getComplaintsByStatus('RESOLVED');
  }

  async getEscalatedComplaints(): Promise<Complaint[]> {
    return await this.getComplaintsByStatus('ESCALATED');
  }

  async getAnonymousComplaints(): Promise<Complaint[]> {
    const params: ComplaintParams = {
      is_anonymous: true,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }

  async getComplaintsRequiringFollowUp(): Promise<Complaint[]> {
    const params: ComplaintParams = {
      follow_up_required: true,
      sort_by: 'follow_up_date',
      sort_order: 'asc'
    };

    return await this.getComplaints(params);
  }

  async getComplaintsByUrgency(urgency: 'low' | 'medium' | 'high' | 'critical'): Promise<Complaint[]> {
    const params: ComplaintParams = {
      urgency,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }

  async getTodayComplaints(): Promise<Complaint[]> {
    const today = new Date().toISOString().split('T')[0];
    const params: ComplaintParams = {
      date_from: today,
      date_to: today,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }

  async getRecentComplaints(limit: number = 10): Promise<Complaint[]> {
    const params: ComplaintParams = {
      per_page: limit,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getComplaints(params);
  }
}
