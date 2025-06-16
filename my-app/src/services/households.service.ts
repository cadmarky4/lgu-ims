import { BaseApiService } from './api';
import {
  type PaginatedResponse,
  type Household,
  type HouseholdFormData,
  type CreateHouseholdRequest,
  type HouseholdStatistics,
  type Barangay
} from './types';

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

export class HouseholdsService extends BaseApiService {  /**
   * Convert frontend form data to backend API format
   */  private mapFormDataToRequest(formData: HouseholdFormData): CreateHouseholdRequest {
    // Construct complete address if not provided by user
    const completeAddress = formData.completeAddress || 
      `${formData.houseNumber} ${formData.streetSitio}, ${formData.barangay}`.trim();

    const request: CreateHouseholdRequest = {
      household_type: formData.householdType as any,
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
      ownership_status: formData.ownershipStatus || undefined,
      has_electricity: formData.utilitiesAccess.electricity,
      has_water_supply: formData.utilitiesAccess.waterSupply,
      has_internet_access: formData.utilitiesAccess.internetAccess,
      remarks: formData.remarks || undefined
    };

    // Map householdId to household_number if provided and not auto-generated
    if (formData.householdId && formData.householdId !== 'Auto-generated') {
      request.household_number = formData.householdId;
    }

    // Add member relationships if provided
    if (formData.members && formData.members.length > 0) {
      request.member_ids = formData.members.map(member => ({
        resident_id: member.residentId,
        relationship: member.relationship
      }));
    }

    return request;
  }

  async getHouseholds(params: HouseholdParams = {}): Promise<PaginatedResponse<Household>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.requestAll<Household>(
      `/households?${searchParams.toString()}`
    );

    if (response.data) {
      return response;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get households');
  }
  async createHousehold(householdData: HouseholdFormData): Promise<Household> {
    try {
      // Convert form data to API format
      const requestData = this.mapFormDataToRequest(householdData);
      const response = await this.request('/households', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });

      if (response.data) {
        return response.data as Household;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(JSON.stringify(response) || 'Validation failed');
        (error as any).response = {
          data: { errors: response.errors }
        };
        throw error;
      }

      throw new Error(JSON.stringify(response) || 'Failed to create household');
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error;
      }

      const wrappedError = new Error(error.message || 'Failed to create household');
      (wrappedError as any).response = {
        data: { errors: { general: ['Server error occurred'] } }
      };
      throw wrappedError;
    }
  }

  async updateHousehold(id: number, householdData: Partial<HouseholdFormData>): Promise<Household> {
    try {
      // Convert partial form data to API format for updates
      const requestData = householdData as any; // For now, handle conversion case-by-case

      const response = await this.request(`/households/${id}`, {
        method: 'PUT',
        body: JSON.stringify(requestData),
      });

      if (response.data) {
        return response.data as Household;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(JSON.stringify(response) || 'Validation failed');
        (error as any).response = {
          data: { errors: response.errors }
        };
        throw error;
      }

      throw new Error(JSON.stringify(response) || `Failed to update household #${id}`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error;
      }

      const wrappedError = new Error(error.message || `Failed to update household #${id}`);
      (wrappedError as any).response = {
        data: { errors: { general: ['Server error occurred'] } }
      };
      throw wrappedError;
    }
  }

  async getHousehold(id: number): Promise<Household> {
    const response = await this.request(`/households/${id}`);
    if (response.data) {
      return response.data as Household;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get household');
  }

  async deleteHousehold(id: number): Promise<void> {
    const response = await this.request(`/households/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error(JSON.stringify(response));
    }
  }
  async getStatistics(): Promise<HouseholdStatistics> {
    const response = await this.request('/households/statistics');
    if (response.data) {
      return response.data as HouseholdStatistics;
    }
    throw new Error(JSON.stringify(response));
  }

  async searchHouseholds(query: string, perPage: number = 15): Promise<PaginatedResponse<Household>> {
    const response = await this.requestAll<Household>(`/households/search?query=${encodeURIComponent(query)}&per_page=${perPage}`);
    if (response.data) {
      return response;
    }
    throw new Error(JSON.stringify(response));
  }

  async getHouseholdsByBarangay(barangay: string): Promise<Household[]> {
    const response = await this.request(`/households/by-barangay/${encodeURIComponent(barangay)}`);
    if (response.data) {
      return response.data as Household[];
    }
    throw new Error(JSON.stringify(response));
  }

  async updateHouseholdMembers(householdId: number, headResidentId: number, members: Array<{residentId: number, relationship: string}>): Promise<Household> {
    try {
      const requestData = {
        head_resident_id: headResidentId,
        member_ids: members.map(member => ({
          resident_id: member.residentId,
          relationship: member.relationship
        }))
      };

      const response = await this.request(`/households/${householdId}/members`, {
        method: 'PATCH',
        body: JSON.stringify(requestData),
      });

      if (response.data) {
        return response.data as Household;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(JSON.stringify(response) || 'Validation failed');
        (error as any).response = {
          data: { errors: response.errors }
        };
        throw error;
      }

      throw new Error(JSON.stringify(response) || `Failed to update household members`);
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw error;
      }

      const wrappedError = new Error(error.message || `Failed to update household members`);
      (wrappedError as any).response = {
        data: { errors: { general: ['Server error occurred'] } }
      };
      throw wrappedError;
    }
  }

  // Reference data methods
  async getBarangays(): Promise<Barangay[]> {
    // For now return mock data, but this should be replaced with real API call
    return [
      { id: 1, name: 'San Miguel', value: 'san-miguel' },
      { id: 2, name: 'Poblacion', value: 'poblacion' },
      { id: 3, name: 'Santo Domingo', value: 'santo-domingo' },
      { id: 4, name: 'San Antonio', value: 'san-antonio' },
      { id: 5, name: 'San Jose', value: 'san-jose' }
    ];
  }
}