import { BaseApiService } from './api';
import { type ApiResponse } from './types';
import {
  type StatisticsOverview,
  type AgeGroupDistribution,
  type SpecialPopulationRegistry,
  type MonthlyRevenue,
  type PopulationDistributionByPurok,
  type DocumentTypesIssued,
  type MostRequestedService,
  type FilterOptions,
  type ReportsFilters,
} from './reports.types';

export class ReportsService extends BaseApiService {
  /**
   * Get statistics overview data
   */
  async getStatisticsOverview(filters?: ReportsFilters): Promise<ApiResponse<StatisticsOverview>> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.quarter) params.append('quarter', filters.quarter);
    if (filters?.purok) params.append('purok', filters.purok);

    const queryString = params.toString();
    const endpoint = `/reports/statistics-overview${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<StatisticsOverview>(endpoint);
  }

  /**
   * Get age group distribution data
   */
  async getAgeGroupDistribution(filters?: ReportsFilters): Promise<ApiResponse<AgeGroupDistribution[]>> {
    const params = new URLSearchParams();
    if (filters?.purok) params.append('purok', filters.purok);

    const queryString = params.toString();
    const endpoint = `/reports/age-group-distribution${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<AgeGroupDistribution[]>(endpoint);
  }

  /**
   * Get special population registry data
   */
  async getSpecialPopulationRegistry(filters?: ReportsFilters): Promise<ApiResponse<SpecialPopulationRegistry[]>> {
    const params = new URLSearchParams();
    if (filters?.purok) params.append('purok', filters.purok);

    const queryString = params.toString();
    const endpoint = `/reports/special-population-registry${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<SpecialPopulationRegistry[]>(endpoint);
  }

  /**
   * Get monthly revenue data
   */
  async getMonthlyRevenue(filters?: ReportsFilters): Promise<ApiResponse<MonthlyRevenue[]>> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());

    const queryString = params.toString();
    const endpoint = `/reports/monthly-revenue${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<MonthlyRevenue[]>(endpoint);
  }

  /**
   * Get population distribution by purok data
   */
  async getPopulationDistributionByPurok(filters?: ReportsFilters): Promise<ApiResponse<PopulationDistributionByPurok[]>> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());

    const queryString = params.toString();
    const endpoint = `/reports/population-distribution-by-purok${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<PopulationDistributionByPurok[]>(endpoint);
  }

  /**
   * Get document types issued data
   */
  async getDocumentTypesIssued(filters?: ReportsFilters): Promise<ApiResponse<DocumentTypesIssued[]>> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.quarter) params.append('quarter', filters.quarter);

    const queryString = params.toString();
    const endpoint = `/reports/document-types-issued${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<DocumentTypesIssued[]>(endpoint);
  }

  /**
   * Get most requested services data
   */
  async getMostRequestedServices(filters?: ReportsFilters): Promise<ApiResponse<MostRequestedService[]>> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.quarter) params.append('quarter', filters.quarter);

    const queryString = params.toString();
    const endpoint = `/reports/most-requested-services${queryString ? `?${queryString}` : ''}`;
    
    return await this.request<MostRequestedService[]>(endpoint);
  }

  /**
   * Get filter options (years, quarters, puroks)
   */
  async getFilterOptions(): Promise<ApiResponse<FilterOptions>> {
    return await this.request<FilterOptions>('/reports/filter-options');
  }

  /**
   * Export report data (placeholder for future implementation)
   */
  async exportReport(filters?: ReportsFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters?.year) params.append('year', filters.year.toString());
    if (filters?.quarter) params.append('quarter', filters.quarter);
    if (filters?.purok) params.append('purok', filters.purok);

    const queryString = params.toString();
    const endpoint = `/reports/export${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(`http://127.0.0.1:8000/api${endpoint}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to export report');
    }

    return await response.blob();
  }
}
