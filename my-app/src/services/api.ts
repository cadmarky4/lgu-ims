import { type ApiResponse, type PaginatedResponse } from './types';
import { triggerLogout } from './auth-error-handler';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export class BaseApiService {
  protected getToken(): string | null {
    // Always get the fresh token from storage
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  protected getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }
  protected async request<T>(
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

      // Check for authentication errors before parsing JSON
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication error detected in API response:', response.status);
        // Clear any stored auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        
        // Trigger logout
        triggerLogout();
        
        // Return a rejected promise to stop further processing
        throw new Error('Authentication failed');
      }

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
  protected async requestAll<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      // Check for authentication errors before parsing JSON
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication error detected in API response:', response.status);
        // Clear any stored auth data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        
        // Trigger logout
        triggerLogout();
        
        // Return a rejected promise to stop further processing
        throw new Error('Authentication failed');
      }

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
  public setToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
    }
  }
}