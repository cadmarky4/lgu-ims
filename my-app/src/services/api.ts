// API Service for LGU Information Management System
// This service handles all communication with the Laravel backend

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Auth types
interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  middleName?: string;
  position: string;
  department: string;
  employeeId: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  is_active: boolean;
  roles: any[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.message || 'Login failed');
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.confirmPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        middle_name: userData.middleName,
      }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('auth_token', this.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.token = null;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/user');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error('Failed to get current user');
  }

  // Residents methods
  async getResidents(params: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    gender?: string;
    purok?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/residents?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createResident(residentData: any): Promise<any> {
    const response = await this.request('/residents', {
      method: 'POST',
      body: JSON.stringify(residentData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateResident(id: number, residentData: any): Promise<any> {
    const response = await this.request(`/residents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(residentData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteResident(id: number): Promise<void> {
    const response = await this.request(`/residents/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getResidentStatistics(): Promise<any> {
    const response = await this.request('/residents/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  // Check for potential duplicate residents
  async checkDuplicateResident(firstName: string, lastName: string, birthDate: string): Promise<any[]> {
    const searchTerm = `${firstName} ${lastName}`;
    const response = await this.request<PaginatedResponse<any>['data']>(
      `/residents?search=${encodeURIComponent(searchTerm)}&per_page=10`
    );

    if (response.success && response.data) {
      // Filter results to find potential duplicates
      return response.data.data.filter((resident: any) => {
        const residentBirthDate = new Date(resident.birth_date).toISOString().split('T')[0];
        const searchBirthDate = new Date(birthDate).toISOString().split('T')[0];
        
        return resident.first_name.toLowerCase() === firstName.toLowerCase() &&
               resident.last_name.toLowerCase() === lastName.toLowerCase() &&
               residentBirthDate === searchBirthDate;
      });
    }
    
    return [];
  }

  // Households methods
  async getHouseholds(params: {
    page?: number;
    per_page?: number;
    search?: string;
    purok?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/households?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }
  async createHousehold(householdData: any): Promise<any> {
    try {
      const response = await this.request('/households', {
        method: 'POST',
        body: JSON.stringify(householdData),
      });

      if (response.success) {
        return response.data;
      }
      
      // If the response contains validation errors, format them for the UI to handle
      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(response.message || 'Validation failed');
        (error as any).response = {
          data: { errors: response.errors }
        };
        throw error;
      }
      
      throw new Error(response.message || 'Failed to create household');
    } catch (error: any) {
      // If this is already a formatted error, just rethrow it
      if (error.response && error.response.data) {
        throw error;
      }
      
      // Otherwise wrap the error with our expected format
      const wrappedError = new Error(error.message || 'Failed to create household');
      (wrappedError as any).response = {
        data: { errors: { general: ['Server error occurred'] } }
      };
      throw wrappedError;
    }
  }
  async updateHousehold(id: number, householdData: any): Promise<any> {
    try {
      const response = await this.request(`/households/${id}`, {
        method: 'PUT',
        body: JSON.stringify(householdData),
      });

      if (response.success) {
        return response.data;
      }
      
      // If the response contains validation errors, format them for the UI to handle
      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(response.message || 'Validation failed');
        (error as any).response = {
          data: { errors: response.errors }
        };
        throw error;
      }
      
      throw new Error(response.message || `Failed to update household #${id}`);
    } catch (error: any) {
      // If this is already a formatted error, just rethrow it
      if (error.response && error.response.data) {
        throw error;
      }
      
      // Otherwise wrap the error with our expected format
      const wrappedError = new Error(error.message || `Failed to update household #${id}`);
      (wrappedError as any).response = {
        data: { errors: { general: ['Server error occurred'] } }
      };
      throw wrappedError;
    }
  }

  async deleteHousehold(id: number): Promise<void> {
    const response = await this.request(`/households/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getHouseholdStatistics(): Promise<any> {
    const response = await this.request('/households/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  // Documents methods
  async getDocuments(params: {
    page?: number;
    per_page?: number;
    search?: string;
    document_type?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/documents?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createDocument(documentData: any): Promise<any> {
    const response = await this.request('/documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async approveDocument(id: number, approvalData: any = {}): Promise<any> {
    const response = await this.request(`/documents/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(approvalData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async rejectDocument(id: number, rejectionData: any): Promise<any> {
    const response = await this.request(`/documents/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(rejectionData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async releaseDocument(id: number, releaseData: any = {}): Promise<any> {
    const response = await this.request(`/documents/${id}/release`, {
      method: 'POST',
      body: JSON.stringify(releaseData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async getDocumentStatistics(): Promise<any> {
    const response = await this.request('/documents/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  // Projects methods
  async getProjects(params: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/projects?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createProject(projectData: any): Promise<any> {
    const response = await this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateProject(id: number, projectData: any): Promise<any> {
    const response = await this.request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteProject(id: number): Promise<void> {
    const response = await this.request(`/projects/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async approveProject(id: number): Promise<any> {
    const response = await this.request(`/projects/${id}/approve`, {
      method: 'POST',
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async startProject(id: number): Promise<any> {
    const response = await this.request(`/projects/${id}/start`, {
      method: 'POST',
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async completeProject(id: number, completionData: any = {}): Promise<any> {
    const response = await this.request(`/projects/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async getProjectStatistics(): Promise<any> {
    const response = await this.request('/projects/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  // Barangay Officials methods
  async getBarangayOfficials(params: {
    page?: number;
    per_page?: number;
    search?: string;
    position?: string;
    committee?: string;
    is_active?: boolean;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/barangay-officials?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createBarangayOfficial(officialData: any): Promise<any> {
    const response = await this.request('/barangay-officials', {
      method: 'POST',
      body: JSON.stringify(officialData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateBarangayOfficial(id: number, officialData: any): Promise<any> {
    const response = await this.request(`/barangay-officials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(officialData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteBarangayOfficial(id: number): Promise<void> {
    const response = await this.request(`/barangay-officials/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getActiveOfficials(): Promise<any[]> {
    const response = await this.request<any[]>('/barangay-officials/active');
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.message);
  }

  async getBarangayOfficialStatistics(): Promise<any> {
    const response = await this.request('/barangay-officials/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  // Users methods
  async getUsers(params: {
    page?: number;
    per_page?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/users?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createUser(userData: any): Promise<any> {
    const response = await this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateUser(id: number, userData: any): Promise<any> {
    const response = await this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteUser(id: number): Promise<void> {
    const response = await this.request(`/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  // Help Desk methods
  async getComplaints(params: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/complaints?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }
  async createComplaint(complaintData: any): Promise<any> {
    const response = await this.request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteComplaint(id: number): Promise<void> {
    const response = await this.request(`/complaints/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getComplaintStatistics(): Promise<any> {
    const response = await this.request('/complaints/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async getSuggestions(params: {
    page?: number;
    per_page?: number;
    search?: string;
    category?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/suggestions?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createSuggestion(suggestionData: any): Promise<any> {
    const response = await this.request('/suggestions', {
      method: 'POST',
      body: JSON.stringify(suggestionData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateSuggestion(id: number, suggestionData: any): Promise<any> {
    const response = await this.request(`/suggestions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(suggestionData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteSuggestion(id: number): Promise<void> {
    const response = await this.request(`/suggestions/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getSuggestionStatistics(): Promise<any> {
    const response = await this.request('/suggestions/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async getBlotterCases(params: {
    page?: number;
    per_page?: number;
    search?: string;
    case_type?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/blotter-cases?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createBlotterCase(caseData: any): Promise<any> {
    const response = await this.request('/blotter-cases', {
      method: 'POST',
      body: JSON.stringify(caseData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateBlotterCase(id: number, caseData: any): Promise<any> {
    const response = await this.request(`/blotter-cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(caseData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteBlotterCase(id: number): Promise<void> {
    const response = await this.request(`/blotter-cases/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getBlotterCaseStatistics(): Promise<any> {
    const response = await this.request('/blotter-cases/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async getAppointments(params: {
    page?: number;
    per_page?: number;
    search?: string;
    appointment_type?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<PaginatedResponse<any>['data']>(
      `/appointments?${searchParams.toString()}`
    );

    if (response.success) {
      return response.data!;
    }
    throw new Error(response.message);
  }

  async createAppointment(appointmentData: any): Promise<any> {
    const response = await this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async updateAppointment(id: number, appointmentData: any): Promise<any> {
    const response = await this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });

    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }

  async deleteAppointment(id: number): Promise<void> {
    const response = await this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message);
    }
  }

  async getAppointmentStatistics(): Promise<any> {
    const response = await this.request('/appointments/statistics');
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  }
  // Dashboard statistics
  async getDashboardStatistics(): Promise<any> {
    try {
      const response = await this.request('/dashboard/statistics');
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message);
    } catch (error) {
      console.error('Dashboard statistics API not available, using fallback');
      // Return fallback data structure
      return {
        total_residents: 0,
        total_households: 0,
        total_appointments: 0,
        total_blotter_cases: 0,
        total_suggestions: 0,
        total_complaints: 0,
        total_officials: 0,
        total_documents: 0
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;