import { BaseApiService } from './api';
import { type PaginatedResponse, type Barangay } from './types';
import {
  type Household,
  type HouseholdFormData,
  type CreateHouseholdRequest,
  type HouseholdStatistics,
  type HouseholdType
} from './household.types';

interface HouseholdParams {
  page?: number;
  per_page?: number;
  search?: string;
  barangay?: string;
  household_type?: string;
  monthly_income?: string;
  four_ps_beneficiary?: boolean;
  indigent_family?: boolean;
  has_pwd_member?: boolean;
  has_senior_citizen?: boolean;
  house_type?: string;
  ownership_status?: string;
}

// Helper function for type-safe error handling
function createApiError(message: string, errors?: Record<string, string[]>): Error {
  const error = new Error(message);
  (error as any).response = {
    data: { errors: errors || { general: ['Server error occurred'] } }
  };
  return error;
}

// Helper function to check if an error is an API error
function isApiError(error: unknown): error is Error & { response: { data: { errors: Record<string, string[]> } } } {
  return error instanceof Error && 
         'response' in error && 
         error.response !== null &&
         typeof error.response === 'object' &&
         'data' in error.response!;
}

export class HouseholdsService extends BaseApiService {
  /**
   * Convert frontend form data to backend API format
   */
  private mapFormDataToRequest(formData: HouseholdFormData): CreateHouseholdRequest {
    // Construct complete address if not provided by user
    const completeAddress = formData.completeAddress || 
      `${formData.houseNumber} ${formData.streetSitio}, ${formData.barangay}`.trim();

    const request: CreateHouseholdRequest = {
      household_type: formData.householdType as HouseholdType,
      head_resident_id: formData.headResidentId,
      house_number: formData.houseNumber,
      street_sitio: formData.streetSitio,
      barangay: formData.barangay,
      complete_address: completeAddress,
      monthly_income: formData.monthlyIncome || undefined,
      primary_income_source: formData.primaryIncomeSource || undefined,
      four_ps_beneficiary: formData.householdClassification.fourPsBeneficiary,
      indigent_family: formData.householdClassification.indigentFamily,
      has_senior_citizen: formData.householdClassification.hasSeniorCitizen,
      has_pwd_member: formData.householdClassification.hasPwdMember,
      house_type: formData.houseType || undefined,
      ownership_status: formData.ownershipStatus || undefined,      has_electricity: formData.utilitiesAccess.electricity,
      has_water_supply: formData.utilitiesAccess.waterSupply,
      has_internet_access: formData.utilitiesAccess.internetAccess,
      remarks: formData.remarks || undefined
    };

    return request;
  }

  async getHouseholds(params: HouseholdParams = {}): Promise<PaginatedResponse<Household>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<Household>>(
      `/households?${searchParams.toString()}`
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('Failed to fetch households');
  }

  async createHousehold(formData: HouseholdFormData): Promise<Household> {
    try {
      const requestData = this.mapFormDataToRequest(formData);
      
      const response = await this.request<Household>('/households', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      if (response.data) {
        return response.data as Household;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        throw createApiError('Validation failed', response.errors);
      }

      throw new Error('Failed to create household');
    } catch (error: unknown) {
      if (isApiError(error)) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to create household';
      throw createApiError(errorMessage);
    }
  }

  async updateHousehold(id: number, formData: HouseholdFormData): Promise<Household> {
    try {
      const requestData = this.mapFormDataToRequest(formData);
      
      const response = await this.request<Household>(`/households/${id}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });

      if (response.data) {
        return response.data as Household;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        throw createApiError('Validation failed', response.errors);
      }

      throw new Error(`Failed to update household #${id}`);
    } catch (error: unknown) {
      if (isApiError(error)) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : `Failed to update household #${id}`;
      throw createApiError(errorMessage);
    }
  }

  async deleteHousehold(id: number): Promise<void> {
    const response = await this.request(`/households/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error(`Failed to delete household #${id}`);
    }
  }

  async getHousehold(id: number): Promise<Household> {
    const response = await this.request<Household>(`/households/${id}`);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(`Failed to get household #${id}`);
  }

  async updateHouseholdMembers(id: number, memberIds: number[]): Promise<Household> {
    try {
      const response = await this.request<Household>(`/households/${id}/members`, {
        method: 'PUT',
        body: JSON.stringify({ member_ids: memberIds }),
      });

      if (response.data) {
        return response.data as Household;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        throw createApiError('Validation failed', response.errors);
      }

      throw new Error('Failed to update household members');
    } catch (error: unknown) {
      if (isApiError(error)) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to update household members';
      throw createApiError(errorMessage);
    }
  }

  async getStatistics(): Promise<HouseholdStatistics> {
    const response = await this.request<HouseholdStatistics>('/households/statistics');
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get household statistics');
  }

  async getBarangays(): Promise<Barangay[]> {
    // Mock data for now - replace with actual API call when backend is ready
    return [
      { id: 1, name: 'San Rafael', value: 'san-rafael' },
      { id: 2, name: 'Santa Cruz', value: 'santa-cruz' },
      { id: 3, name: 'Santo Domingo', value: 'santo-domingo' },
      { id: 4, name: 'San Antonio', value: 'san-antonio' },
      { id: 5, name: 'San Jose', value: 'san-jose' }
    ];
  }
}
