// ============================================================================
// services/auth/auth.service.ts - Auth service implementation
// ============================================================================

import { BaseApiService } from '@/services/__shared/api';
import {
  ApiResponseSchema,
} from '@/services/__shared/types';
import { 
  LoginCredentialsRequestSchema,
  LoginResponseSchema,
  MiniUserSchema,
  type LoginCredentialsRequest,
  type LoginResponse,
  type MiniUser,
} from './auth.types';
import { tokenStorage } from '@/services/__shared/client';

import { z } from 'zod';

export class AuthService extends BaseApiService {
  async login(credentials: LoginCredentialsRequest): Promise<LoginResponse> {
    // Validate input
    const validatedCredentials = LoginCredentialsRequestSchema.parse(credentials);
    
    const responseSchema = ApiResponseSchema(LoginResponseSchema);
    
    const response = await this.request('/auth/login', responseSchema, {
      method: 'POST',
      data: {
        email: validatedCredentials.email,
        password: validatedCredentials.password,
      },
    });

    if (!response.data) {
      throw new Error('Login failed: No data returned');
    }

    // Store token and user data
    tokenStorage.set(response.data.token, validatedCredentials.rememberMe || false);
    
    const storage = validatedCredentials.rememberMe ? localStorage : sessionStorage;
    storage.setItem('auth_user', JSON.stringify(response.data.user));

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', ApiResponseSchema(z.any()), {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout request failed:', error);
      // Continue with cleanup even if request fails
    } finally {
      tokenStorage.remove();
    }
  }

  async getCurrentUser(): Promise<LoginResponse['user']> {
    const responseSchema = ApiResponseSchema(MiniUserSchema);
    
    const response = await this.request('/auth/user', responseSchema, {
      method: 'GET',
    });

    if (!response.data) {
      throw new Error('Failed to get current user: No data returned');
    }

    return response.data;
  }

  // Helper method to get cached user data
  getCachedUser(): MiniUser | null {
    try {
      const userData = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
      if (userData) {
        const parsed = JSON.parse(userData);
        return MiniUserSchema.parse(parsed);
      }
    } catch (error) {
      console.error('Error parsing cached user data:', error);
      // Clear invalid cached data
      localStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_user');
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!tokenStorage.get();
  }
}

// Create singleton instance
export const authService = new AuthService();
