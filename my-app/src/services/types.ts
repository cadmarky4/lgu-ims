// Shared API response types
export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  first_page_url: string;
  from: number | null;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  prev_page_url: string | null;
  to: number | null;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
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

// Reference data interfaces
export interface Barangay {
  id: number;
  name: string;
  value: string;
}

