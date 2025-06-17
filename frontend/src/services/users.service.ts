import { BaseApiService } from './api';
import { type PaginatedResponse } from './types';
import { 
  type User, 
  type UserFormData, 
  type CreateUserData, 
  type UpdateUserData, 
  type UserParams 
} from './user.types';

export class UsersService extends BaseApiService {
  
  /**
   * Get all users with optional filtering and pagination
   */  async getUsers(params?: UserParams): Promise<{ data: User[], total: number, current_page: number, last_page: number }> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }      const response = await this.request(`/users?${queryParams.toString()}`);
        // Handle Laravel pagination structure
      if (response.data) {
        // Check if it's Laravel pagination format
        if (typeof response.data === 'object' && 'data' in response.data && Array.isArray(response.data.data)) {
          const paginatedData = response.data as PaginatedResponse<User>;
          return {
            data: paginatedData.data,
            total: paginatedData.total || 0,
            current_page: paginatedData.current_page || 1,
            last_page: paginatedData.last_page || 1
          };
        }
        // Handle direct array format (fallback)
        else if (Array.isArray(response.data)) {
          return {
            data: response.data,
            total: response.data.length,
            current_page: 1,
            last_page: 1
          };
        }
      }

      throw new Error('Invalid response format');
    } catch (error: unknown) {
      console.error('Failed to fetch users:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      throw new Error(message);
    }
  }

  /**
   * Get a single user by ID
   */
  async getUser(id: number): Promise<User> {
    try {
      const response = await this.request(`/users/${id}`);
      
      if (response.data) {
        return response.data as User;
      }

      throw new Error('User not found');
    } catch (error: unknown) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw new Error(error.message || 'Failed to fetch user');
    }
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserFormData): Promise<User> {
    try {
      const apiData = this.transformFormDataToApiFormat(userData);
      
      const response = await this.request('/users', {
        method: 'POST',
        body: JSON.stringify(apiData),
      });

      if (response.data) {
        return response.data as User;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(JSON.stringify(response) || 'Validation failed');
        (error as Error).response = {
          data: { errors: response.errors }
        };
        throw error;
      }

      throw new Error(JSON.stringify(response) || 'Failed to create user');
    } catch (error: unknown) {
      if (error.response && error.response.data) {
        throw error;
      }

      const wrappedError = new Error(error.message || 'Failed to create user');
      (wrappedError as Error).response = {
        data: { message: error.message || 'Failed to create user' }
      };
      throw wrappedError;
    }
  }

  /**
   * Update an existing user
   */
  async updateUser(id: number, userData: Partial<UserFormData>): Promise<User> {
    try {
      const apiData = this.transformPartialFormDataToApiFormat(userData);
      
      const response = await this.request(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiData),
      });

      if (response.data) {
        return response.data as User;
      }

      if (response.errors && Object.keys(response.errors).length > 0) {
        const error = new Error(JSON.stringify(response) || 'Validation failed');
        (error as Error).response = {
          data: { errors: response.errors }
        };
        throw error;
      }

      throw new Error(JSON.stringify(response) || `Failed to update user #${id}`);
    } catch (error: unknown) {
      if (error.response && error.response.data) {
        throw error;
      }

      const wrappedError = new Error(error.message || `Failed to update user #${id}`);
      (wrappedError as Error).response = {
        data: { message: error.message || `Failed to update user #${id}` }
      };
      throw wrappedError;
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<void> {
    try {
      await this.request(`/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error: unknown) {
      console.error(`Failed to delete user ${id}:`, error);
      throw new Error(error.message || 'Failed to delete user');
    }
  }

  /**
   * Toggle user active status
   */
  async toggleUserStatus(id: number): Promise<User> {
    try {
      const response = await this.request(`/users/${id}/toggle-status`, {
        method: 'PATCH',
      });

      if (response.data) {
        return response.data as User;
      }

      throw new Error('Failed to toggle user status');
    } catch (error: unknown) {
      console.error(`Failed to toggle status for user ${id}:`, error);
      throw new Error(error.message || 'Failed to toggle user status');
    }
  }

  /**
   * Reset user password
   */
  async resetUserPassword(id: number, newPassword: string): Promise<void> {
    try {
      await this.request(`/users/${id}/reset-password`, {
        method: 'PATCH',
        body: JSON.stringify({
          password: newPassword,
          password_confirmation: newPassword
        }),
      });
    } catch (error: unknown) {
      console.error(`Failed to reset password for user ${id}:`, error);
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const response = await this.request(`/users/by-role/${role}`);
      
      if (response.data) {
        return response.data as User[];
      }

      return [];
    } catch (error: unknown) {
      console.error(`Failed to fetch users by role ${role}:`, error);
      throw new Error(error.message || 'Failed to fetch users by role');
    }
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      const response = await this.request(`/users/by-department/${department}`);
      
      if (response.data) {
        return response.data as User[];
      }

      return [];
    } catch (error: unknown) {
      console.error(`Failed to fetch users by department ${department}:`, error);
      throw new Error(error.message || 'Failed to fetch users by department');
    }
  }
  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<{ total: number, active: number, admins: number, newThisMonth: number }> {
    try {
      const response = await this.request('/users/statistics');
      
      if (response.data) {
        // Map backend field names to frontend expected names
        const backendStats = response.data as {
          total_users?: number;
          active_users?: number;
          admin_users?: number;
          recent_users?: number;
        };
        return {
          total: backendStats.total_users || 0,
          active: backendStats.active_users || 0,
          admins: backendStats.admin_users || 0,
          newThisMonth: backendStats.recent_users || 0
        };
      }

      throw new Error('Invalid statistics response');
    } catch (error: unknown) {
      console.error('Failed to fetch user statistics:', error);
      // Return default values on error
      return {
        total: 0,
        active: 0,
        admins: 0,
        newThisMonth: 0
      };
    }
  }

  /**
   * Transform frontend form data to backend API format
   */
  private transformFormDataToApiFormat(formData: UserFormData): CreateUserData {
    return {
      first_name: formData.firstName,
      last_name: formData.lastName,
      middle_name: formData.middleName || undefined,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      position: formData.position || undefined,
      employee_id: formData.employeeId || undefined,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      is_active: formData.isActive,
      notes: formData.notes || undefined,
    };
  }

  /**
   * Transform partial frontend form data to backend API format for updates
   */
  private transformPartialFormDataToApiFormat(formData: Partial<UserFormData>): UpdateUserData {
    const apiData: UpdateUserData = {};

    if (formData.firstName !== undefined) apiData.first_name = formData.firstName;
    if (formData.lastName !== undefined) apiData.last_name = formData.lastName;
    if (formData.middleName !== undefined) apiData.middle_name = formData.middleName || undefined;
    if (formData.email !== undefined) apiData.email = formData.email;
    if (formData.username !== undefined) apiData.username = formData.username;
    if (formData.phone !== undefined) apiData.phone = formData.phone;
    if (formData.role !== undefined) apiData.role = formData.role;
    if (formData.department !== undefined) apiData.department = formData.department;
    if (formData.position !== undefined) apiData.position = formData.position || undefined;
    if (formData.employeeId !== undefined) apiData.employee_id = formData.employeeId || undefined;
    if (formData.isActive !== undefined) apiData.is_active = formData.isActive;
    if (formData.notes !== undefined) apiData.notes = formData.notes || undefined;

    return apiData;
  }

  /**
   * Transform backend API data to frontend format
   */
  transformApiDataToFormData(user: User): UserFormData {
    return {
      firstName: user.first_name,
      lastName: user.last_name,
      middleName: user.middle_name || '',
      email: user.email,
      username: user.username,
      phone: user.phone,
      role: user.role,
      department: user.department,
      position: user.position || '',
      employeeId: user.employee_id || '',
      password: '',
      confirmPassword: '',
      isActive: user.is_active,
      sendCredentials: false,
      notes: user.notes || '',
    };
  }
}

