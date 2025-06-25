// services/api/suggestions.service.ts
import { BaseApiService } from '@/services/__shared/api';
import { type PaginatedResponse } from '@/services/__shared/types';
import { 
  type Suggestion, 
  type SuggestionParams, 
  type CreateSuggestionData, 
  type UpdateSuggestionData,
  type ReviewSuggestionData,
  type VoteSuggestionData,
  type UpdateImplementationData,
  type SuggestionStatistics,
  type SuggestionStatus,
  type SuggestionPriority,
  type ImplementationStatus
} from './suggestions.types';

export class SuggestionsService extends BaseApiService {
  async getSuggestions(params: SuggestionParams = {}): Promise<PaginatedResponse<Suggestion>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.requestAll<Suggestion>(
      `/suggestions?${searchParams.toString()}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get suggestions');
  }

  async getSuggestion(id: number): Promise<Suggestion> {
    const response = await this.request<Suggestion>(`/suggestions/${id}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get suggestion');
  }

  async createSuggestion(suggestionData: CreateSuggestionData): Promise<Suggestion> {
    const response = await this.request<Suggestion>('/suggestions', {
      method: 'POST',
      body: JSON.stringify(suggestionData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to create suggestion');
  }

  async updateSuggestion(id: number, suggestionData: UpdateSuggestionData): Promise<Suggestion> {
    const response = await this.request<Suggestion>(`/suggestions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(suggestionData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update suggestion');
  }

  async deleteSuggestion(id: number): Promise<void> {
    const response = await this.request(`/suggestions/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error('Failed to delete suggestion');
    }
  }

  async reviewSuggestion(id: number, reviewData: ReviewSuggestionData): Promise<Suggestion> {
    const response = await this.request<Suggestion>(`/suggestions/${id}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to review suggestion');
  }

  async voteSuggestion(id: number, voteData: VoteSuggestionData): Promise<Suggestion> {
    const response = await this.request<Suggestion>(`/suggestions/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify(voteData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to vote on suggestion');
  }

  async updateImplementation(id: number, implementationData: UpdateImplementationData): Promise<Suggestion> {
    const response = await this.request<Suggestion>(`/suggestions/${id}/implementation`, {
      method: 'PATCH',
      body: JSON.stringify(implementationData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update implementation');
  }

  async getStatistics(): Promise<SuggestionStatistics> {
    const response = await this.request<SuggestionStatistics>('/suggestions/statistics');
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get suggestion statistics');
  }

  // Additional utility methods
  async getSuggestionsByCategory(category: string): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      category,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getSuggestionsByStatus(status: SuggestionStatus): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      status,
      sort_by: 'date_submitted',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getSuggestionsByPriority(priority: SuggestionPriority): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      priority,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getSuggestionsByImplementationStatus(implementationStatus: ImplementationStatus): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      implementation_status: implementationStatus,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getSubmittedSuggestions(): Promise<Suggestion[]> {
    return await this.getSuggestionsByStatus('SUBMITTED');
  }

  async getUnderReviewSuggestions(): Promise<Suggestion[]> {
    return await this.getSuggestionsByStatus('UNDER_REVIEW');
  }

  async getApprovedSuggestions(): Promise<Suggestion[]> {
    return await this.getSuggestionsByStatus('APPROVED');
  }

  async getImplementedSuggestions(): Promise<Suggestion[]> {
    return await this.getSuggestionsByStatus('IMPLEMENTED');
  }

  async getInProgressSuggestions(): Promise<Suggestion[]> {
    return await this.getSuggestionsByImplementationStatus('IN_PROGRESS');
  }

  async getPopularSuggestions(limit: number = 10): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      per_page: limit,
      sort_by: 'votes_count',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getRecentSuggestions(limit: number = 10): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      per_page: limit,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getTrendingSuggestions(limit: number = 10): Promise<Suggestion[]> {
    // Get suggestions with high vote activity in recent days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const params: SuggestionParams = {
      per_page: limit,
      date_from: threeDaysAgo.toISOString().split('T')[0],
      min_votes: 5,
      sort_by: 'votes_count',
      sort_order: 'desc'
    };

    return await this.getSuggestions(params);
  }

  async getHighPrioritySuggestions(): Promise<Suggestion[]> {
    return await this.getSuggestionsByPriority('high');
  }

  async getPendingReviewSuggestions(): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      status: 'SUBMITTED',
      sort_by: 'date_submitted',
      sort_order: 'asc'  // Oldest first for review queue
    };

    return await this.getSuggestions(params);
  }

  async getSuggestionsNeedingImplementationUpdate(): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      implementation_status: 'IN_PROGRESS',
      sort_by: 'created_at',
      sort_order: 'asc'
    };

    return await this.getSuggestions(params);
  }

  async searchSuggestions(query: string, filters?: Partial<SuggestionParams>): Promise<Suggestion[]> {
    const params: SuggestionParams = {
      search: query,
      sort_by: 'votes_count',
      sort_order: 'desc',
      ...filters
    };

    return await this.getSuggestions(params);
  }
}
