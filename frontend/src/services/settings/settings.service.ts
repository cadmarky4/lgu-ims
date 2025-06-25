import { BaseApiService } from '../__shared/api';
import { type ApiResponse } from '../__shared/types';

export interface SettingsData {
  // General Information
  barangay: string;
  city: string;
  province: string;
  region: string;
  type: string;
  contactNumber: string;
  emailAddress: string;
  openingHours: string;
  closingHours: string;
  primaryLanguage: string;
  secondaryLanguage: string;
  
  // Privacy and Security
  sessionTimeout: string;
  maxLoginAttempts: string;
  dataRetention: string;
  backupFrequency: string;
  
  // System
  systemName: string;
  versionNumber: string;
}

export class SettingsService extends BaseApiService {
  /**
   * Get current settings
   */
  async getSettings(): Promise<ApiResponse<SettingsData>> {
    const response = await this.request<SettingsData>('/settings');
    return response;
  }

  /**
   * Update settings
   */
  async updateSettings(settings: Partial<SettingsData>): Promise<ApiResponse<SettingsData>> {
    const response = await this.request<SettingsData>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response;
  }

  /**
   * Reset settings to default values
   */
  async resetSettings(): Promise<ApiResponse<SettingsData>> {
    const response = await this.request<SettingsData>('/settings/reset', {
      method: 'POST',
    });
    return response;
  }
}
