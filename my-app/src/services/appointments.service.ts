// services/api/appointments.service.ts
import { BaseApiService } from './api';
import { type PaginatedResponse } from './types';
import { 
  type Appointment, 
  type AppointmentParams, 
  type CreateAppointmentData, 
  type UpdateAppointmentData,
  type AppointmentStatistics 
} from './types';

export class AppointmentsService extends BaseApiService {
  async getAppointments(params: AppointmentParams = {}): Promise<PaginatedResponse<Appointment>['data']> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.requestAll<Appointment>(
      `/appointments?${searchParams.toString()}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get appointments');
  }

  async getAppointment(id: number): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}`);
    
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get appointment');
  }

  async createAppointment(appointmentData: CreateAppointmentData): Promise<Appointment> {
    const response = await this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to create appointment');
  }

  async updateAppointment(id: number, appointmentData: UpdateAppointmentData): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to update appointment');
  }

  async deleteAppointment(id: number): Promise<void> {
    const response = await this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });

    if (!response) {
      throw new Error(JSON.stringify(response) || 'Failed to delete appointment');
    }
  }

  async cancelAppointment(id: number, reason?: string): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to cancel appointment');
  }

  async confirmAppointment(id: number): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/confirm`, {
      method: 'POST',
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to confirm appointment');
  }

  async completeAppointment(id: number, notes?: string): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to complete appointment');
  }

  async rescheduleAppointment(
    id: number, 
    newDate: string, 
    newTime: string, 
    reason?: string
  ): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({
        appointment_date: newDate,
        appointment_time: newTime,
        reschedule_reason: reason,
      }),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to reschedule appointment');
  }

  async getStatistics(): Promise<AppointmentStatistics> {
    const response = await this.request<AppointmentStatistics>('/appointments/statistics');
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get appointment statistics');
  }

  async getAvailableSlots(date: string, appointmentType?: string): Promise<string[]> {
    const params = new URLSearchParams({ date });
    if (appointmentType) {
      params.append('appointment_type', appointmentType);
    }

    const response = await this.request<string[]>(
      `/appointments/available-slots?${params.toString()}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get available slots');
  }

  async getUpcomingAppointments(limit: number = 5): Promise<Appointment[]> {
    const response = await this.request<Appointment[]>(
      `/appointments/upcoming?limit=${limit}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get upcoming appointments');
  }
}