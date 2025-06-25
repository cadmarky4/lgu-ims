// User-specific types and interfaces

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  phone: string;
  role: string;
  department: string;
  position?: string;
  employee_id?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: number;
  updated_by?: number;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  username: string;
  role: string;
  department: string;
  position: string;
  employeeId: string;
  phone: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
  sendCredentials: boolean;
  notes: string;
}

export interface CreateUserData {
  first_name: string;
  last_name: string;
  middle_name?: string;
  email: string;
  username: string;
  phone: string;
  role: string;
  department: string;
  position?: string;
  employee_id?: string;
  password: string;
  confirm_password: string;
  is_active: boolean;
  notes?: string;
}

export interface UpdateUserData {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  email?: string;
  username?: string;
  phone?: string;
  role?: string;
  department?: string;
  position?: string;
  employee_id?: string;
  is_active?: boolean;
  notes?: string;
}

export interface UserParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  department?: string;
  is_active?: boolean;
  is_verified?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

