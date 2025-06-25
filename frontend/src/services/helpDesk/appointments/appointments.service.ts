// services/api/appointments.service.ts
import { BaseApiService } from '@/services/__shared/api';
import { type PaginatedResponse } from '@/services/__shared/types';
import { 
  type Appointment, 
  type AppointmentParams, 
  type CreateAppointmentData, 
  type UpdateAppointmentData,
  type ConfirmAppointmentData,
  type CancelAppointmentData,
  type CompleteAppointmentData,
  type RescheduleAppointmentData,
  type FollowUpData,
  type AppointmentStatistics,
  type AvailableSlot,
  type AvailableSlotsParams,
  type AppointmentStatus
} from './appointments.types';

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
      throw new Error('Failed to delete appointment');
    }
  }

  async confirmAppointment(id: number, confirmData: ConfirmAppointmentData): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify(confirmData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to confirm appointment');
  }

  async cancelAppointment(id: number, cancelData: CancelAppointmentData): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify(cancelData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to cancel appointment');
  }

  async completeAppointment(id: number, completeData: CompleteAppointmentData): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/complete`, {
      method: 'POST',
      body: JSON.stringify(completeData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to complete appointment');
  }

  async rescheduleAppointment(id: number, rescheduleData: RescheduleAppointmentData): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify(rescheduleData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to reschedule appointment');
  }

  async addFollowUp(id: number, followUpData: FollowUpData): Promise<Appointment> {
    const response = await this.request<Appointment>(`/appointments/${id}/follow-up`, {
      method: 'POST',
      body: JSON.stringify(followUpData),
    });

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to add follow-up');
  }

  async getStatistics(): Promise<AppointmentStatistics> {
    const response = await this.request<AppointmentStatistics>('/appointments/statistics');
    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get appointment statistics');
  }

  async getAvailableSlots(params: AvailableSlotsParams): Promise<AvailableSlot[]> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await this.request<AvailableSlot[]>(
      `/appointments/available-slots?${searchParams.toString()}`
    );

    if (response.data) {
      return response.data;
    }
    throw new Error(JSON.stringify(response) || 'Failed to get available slots');
  }  // Additional utility methods
  async getUpcomingAppointments(limit: number = 5): Promise<Appointment[]> {
    const params: AppointmentParams = {
      per_page: limit,
      sort_by: 'appointment_date',
      sort_order: 'asc',
      status: 'CONFIRMED',
      date_from: new Date().toISOString().split('T')[0]
    };

    return await this.getAppointments(params);
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    const params: AppointmentParams = {
      date_from: today,
      date_to: today,
      sort_by: 'appointment_time',
      sort_order: 'asc'
    };

    return await this.getAppointments(params);
  }

  async getAppointmentsByDepartment(department: string): Promise<Appointment[]> {
    const params: AppointmentParams = {
      department,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getAppointments(params);
  }

  async getAppointmentsByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    const params: AppointmentParams = {
      status,
      sort_by: 'created_at',
      sort_order: 'desc'
    };

    return await this.getAppointments(params);
  }
}

