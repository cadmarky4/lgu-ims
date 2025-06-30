// ============================================================================
// services/users/users.service.ts - Users service implementation
// ============================================================================

import { z } from 'zod';

import { BaseApiService } from '@/services/__shared/api';
import {
  UserSchema,
  UserParamsSchema,
  UserStatisticsSchema,
  CreateUserFormDataSchema,
  UpdateUserFormDataSchema,
  ChangePasswordSchema,
  UserPermissionsSchema,
  type User,
  type UserParams,
  type UserStatistics,
  type CreateUserFormData,
  type UpdateUserFormData,
  type ChangePasswordData,
  type UserPermissions,
  type UserRole,
  type Department,
} from '@/services/users/users.types';

import {
  ApiResponseSchema,
  PaginatedResponseSchema,
  type PaginatedResponse
} from '@/services/__shared/types';
import { apiClient } from '@/services/__shared/client';

// Additional schemas for user-specific operations
const UserListResponseSchema = PaginatedResponseSchema(UserSchema);

const UserActivitySchema = z.object({
  id: z.number(),
  user_id: z.number(),
  action: z.string(),
  resource: z.string(),
  resource_id: z.number().nullable(),
  ip_address: z.string(),
  user_agent: z.string(),
  created_at: z.string(),
});

const UserSessionSchema = z.object({
  id: z.string(),
  user_id: z.number(),
  ip_address: z.string(),
  user_agent: z.string(),
  last_activity: z.string(),
  is_current: z.boolean(),
});

const BulkUserActionSchema = z.object({
  user_ids: z.array(z.number()),
  action: z.enum(['activate', 'deactivate', 'delete', 'reset_password']),
  reason: z.string().optional(),
});

type UserActivity = z.infer<typeof UserActivitySchema>;
type UserSession = z.infer<typeof UserSessionSchema>;
type BulkUserAction = z.infer<typeof BulkUserActionSchema>;

export class UsersService extends BaseApiService {
  /**
   * Get paginated list of users
   */
  async getUsers(params: UserParams = {}): Promise<PaginatedResponse<User>> {
    // Validate input parameters
    const validatedParams = UserParamsSchema.parse(params);
    
    // Build query string
    const searchParams = new URLSearchParams();
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    return this.request(
      `/users?${searchParams.toString()}`,
      UserListResponseSchema,
      { method: 'GET' }
    );
  }

  /**
   * Get single user by ID
   */
  async getUser(id: number): Promise<User> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      `/users/${id}`,
      responseSchema,
      { method: 'GET' }
    );

    if (!response.data) {
      throw new Error('User not found');
    }

    return response.data;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      '/users/me',
      responseSchema,
      { method: 'GET' }
    );

    if (!response.data) {
      throw new Error('Unable to get current user');
    }

    return response.data;
  }

  /**
   * Create new user
   */
  async createUser(userData: CreateUserFormData): Promise<User> {
    // Validate input data
    const validatedData = CreateUserFormDataSchema.parse(userData);
    
    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      '/users',
      responseSchema,
      {
        method: 'POST',
        data: validatedData,
      }
    );

    if (!response.data) {
      throw new Error('Failed to create user');
    }

    return response.data;
  }

  /**
   * Update existing user
   */
  async updateUser(id: number, userData: UpdateUserFormData): Promise<User> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    // Validate input data
    const validatedData = UpdateUserFormDataSchema.parse(userData);
    
    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      `/users/${id}`,
      responseSchema,
      {
        method: 'PUT',
        data: validatedData,
      }
    );

    if (!response.data) {
      throw new Error('Failed to update user');
    }

    return response.data;
  }

  /**
   * Update current user profile
   */
  async updateCurrentUser(userData: Partial<UpdateUserFormData>): Promise<User> {
    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      '/users/me',
      responseSchema,
      {
        method: 'PUT',
        data: userData,
      }
    );

    if (!response.data) {
      throw new Error('Failed to update profile');
    }

    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      `/users/${id}`,
      responseSchema,
      { method: 'DELETE' }
    );
  }

  /**
   * Change user password
   */
  async changePassword(id: number, passwordData: ChangePasswordData): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    // Validate input data
    const validatedData = ChangePasswordSchema.parse(passwordData);
    
    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      `/users/${id}/change-password`,
      responseSchema,
      {
        method: 'POST',
        data: validatedData,
      }
    );
  }

  /**
   * Change current user password
   */
  async changeCurrentUserPassword(passwordData: ChangePasswordData): Promise<void> {
    // Validate input data
    const validatedData = ChangePasswordSchema.parse(passwordData);
    
    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      '/users/me/change-password',
      responseSchema,
      {
        method: 'POST',
        data: validatedData,
      }
    );
  }

  /**
   * Reset user password (admin only)
   */
  async resetUserPassword(id: number, sendEmail = true): Promise<{ temporary_password?: string }> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.object({
      temporary_password: z.string().optional(),
      message: z.string(),
    }));
    
    const response = await this.request(
      `/users/${id}/reset-password`,
      responseSchema,
      {
        method: 'POST',
        data: { send_email: sendEmail },
      }
    );

    return response.data || {};
  }

  /**
   * Change user status (activate/deactivate/suspend)
   */
  async changeUserStatus(id: number, status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED', reason?: string): Promise<User> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      `/users/${id}/status`,
      responseSchema,
      {
        method: 'PUT',
        data: { status, reason },
      }
    );

    if (!response.data) {
      throw new Error('Failed to change user status');
    }

    return response.data;
  }

  /**
   * Activate user
   */
  async activateUser(id: number, reason?: string): Promise<User> {
    return this.changeUserStatus(id, 'ACTIVE', reason);
  }

  /**
   * Deactivate user
   */
  async deactivateUser(id: number, reason?: string): Promise<User> {
    return this.changeUserStatus(id, 'INACTIVE', reason);
  }

  /**
   * Suspend user
   */
  async suspendUser(id: number, reason?: string): Promise<User> {
    return this.changeUserStatus(id, 'SUSPENDED', reason);
  }

  /**
   * Verify user email
   */
  async verifyUser(id: number): Promise<User> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(UserSchema);
    
    const response = await this.request(
      `/users/${id}/verify`,
      responseSchema,
      { method: 'POST' }
    );

    if (!response.data) {
      throw new Error('Failed to verify user');
    }

    return response.data;
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      `/users/${id}/resend-verification`,
      responseSchema,
      { method: 'POST' }
    );
  }

  /**
   * Send user credentials via email
   */
  async sendUserCredentials(id: number, includePassword = false): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      `/users/${id}/send-credentials`,
      responseSchema,
      {
        method: 'POST',
        data: { include_password: includePassword },
      }
    );
  }

  /**
   * Get user statistics
   */
  async getUserStatistics(): Promise<UserStatistics> {
    const responseSchema = ApiResponseSchema(UserStatisticsSchema);
    
    const response = await this.request(
      '/users/statistics',
      responseSchema,
      { method: 'GET' }
    );

    if (!response.data) {
      throw new Error('Failed to get user statistics');
    }

    return response.data;
  }

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string, limit = 10): Promise<User[]> {
    if (!searchTerm.trim()) {
      return [];
    }

    const response = await this.request(
      `/users?search=${encodeURIComponent(searchTerm)}&per_page=${limit}`,
      UserListResponseSchema,
      { method: 'GET' }
    );

    return response.data;
  }

  /**
   * Check username availability
   */
  async checkUsernameAvailability(username: string, excludeUserId?: number): Promise<boolean> {
    if (!username.trim()) {
      throw new Error('Username is required');
    }

    const responseSchema = ApiResponseSchema(z.object({
      available: z.boolean(),
    }));

    const params = new URLSearchParams({ username });
    if (excludeUserId) {
      params.append('exclude_user_id', excludeUserId.toString());
    }
    
    const response = await this.request(
      `/users/check-username?${params.toString()}`,
      responseSchema,
      { method: 'GET' }
    );

    return response.data?.available || false;
  }

  /**
   * Check email availability
   */
  async checkEmailAvailability(email: string, excludeUserId?: number): Promise<boolean> {
    if (!email.trim()) {
      throw new Error('Email is required');
    }

    const responseSchema = ApiResponseSchema(z.object({
      available: z.boolean(),
    }));

    const params = new URLSearchParams({ email });
    if (excludeUserId) {
      params.append('exclude_user_id', excludeUserId.toString());
    }
    
    const response = await this.request(
      `/users/check-email?${params.toString()}`,
      responseSchema,
      { method: 'GET' }
    );

    return response.data?.available || false;
  }

  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    const response = await this.request(
      `/users?role=${role}&per_page=100`,
      UserListResponseSchema,
      { method: 'GET' }
    );

    return response.data;
  }

  /**
   * Get users by department
   */
  async getUsersByDepartment(department: Department): Promise<User[]> {
    const response = await this.request(
      `/users?department=${department}&per_page=100`,
      UserListResponseSchema,
      { method: 'GET' }
    );

    return response.data;
  }

  /**
   * Get user activity log
   */
  async getUserActivity(id: number, limit = 50): Promise<UserActivity[]> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.array(UserActivitySchema));
    
    const response = await this.request(
      `/users/${id}/activity?limit=${limit}`,
      responseSchema,
      { method: 'GET' }
    );

    return response.data || [];
  }

  /**
   * Get user active sessions
   */
  async getUserSessions(id: number): Promise<UserSession[]> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.array(UserSessionSchema));
    
    const response = await this.request(
      `/users/${id}/sessions`,
      responseSchema,
      { method: 'GET' }
    );

    return response.data || [];
  }

  /**
   * Terminate user session
   */
  async terminateUserSession(userId: number, sessionId: string): Promise<void> {
    if (!userId || userId <= 0) {
      throw new Error('Invalid user ID');
    }

    if (!sessionId.trim()) {
      throw new Error('Session ID is required');
    }

    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      `/users/${userId}/sessions/${sessionId}`,
      responseSchema,
      { method: 'DELETE' }
    );
  }

  /**
   * Terminate all user sessions except current
   */
  async terminateAllUserSessions(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      `/users/${id}/sessions`,
      responseSchema,
      { method: 'DELETE' }
    );
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(id: number): Promise<UserPermissions> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const responseSchema = ApiResponseSchema(UserPermissionsSchema);
    
    const response = await this.request(
      `/users/${id}/permissions`,
      responseSchema,
      { method: 'GET' }
    );

    if (!response.data) {
      throw new Error('Failed to get user permissions');
    }

    return response.data;
  }

  /**
   * Update user permissions
   */
  async updateUserPermissions(id: number, permissions: UserPermissions): Promise<UserPermissions> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    const validatedPermissions = UserPermissionsSchema.parse(permissions);
    
    const responseSchema = ApiResponseSchema(UserPermissionsSchema);
    
    const response = await this.request(
      `/users/${id}/permissions`,
      responseSchema,
      {
        method: 'PUT',
        data: validatedPermissions,
      }
    );

    if (!response.data) {
      throw new Error('Failed to update user permissions');
    }

    return response.data;
  }

  /**
   * Bulk user actions
   */
  async bulkUserAction(action: BulkUserAction): Promise<void> {
    const validatedAction = BulkUserActionSchema.parse(action);
    
    const responseSchema = ApiResponseSchema(z.any());
    
    await this.request(
      '/users/bulk-action',
      responseSchema,
      {
        method: 'POST',
        data: validatedAction,
      }
    );
  }

  /**
   * Export users data
   */
  async exportUsers(params: UserParams = {}, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    const validatedParams = UserParamsSchema.parse(params);
    
    const searchParams = new URLSearchParams();
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    searchParams.append('format', format);

    const response = await apiClient.get(`/users/export?${searchParams.toString()}`, {
      responseType: 'blob',
    });

    return response.data;
  }

  /**
   * Upload users from file (CSV/Excel)
   */
  async importUsers(file: File, options: {
    update_existing?: boolean;
    send_credentials?: boolean;
    default_password?: string;
  } = {}): Promise<{
    success_count: number;
    error_count: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    if (!file) {
      throw new Error('File is required');
    }

    // Validate file type
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only CSV and Excel files are allowed.');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));

    const response = await apiClient.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes
    });

    const responseSchema = ApiResponseSchema(z.object({
      success_count: z.number(),
      error_count: z.number(),
      errors: z.array(z.object({
        row: z.number(),
        error: z.string(),
      })),
    }));

    const validatedResponse = responseSchema.parse(response.data);

    if (!validatedResponse.data) {
      throw new Error('Failed to import users');
    }

    return validatedResponse.data;
  }
}

// Create singleton instance
export const usersService = new UsersService();