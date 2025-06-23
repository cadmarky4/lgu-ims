import { BaseApiService } from './api';
import { type LoginCredentials, type RegisterData } from './types';
import { type User } from './user.types';

export class AuthService extends BaseApiService {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (response.data) {
      this.setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(JSON.stringify(response) || 'Login failed');
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

    if (response.data) {
      this.setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }

    throw new Error(JSON.stringify(response) || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/auth/user');
    if (response.data) {
      return response.data;
    }
    throw new Error('Failed to get current user');
  }
}

