// services/api/blotter.service.ts
import { BaseApiService } from '../../__shared/api';
import { type PaginatedResponse } from '../../__shared/types';
import { 
  type BlotterCase, 
  type BlotterParams, 
  type CreateBlotterData, 
  type UpdateBlotterData,
  type AssignInvestigatorData,
  type ScheduleMediationData,
  type CompleteMediationData,
  type UpdateComplianceData,
  type CloseCaseData,
  type BlotterStatistics,
  type BlotterStatus,
  type BlotterPriority,
  type IncidentType
} from './blotters.types';

export class BlotterService extends BaseApiService {
  async getBlotterCases(params: BlotterParams = {}): Promise<PaginatedResponse<BlotterCase>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.requestAll<BlotterCase>(
      `/blotter-cases?${searchParams.toString()}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get blotter cases');
  }

  async getBlotterCase(id: number): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get blotter case');
  }

  async createBlotterCase(blotterData: CreateBlotterData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>('/blotter-cases', {
      method: 'POST',
      body: JSON.stringify(blotterData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to create blotter case');
  }

  async updateBlotterCase(id: number, blotterData: UpdateBlotterData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blotterData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update blotter case');
  }

  async deleteBlotterCase(id: number): Promise<void> {
    const response = await this.request(`/blotter-cases/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error('Failed to delete blotter case');
    }
  }

  async assignInvestigator(id: number, assignData: AssignInvestigatorData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}/assign-investigator`, {
      method: 'POST',
      body: JSON.stringify(assignData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to assign investigator');
  }

  async scheduleMediation(id: number, mediationData: ScheduleMediationData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}/schedule-mediation`, {
      method: 'POST',
      body: JSON.stringify(mediationData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to schedule mediation');
  }

  async completeMediation(id: number, mediationData: CompleteMediationData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}/complete-mediation`, {
      method: 'POST',
      body: JSON.stringify(mediationData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to complete mediation');
  }

  async updateCompliance(id: number, complianceData: UpdateComplianceData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}/compliance`, {
      method: 'PATCH',
      body: JSON.stringify(complianceData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update compliance');
  }

  async closeCase(id: number, closeData: CloseCaseData): Promise<BlotterCase> {
    const response = await this.request<BlotterCase>(`/blotter-cases/${id}/close`, {
      method: 'POST',
      body: JSON.stringify(closeData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to close case');
  }

  async getStatistics(): Promise<BlotterStatistics> {
    const response = await this.request<BlotterStatistics>('/blotter-cases/statistics');
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get blotter statistics');
  }

  // Additional utility methods
  async getBlotterCasesByIncidentType(incidentType: IncidentType): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      incident_type: incidentType,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getBlotterCasesByStatus(status: BlotterStatus): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      status,
      sort_by: 'date_filed',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getBlotterCasesByPriority(priority: BlotterPriority): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      priority,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getFiledCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByStatus('FILED');
  }

  async getUnderInvestigationCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByStatus('UNDER_INVESTIGATION');
  }

  async getMediationScheduledCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByStatus('MEDIATION_SCHEDULED');
  }

  async getSettledCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByStatus('SETTLED');
  }

  async getClosedCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByStatus('CLOSED');
  }

  async getEscalatedCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByStatus('ESCALATED');
  }

  async getHighPriorityCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByPriority('HIGH');
  }

  async getUrgentCases(): Promise<BlotterCase[]> {
    return await this.getBlotterCasesByPriority('URGENT');
  }

  async getConfidentialCases(): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      is_confidential: true,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getCasesRequiringMonitoring(): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      requires_monitoring: true,
      sort_by: 'next_followup_date',
      sort_order: 'asc'
    };

    return await this.getBlotterCases(params);
  }

  async getCasesByInvestigator(investigatorId: number): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      investigating_officer: investigatorId,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getCasesByMediator(mediatorId: number): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      mediator_assigned: mediatorId,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getTodayCases(): Promise<BlotterCase[]> {
    const today = new Date().toISOString().split('T')[0];
    const params: BlotterParams = {
      date_from: today,
      date_to: today,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getRecentCases(limit: number = 10): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      per_page: limit,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getBlotterCases(params);
  }

  async getPendingCases(): Promise<BlotterCase[]> {
    // Get all cases that are not yet closed or settled
    const params: BlotterParams = {
      sort_by: 'date_filed',
      sort_order: 'asc'
    };

    const allCases = await this.getBlotterCases(params);
    return allCases.filter(case_ => 
      !['CLOSED', 'SETTLED', 'DISMISSED'].includes(case_.status)
    );
  }

  async getActiveCases(): Promise<BlotterCase[]> {
    // Get cases that are currently being processed
    const params: BlotterParams = {
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    const allCases = await this.getBlotterCases(params);
    return allCases.filter(case_ => 
      ['UNDER_INVESTIGATION', 'MEDIATION_SCHEDULED', 'MEDIATION', 'HEARING_SCHEDULED'].includes(case_.status)
    );
  }

  async searchCases(query: string, filters?: Partial<BlotterParams>): Promise<BlotterCase[]> {
    const params: BlotterParams = {
      search: query,
      sort_by: 'created_at',
      sort_order: 'desc',
      ...filters
    };

    return await this.getBlotterCases(params);
  }
}
