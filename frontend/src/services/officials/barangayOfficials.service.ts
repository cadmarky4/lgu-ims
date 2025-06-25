import { BaseApiService } from '../__shared/api';
import { type PaginatedResponse } from '../__shared/types';
import type { 
  BarangayOfficial, 
  BarangayOfficialFormData, 
  BarangayOfficialFilters,
  BarangayOfficialStatistics,
  CreateBarangayOfficialData,
  UpdateBarangayOfficialData
} from './barangayOfficials.types';

export class BarangayOfficialsService extends BaseApiService {
  /**
   * Get all barangay officials with filters
   */
  async getBarangayOfficials(filters?: BarangayOfficialFilters): Promise<PaginatedResponse<BarangayOfficial>> {
    const params = new URLSearchParams();
    
    if (filters?.position) params.append('position', filters.position);
    if (filters?.committee) params.append('committee', filters.committee);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters?.current_term !== undefined) params.append('current_term', filters.current_term.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/barangay-officials?${queryString}` : '/barangay-officials';
    
    const response = await this.requestAll<BarangayOfficial>(url);
    
    if (response.data) {
      return response;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get barangay officials');
  }

  /**
   * Get a specific barangay official by ID
   */
  async getBarangayOfficial(id: number): Promise<BarangayOfficial> {
    const response = await this.request<BarangayOfficial>(`/barangay-officials/${id}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get barangay official');
  }
  /**
   * Create a new barangay official
   */
  async createBarangayOfficial(data: BarangayOfficialFormData | FormData): Promise<BarangayOfficial> {
    let requestOptions: RequestInit;
    
    if (data instanceof FormData) {
      // Handle FormData for file uploads
      requestOptions = {
        method: 'POST',
        body: data,
        // Don't set Content-Type header - let browser set it with boundary for FormData
      };
    } else {
      // Handle regular JSON data
      const apiData = this.transformFormDataToApiFormat(data);
      requestOptions = {
        method: 'POST',
        body: JSON.stringify(apiData),
      };
    }
    
    const response = await this.request<BarangayOfficial>('/barangay-officials', requestOptions);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to create barangay official');
  }
  /**
   * Update an existing barangay official
   */
  async updateBarangayOfficial(id: number, data: Partial<BarangayOfficialFormData> | FormData): Promise<BarangayOfficial> {
    let requestOptions: RequestInit;
    
    if (data instanceof FormData) {
      // Handle FormData for file uploads
      // Add _method field for Laravel to recognize this as PUT request
      data.append('_method', 'PUT');
      requestOptions = {
        method: 'POST', // Laravel requires POST for FormData with _method
        body: data,
        // Don't set Content-Type header - let browser set it with boundary for FormData
        headers: {
          // Ensure the X-HTTP-Method-Override header is set as well
          'X-HTTP-Method-Override': 'PUT'
        }
      };
    } else {
      // Handle regular JSON data
      const apiData = this.transformPartialFormDataToApiFormat(data);
      requestOptions = {
        method: 'PUT',
        body: JSON.stringify(apiData),
      };
    }
    
    const response = await this.request<BarangayOfficial>(`/barangay-officials/${id}`, requestOptions);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update barangay official');
  }

  /**
   * Delete a barangay official
   */
  async deleteBarangayOfficial(id: number): Promise<void> {
    const response = await this.request(`/barangay-officials/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error(JSON.stringify(response) || 'Failed to delete barangay official');
    }
  }

  /**
   * Get active officials
   */
  async getActiveOfficials(): Promise<BarangayOfficial[]> {
    const response = await this.request<BarangayOfficial[]>('/barangay-officials/active');
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get active officials');
  }

  /**
   * Get officials by position
   */
  async getOfficialsByPosition(position: string, activeOnly = false): Promise<BarangayOfficial[]> {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<BarangayOfficial[]>(`/barangay-officials/position/${position}${params}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get officials by position');
  }

  /**
   * Get officials by committee
   */
  async getOfficialsByCommittee(committee: string, activeOnly = false): Promise<BarangayOfficial[]> {
    const params = activeOnly ? '?active_only=true' : '';
    const response = await this.request<BarangayOfficial[]>(`/barangay-officials/committee/${committee}${params}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get officials by committee');
  }

  /**
   * Get barangay officials statistics
   */
  async getStatistics(): Promise<BarangayOfficialStatistics> {
    const response = await this.request<BarangayOfficialStatistics>('/barangay-officials/statistics');
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get barangay officials statistics');
  }

  /**
   * Update performance rating
   */
  async updatePerformance(id: number, data: {
    performance_rating: number;
    performance_notes?: string;
    evaluation_period: string;
    evaluated_by?: number;
  }): Promise<BarangayOfficial> {
    const response = await this.request<BarangayOfficial>(`/barangay-officials/${id}/performance`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update performance');
  }

  /**
   * Archive an official
   */
  async archiveOfficial(id: number, data: {
    end_reason: 'TERM_ENDED' | 'RESIGNED' | 'TERMINATED' | 'DECEASED' | 'TRANSFERRED';
    end_notes?: string;
    effective_date: string;
  }): Promise<BarangayOfficial> {
    const response = await this.request<BarangayOfficial>(`/barangay-officials/${id}/archive`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to archive official');
  }

  /**
   * Reactivate an official
   */
  async reactivateOfficial(id: number, data: {
    new_term_start: string;
    new_term_end: string;
    reactivation_notes?: string;
  }): Promise<BarangayOfficial> {
    const response = await this.request<BarangayOfficial>(`/barangay-officials/${id}/reactivate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to reactivate official');
  }

  /**
   * Export officials data
   */
  async exportOfficials(filters?: BarangayOfficialFilters): Promise<any> {
    const params = new URLSearchParams();
    
    if (filters?.position) params.append('position', filters.position);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    
    const queryString = params.toString();
    const url = queryString ? `/barangay-officials/export?${queryString}` : '/barangay-officials/export';
    
    const response = await this.request(url);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to export officials data');
  }

  /**
   * Transform frontend form data to backend API format
   */
  private transformFormDataToApiFormat(formData: BarangayOfficialFormData): CreateBarangayOfficialData {
    return {
      // Personal Information
      prefix: formData.prefix || undefined,
      first_name: formData.firstName,
      middle_name: formData.middleName || undefined,
      last_name: formData.lastName,
      gender: formData.gender,
      birth_date: formData.birthDate || undefined,
      contact_number: formData.contactNumber,
      email_address: formData.emailAddress || undefined,
      complete_address: formData.completeAddress || undefined,
      civil_status: formData.civilStatus || undefined,
      educational_background: formData.educationalBackground || undefined,
      
      // Position Information
      position: formData.position,
      position_title: formData.positionTitle || undefined,
      committee_assignment: formData.committeeAssignment || undefined,
      
      // Term Information
      term_start: formData.termStart,
      term_end: formData.termEnd,
      term_number: formData.termNumber || 1,
      is_current_term: formData.isCurrentTerm !== undefined ? formData.isCurrentTerm : true,
      
      // Election Information
      election_date: formData.electionDate || undefined,
      votes_received: formData.votesReceived || undefined,
      is_elected: formData.isElected !== undefined ? formData.isElected : true,
      appointment_document: formData.appointmentDocument || undefined,
      
      // Status
      status: formData.status || 'ACTIVE',
      status_date: formData.statusDate || undefined,
      status_reason: formData.statusReason || undefined,
      
      // Additional fields
      work_experience: formData.workExperience || undefined,
      skills_expertise: formData.skillsExpertise || undefined,
      trainings_attended: formData.trainingsAttended || undefined,
      certifications: formData.certifications || undefined,
      major_accomplishments: formData.majorAccomplishments || undefined,
      projects_initiated: formData.projectsInitiated || undefined,
      performance_notes: formData.performanceNotes || undefined,
      performance_rating: formData.performanceRating || undefined,
      
      // Emergency Contact
      emergency_contact_name: formData.emergencyContactName || undefined,
      emergency_contact_number: formData.emergencyContactNumber || undefined,
      emergency_contact_relationship: formData.emergencyContactRelationship || undefined,
      
      // Files
      documents: formData.documents || undefined,
      
      // Oath Information
      oath_taking_date: formData.oathTakingDate || undefined,
      oath_taking_notes: formData.oathTakingNotes || undefined,
      
      // System fields
      is_active: formData.isActive !== undefined ? formData.isActive : true,
    };
  }

  /**
   * Transform partial frontend form data to backend API format for updates
   */
  private transformPartialFormDataToApiFormat(formData: Partial<BarangayOfficialFormData>): UpdateBarangayOfficialData {
    const apiData: UpdateBarangayOfficialData = {};

    // Personal Information
    if (formData.prefix !== undefined) apiData.prefix = formData.prefix || undefined;
    if (formData.firstName !== undefined) apiData.first_name = formData.firstName;
    if (formData.middleName !== undefined) apiData.middle_name = formData.middleName || undefined;
    if (formData.lastName !== undefined) apiData.last_name = formData.lastName;
    if (formData.gender !== undefined) apiData.gender = formData.gender;
    if (formData.birthDate !== undefined) apiData.birth_date = formData.birthDate || undefined;
    if (formData.contactNumber !== undefined) apiData.contact_number = formData.contactNumber;
    if (formData.emailAddress !== undefined) apiData.email_address = formData.emailAddress || undefined;
    if (formData.completeAddress !== undefined) apiData.complete_address = formData.completeAddress || undefined;
    if (formData.civilStatus !== undefined) apiData.civil_status = formData.civilStatus || undefined;
    if (formData.educationalBackground !== undefined) apiData.educational_background = formData.educationalBackground || undefined;
    
    // Position Information
    if (formData.position !== undefined) apiData.position = formData.position;
    if (formData.positionTitle !== undefined) apiData.position_title = formData.positionTitle || undefined;
    if (formData.committeeAssignment !== undefined) apiData.committee_assignment = formData.committeeAssignment || undefined;
    
    // Term Information
    if (formData.termStart !== undefined) apiData.term_start = formData.termStart;
    if (formData.termEnd !== undefined) apiData.term_end = formData.termEnd;
    if (formData.termNumber !== undefined) apiData.term_number = formData.termNumber;
    if (formData.isCurrentTerm !== undefined) apiData.is_current_term = formData.isCurrentTerm;
    
    // Election Information
    if (formData.electionDate !== undefined) apiData.election_date = formData.electionDate || undefined;
    if (formData.votesReceived !== undefined) apiData.votes_received = formData.votesReceived || undefined;
    if (formData.isElected !== undefined) apiData.is_elected = formData.isElected;
    if (formData.appointmentDocument !== undefined) apiData.appointment_document = formData.appointmentDocument || undefined;
    
    // Status
    if (formData.status !== undefined) apiData.status = formData.status;
    if (formData.statusDate !== undefined) apiData.status_date = formData.statusDate || undefined;
    if (formData.statusReason !== undefined) apiData.status_reason = formData.statusReason || undefined;
    
    // Additional fields
    if (formData.workExperience !== undefined) apiData.work_experience = formData.workExperience || undefined;
    if (formData.skillsExpertise !== undefined) apiData.skills_expertise = formData.skillsExpertise || undefined;
    if (formData.trainingsAttended !== undefined) apiData.trainings_attended = formData.trainingsAttended || undefined;
    if (formData.certifications !== undefined) apiData.certifications = formData.certifications || undefined;
    if (formData.majorAccomplishments !== undefined) apiData.major_accomplishments = formData.majorAccomplishments || undefined;
    if (formData.projectsInitiated !== undefined) apiData.projects_initiated = formData.projectsInitiated || undefined;
    if (formData.performanceNotes !== undefined) apiData.performance_notes = formData.performanceNotes || undefined;
    if (formData.performanceRating !== undefined) apiData.performance_rating = formData.performanceRating || undefined;
    
    // Emergency Contact
    if (formData.emergencyContactName !== undefined) apiData.emergency_contact_name = formData.emergencyContactName || undefined;
    if (formData.emergencyContactNumber !== undefined) apiData.emergency_contact_number = formData.emergencyContactNumber || undefined;
    if (formData.emergencyContactRelationship !== undefined) apiData.emergency_contact_relationship = formData.emergencyContactRelationship || undefined;
    
    // Files
    if (formData.documents !== undefined) apiData.documents = formData.documents || undefined;
    
    // Oath Information
    if (formData.oathTakingDate !== undefined) apiData.oath_taking_date = formData.oathTakingDate || undefined;
    if (formData.oathTakingNotes !== undefined) apiData.oath_taking_notes = formData.oathTakingNotes || undefined;
    
    // System fields
    if (formData.isActive !== undefined) apiData.is_active = formData.isActive;

    apiData.profile_photo = formData.profile_photo || undefined;

    return apiData;
  }

  /**
   * Transform backend API data to frontend format
   */
  transformApiDataToFormData(official: BarangayOfficial): BarangayOfficialFormData {
    return {
      // Personal Information
      prefix: official.prefix || '',
      firstName: official.first_name,
      middleName: official.middle_name || '',
      lastName: official.last_name,
      gender: official.gender,
      birthDate: official.birth_date || '',
      contactNumber: official.contact_number,
      emailAddress: official.email_address || '',
      completeAddress: official.complete_address || '',
      civilStatus: official.civil_status!,
      educationalBackground: official.educational_background || '',
      
      // Position Information
      position: official.position,
      positionTitle: official.position_title || '',
      committeeAssignment: official.committee_assignment!,
      
      // Term Information
      termStart: official.term_start,
      termEnd: official.term_end,
      termNumber: official.term_number || 1,
      isCurrentTerm: official.is_current_term,
      
      // Election Information
      electionDate: official.election_date || '',
      votesReceived: official.votes_received || 0,
      isElected: official.is_elected,
      appointmentDocument: official.appointment_document || '',
      
      // Status
      status: official.status || 'ACTIVE',
      statusDate: official.status_date || '',
      statusReason: official.status_reason || '',
      
      // Additional fields
      workExperience: official.work_experience || '',
      skillsExpertise: official.skills_expertise || '',
      trainingsAttended: official.trainings_attended || [],
      certifications: official.certifications || [],
      majorAccomplishments: official.major_accomplishments || '',
      projectsInitiated: official.projects_initiated || [],
      performanceNotes: official.performance_notes || '',
      performanceRating: official.performance_rating || 0,
      
      // Emergency Contact
      emergencyContactName: official.emergency_contact_name || '',
      emergencyContactNumber: official.emergency_contact_number || '',
      emergencyContactRelationship: official.emergency_contact_relationship || '',
      
      // Files
      documents: official.documents || [],
      
      // Oath Information
      oathTakingDate: official.oath_taking_date || '',
      oathTakingNotes: official.oath_taking_notes || '',
      
      // System fields
      isActive: official.is_active,

      profile_photo: official.profile_photo || '',
    };
  }
}
