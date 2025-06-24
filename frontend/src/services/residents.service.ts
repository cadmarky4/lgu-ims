import { BaseApiService } from './api';
import { type PaginatedResponse } from './types';
import {
    type Gender,
    type CivilStatus,
    type EmploymentStatus,
    type IdType,
    type VoterStatus,
    type ResidentStatus,
    type Resident,
    type ResidentParams,
    type CreateResidentData,
    type UpdateResidentData,
    type ResidentStatistics,
    type ResidentFormData,
    type AgeGroupStatistics
} from './resident.types';

export class ResidentsService extends BaseApiService {
    async getResidents(params: ResidentParams = {}): Promise<PaginatedResponse<Resident>> {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                searchParams.append(key, value.toString());
            }
        });

        const response = await this.requestAll<Resident>(
            `/residents?${searchParams.toString()}`
        );

        if (response.data) {
            return response;
        }
        throw new Error(JSON.stringify(response) || 'Failed to get residents');
    }

    async getResident(id: number): Promise<Resident> {
        const response = await this.request<Resident>(`/residents/${id}`);

        if (response.data) {
            return response.data;
        }
        throw new Error(JSON.stringify(response) || 'Failed to get resident');
    }    async createResident(residentData: CreateResidentData): Promise<Resident> {
        const response = await this.request<Resident>('/residents', {
            method: 'POST',
            body: JSON.stringify(residentData),
        });

        if (response.data) {
            return response.data;
        }
        throw new Error(JSON.stringify(response) || 'Failed to create resident');
    }

    async createResidentFromForm(formData: ResidentFormData): Promise<Resident> {
        const apiData = this.transformFormDataToApiFormat(formData);
        return this.createResident(apiData);
    }

    async updateResident(id: number, residentData: UpdateResidentData): Promise<Resident> {
        const response = await this.request<Resident>(`/residents/${id}`, {
            method: 'PUT',
            body: JSON.stringify(residentData),
        });

        if (response.data) {
            return response.data;
        }
        throw new Error(JSON.stringify(response) || 'Failed to update resident');
    }

    async deleteResident(id: number): Promise<void> {
        const response = await this.request(`/residents/${id}`, {
            method: 'DELETE',
        });

        if (!response) {
            throw new Error(JSON.stringify(response) || 'Failed to delete resident');
        }
    }

    async getStatistics(): Promise<ResidentStatistics> {
        const response = await this.request<ResidentStatistics>('/residents/statistics');
        if (response.data) {
            return response.data;
        }
        throw new Error(JSON.stringify(response) || 'Failed to get resident statistics');
    }

    async checkDuplicate(firstName: string, lastName: string, birthDate: string): Promise<Resident[]> {
        const searchTerm = `${firstName} ${lastName}`;
        const response = await this.requestAll<Resident>(
            `/residents?search=${encodeURIComponent(searchTerm)}&per_page=10`
        );

        if (response.data) {
            return response.data.filter((resident: Resident) => {
                const residentBirthDate = new Date(resident.birth_date).toISOString().split('T')[0];
                const searchBirthDate = new Date(birthDate).toISOString().split('T')[0];

                return resident.first_name.toLowerCase() === firstName.toLowerCase() &&
                    resident.last_name.toLowerCase() === lastName.toLowerCase() &&
                    residentBirthDate === searchBirthDate;
            });
        }

        return [];
    }

    async searchResidents(searchTerm: string, limit: number = 10): Promise<Resident[]> {
        const response = await this.requestAll<Resident>(
            `/residents?search=${encodeURIComponent(searchTerm)}&per_page=${limit}`
        );

        if (response.data) {
            return response.data;
        }
        return [];
    }

    async getResidentsByHousehold(householdId: number): Promise<Resident[]> {
        const response = await this.requestAll<Resident>(
            `/residents?household_id=${householdId}`
        );

        if (response.data) {
            return response.data;
        }
        return [];
    }

    async getResidentsByPurok(purok: string): Promise<Resident[]> {
        const response = await this.requestAll<Resident>(
            `/residents?purok=${encodeURIComponent(purok)}`
        );

        if (response.data) {
            return response.data;
        }
        return [];
    }

    async uploadProfilePhoto(residentId: number, photo: File): Promise<Resident> {
        const formData = new FormData();
        formData.append('photo', photo);

        const response = await this.request<Resident>(`/residents/${residentId}/photo`, {
            method: 'POST',
            body: formData,
            headers: {
                // Don't set Content-Type for FormData, let browser set it with boundary
            }
        });

        if (response.data) {
            return response.data;
        }
        throw new Error(JSON.stringify(response) || 'Failed to upload profile photo');
    }

    // Helper method to transform form data to API format
    transformFormDataToApiFormat(formData: ResidentFormData): CreateResidentData {
        return {
            // Basic Information
            first_name: formData.firstName,
            last_name: formData.lastName,
            middle_name: formData.middleName || null,
            suffix: formData.suffix || null,
            birth_date: formData.birthDate,
            birth_place: formData.birthPlace,
            gender: formData.gender as Gender,
            civil_status: formData.civilStatus as CivilStatus,
            nationality: formData.nationality,
            religion: formData.religion || null,
            employment_status: formData.employmentStatus as EmploymentStatus || null,
            educational_attainment: formData.educationalAttainment || null,

            // Contact Information
            mobile_number: formData.mobileNumber || null,
            telephone_number: formData.landlineNumber || null,
            email_address: formData.emailAddress || null,
            complete_address: formData.completeAddress,
            house_number: formData.houseNumber || null,
            street: formData.street || null,
            purok: formData.purok || null,

            // Family Information
            emergency_contact_name: formData.emergencyContactName || null,
            emergency_contact_number: formData.emergencyContactNumber || null,
            emergency_contact_relationship: formData.emergencyContactRelationship || null,

            // Parent Information
            mother_name: formData.motherName || null,
            father_name: formData.fatherName || null,

            // Government IDs
            primary_id_type: formData.primaryIdType as IdType || null,
            id_number: formData.idNumber || null,
            philhealth_number: formData.philhealthNumber || null,
            sss_number: formData.sssNumber || null,
            tin_number: formData.tinNumber || null,
            voters_id_number: formData.votersIdNumber || null,
            voter_status: formData.voterStatus as VoterStatus || "NOT_REGISTERED",
            precinct_number: formData.precinctNumber || null,

            // Employment Information
            occupation: formData.occupation || null,
            employer: formData.employer || null,
            monthly_income: formData.monthlyIncome ? parseFloat(formData.monthlyIncome) : null,

            // Health & Medical
            medical_conditions: formData.medicalConditions || null,
            allergies: formData.allergies || null,

            // Special Classifications
            senior_citizen: formData.specialClassifications.seniorCitizen,
            person_with_disability: formData.specialClassifications.personWithDisability,
            disability_type: formData.specialClassifications.disabilityType || null,
            indigenous_people: formData.specialClassifications.indigenousPeople,
            indigenous_group: formData.specialClassifications.indigenousGroup || null,
            four_ps_beneficiary: formData.specialClassifications.fourPsBeneficiary,
            four_ps_household_id: formData.specialClassifications.fourPsHouseholdId || null,

            // Default values
            status: "ACTIVE" as ResidentStatus,

            profile_photo_url: formData.profile_photo_url || null,
        };
    }

    async getSeniorCitizens(purok?: string): Promise<Resident[]> {
        const params = purok ? `?purok=${encodeURIComponent(purok)}` : '';
        const response = await this.request<{ data: Resident[], count: number }>(`/residents/senior-citizens${params}`);
        
        if (response.data) {
            return response.data.data;
        }
        throw new Error('Failed to get senior citizens');
    }

    async getPWD(purok?: string): Promise<Resident[]> {
        const params = purok ? `?purok=${encodeURIComponent(purok)}` : '';
        const response = await this.request<{ data: Resident[], count: number }>(`/residents/pwd${params}`);
        
        if (response.data) {
            return response.data.data;
        }
        throw new Error('Failed to get PWD residents');
    }

    async getFourPs(purok?: string): Promise<Resident[]> {
        const params = purok ? `?purok=${encodeURIComponent(purok)}` : '';
        const response = await this.request<{ data: Resident[], count: number }>(`/residents/four-ps${params}`);
        
        if (response.data) {
            return response.data.data;
        }
        throw new Error('Failed to get 4Ps beneficiaries');
    }

    async getHouseholdHeads(purok?: string): Promise<Resident[]> {
        const params = purok ? `?purok=${encodeURIComponent(purok)}` : '';
        const response = await this.request<{ data: Resident[], count: number }>(`/residents/household-heads${params}`);
        
        if (response.data) {
            return response.data.data;
        }
        throw new Error('Failed to get household heads');
    }

    async getByPurok(purok: string): Promise<Resident[]> {
        const response = await this.request<{ data: Resident[] }>(`/residents/by-purok?purok=${encodeURIComponent(purok)}`);
        
        if (response.data) {
            return response.data.data;
        }
        throw new Error('Failed to get residents by purok');
    }    async getAgeGroupStatistics(): Promise<AgeGroupStatistics> {
        const response = await this.request<AgeGroupStatistics>('/residents/age-groups');
        
        if (response.data) {
            return response.data;
        }
        throw new Error('Failed to get age group statistics');
    }
}

// ===== TYPES TO ADD TO types.ts =====

