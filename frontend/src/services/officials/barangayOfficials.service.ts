import { BaseApiService } from '../__shared/api';
import { type PaginatedResponse } from '../__shared/types';
import type { 
  BarangayOfficial, 
  BarangayOfficialFormData, 
  BarangayOfficialParams,
  BarangayOfficialStatistics,
} from './barangayOfficials.types';
import { ApiResponseSchema, PaginatedResponseSchema } from '../__shared/types';
import { BarangayOfficialFormDataSchema, BarangayOfficialParamsSchema, BarangayOfficialSchema, BarangayOfficialStatisticsSchema } from './barangayOfficials.types';
import { z } from 'zod';

export class BarangayOfficialsService extends BaseApiService {
  /**
   * Get all barangay officials with filters
   */
  async getBarangayOfficials(params: BarangayOfficialParams = {}): Promise<PaginatedResponse<BarangayOfficial>> {
    // Validate input parameters using schema (you'll need to create BarangayOfficialFiltersSchema)
    const validatedParams = BarangayOfficialParamsSchema.parse(params);
    
    // Build query string
    const searchParams = new URLSearchParams();
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const paginatedSchema = PaginatedResponseSchema(BarangayOfficialSchema);
    
    return this.request(
      `/barangay-officials?${searchParams.toString()}`,
      paginatedSchema,
      { method: 'GET' }
    );
  }

  /**
   * Get a specific barangay official by ID
   */
  async getBarangayOfficial(id: number): Promise<BarangayOfficial> {
    if (!id || id <= 0) {
      throw new Error('Invalid barangay official ID');
    }

    const responseSchema = ApiResponseSchema(BarangayOfficialSchema);
    
    const response = await this.request(
      `/barangay-officials/${id}`,
      responseSchema,
      { method: 'GET' }
    );

    if (!response.data) {
      throw new Error('Barangay official not found');
    }

    return response.data;
  }

  /**
   * Create a new barangay official
   */
  async createBarangayOfficial(data: BarangayOfficialFormData): Promise<BarangayOfficial> {
    // Validate input data
    const validatedData = BarangayOfficialFormDataSchema.parse(data);

    const responseSchema = ApiResponseSchema(BarangayOfficialSchema);
    
    const response = await this.request(
      '/barangay-officials',
      responseSchema,
      {
        method: 'POST',
        data: validatedData,
      }
    );

    if (!response.data) {
      throw new Error('Failed to create barangay official');
    }

    return response.data;
  }

  /**
   * Update an existing barangay official
   */
  async updateBarangayOfficial(id: number, data: BarangayOfficialFormData): Promise<BarangayOfficial> {
    if (!id || id <= 0) {
      throw new Error('Invalid barangay official ID');
    }

    // Validate input data
    const validatedData = BarangayOfficialFormDataSchema.parse(data);
    
    const responseSchema = ApiResponseSchema(BarangayOfficialSchema);
    
    const response = await this.request(
      `/barangay-officials/${id}`,
      responseSchema,
      {
        method: 'PUT',
        data: validatedData,
      }
    );

    if (!response.data) {
      throw new Error('Failed to update barangay official');
    }

    return response.data;
  }

  /**
   * Delete a barangay official
   */

  async deleteBarangayOfficial(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid barangay official ID');
    }

    const responseSchema = ApiResponseSchema(z.any());

    await this.request(
      `/barangay-officials/${id}`, 
      responseSchema,
      { method: 'DELETE', }
    );
  }

  /**
   * Get barangay officials statistics
   */
  async getStatistics(): Promise<BarangayOfficialStatistics> {
    const responseSchema = ApiResponseSchema(BarangayOfficialStatisticsSchema);
    
    const response = await this.request(
      '/barangay-officials/statistics',
      responseSchema,
      { method: 'GET' }
    );

    if (!response.data) {
      throw new Error('Failed to get statistics');
    }

    return response.data;
  }
}
