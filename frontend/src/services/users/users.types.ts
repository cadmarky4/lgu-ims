// ============================================================================
// types/users.ts - Zod schemas and type definitions for users
// ============================================================================

import { z } from 'zod';

// Enum schemas
export const UserRoleSchema = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'BARANGAY_CAPTAIN',
  'BARANGAY_SECRETARY',
  'BARANGAY_TREASURER',
  'BARANGAY_COUNCILOR',
  'BARANGAY_CLERK',
  'HEALTH_WORKER',
  'SOCIAL_WORKER',
  'SECURITY_OFFICER',
  'DATA_ENCODER',
  'VIEWER'
]);

export const DepartmentSchema = z.enum([
  'ADMINISTRATION',
  'HEALTH_SERVICES',
  'SOCIAL_SERVICES',
  'SECURITY_PUBLIC_SAFETY',
  'FINANCE_TREASURY',
  'RECORDS_MANAGEMENT',
  'COMMUNITY_DEVELOPMENT',
  'DISASTER_RISK_REDUCTION',
  'ENVIRONMENTAL_MANAGEMENT',
  'YOUTH_SPORTS_DEVELOPMENT',
  'SENIOR_CITIZEN_AFFAIRS',
  'WOMENS_AFFAIRS',
  'BUSINESS_PERMITS',
  'INFRASTRUCTURE_DEVELOPMENT'
]);

export const UserStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PENDING_VERIFICATION'
]);

export const SortOrderSchema = z.enum(['asc', 'desc']);

// Base user form data schema
export const UserFormDataSchema = z.object({
  // Personal Information
  first_name: z.string().min(1, 'users.form.error.firstNameRequired'),
  last_name: z.string().min(1, 'users.form.error.lastNameRequired'),
  middle_name: z.string().optional(),
  
  // Contact Information
  email: z.string()
    .min(1, 'users.form.error.emailRequired')
    .email('users.form.error.emailInvalid'),
  phone: z.string()
    .min(1, 'users.form.error.phoneRequired')
    .regex(/^(\+639|09)\d{9}$/, 'users.form.error.phoneInvalid'),
  
  // Account Information
  username: z.string()
    .min(3, 'users.form.error.usernameMinLength')
    .max(50, 'users.form.error.usernameMaxLength')
    .regex(/^[a-zA-Z0-9_]+$/, 'users.form.error.usernameInvalid'),
  
  // Role and Department
  role: UserRoleSchema,
  department: DepartmentSchema,
  position: z.string().optional(),
  employee_id: z.string().optional(),
  
  // Status and Settings
  is_active: z.boolean().default(true),
  
  // Additional Information
  notes: z.string().optional(),
});

// Create user schema (includes password fields)
export const CreateUserFormDataSchema = UserFormDataSchema.extend({
  password: z.string()
    .min(8, 'users.form.error.passwordMinLength')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'users.form.error.passwordComplexity'),
  confirm_password: z.string(),
  send_credentials: z.boolean().default(false),
}).refine(
  (data) => data.password === data.confirm_password,
  {
    message: 'users.form.error.passwordMismatch',
    path: ['confirm_password'],
  }
);

// Update user schema (password fields optional)
export const UpdateUserFormDataSchema = UserFormDataSchema.extend({
  password: z.string()
    .min(8, 'users.form.error.passwordMinLength')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'users.form.error.passwordComplexity')
    .optional(),
  confirm_password: z.string().optional(),
}).refine(
  (data) => {
    if (data.password || data.confirm_password) {
      return data.password === data.confirm_password;
    }
    return true;
  },
  {
    message: 'users.form.error.passwordMismatch',
    path: ['confirm_password'],
  }
);

// Main User schema (database entity)
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string(),
  last_name: z.string(),
  middle_name: z.string().nullable().optional(),
  phone: z.string(),
  role: UserRoleSchema,
  department: DepartmentSchema,
  position: z.string().nullable().optional(),
  employee_id: z.string().nullable().optional(),
  is_active: z.boolean(),
  is_verified: z.boolean(),
  last_login_at: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.number().nullable().optional(),
  updated_by: z.number().nullable().optional(),
});

// Query parameters schema
export const UserParamsSchema = z.object({
  page: z.number().min(1).optional(),
  per_page: z.number().min(1).max(100).optional(),
  search: z.string().optional(),
  role: UserRoleSchema.optional(),
  department: DepartmentSchema.optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  sort_by: z.enum([
    'first_name',
    'last_name',
    'email',
    'username',
    'role',
    'department',
    'created_at',
    'last_login_at'
  ]).optional(),
  sort_order: SortOrderSchema.optional(),
});

// User statistics schema
export const UserStatisticsSchema = z.object({
  total_users: z.number(),
  active_users: z.number(),
  inactive_users: z.number(),
  pending_verification: z.number(),
  by_role: z.record(z.number()),
  by_department: z.record(z.number()),
  recent_logins: z.number(),
  never_logged_in: z.number(),
});

// Change password schema
export const ChangePasswordSchema = z.object({
  current_password: z.string().min(1, 'users.form.error.currentPasswordRequired'),
  new_password: z.string()
    .min(8, 'users.form.error.passwordMinLength')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'users.form.error.passwordComplexity'),
  confirm_new_password: z.string(),
}).refine(
  (data) => data.new_password === data.confirm_new_password,
  {
    message: 'users.form.error.passwordMismatch',
    path: ['confirm_new_password'],
  }
);

// User permissions schema
export const UserPermissionsSchema = z.object({
  residents: z.object({
    view: z.boolean(),
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
    export: z.boolean(),
  }),
  users: z.object({
    view: z.boolean(),
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
    manage_roles: z.boolean(),
  }),
  reports: z.object({
    view: z.boolean(),
    generate: z.boolean(),
    export: z.boolean(),
  }),
  settings: z.object({
    view: z.boolean(),
    edit: z.boolean(),
    system_config: z.boolean(),
  }),
});

// Type exports
export type UserRole = z.infer<typeof UserRoleSchema>;
export type Department = z.infer<typeof DepartmentSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserFormData = z.infer<typeof UserFormDataSchema>;
export type CreateUserFormData = z.infer<typeof CreateUserFormDataSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserFormDataSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;
export type UserStatistics = z.infer<typeof UserStatisticsSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
export type UserPermissions = z.infer<typeof UserPermissionsSchema>;

// Transform functions
export const transformUserToFormData = (user: User | null): UserFormData => {
  if (!user) {
    return {
      first_name: '',
      last_name: '',
      middle_name: '',
      email: '',
      phone: '',
      username: '',
      role: 'VIEWER',
      department: 'ADMINISTRATION',
      position: '',
      employee_id: '',
      is_active: true,
      notes: '',
    };
  }

  return {
    first_name: user.first_name,
    last_name: user.last_name,
    middle_name: user.middle_name || '',
    email: user.email,
    phone: user.phone,
    username: user.username,
    role: user.role,
    department: user.department,
    position: user.position || '',
    employee_id: user.employee_id || '',
    is_active: user.is_active,
    notes: user.notes || '',
  };
};

export const transformUserToUpdateData = (formData: UserFormData): Partial<User> => {
  return {
    first_name: formData.first_name,
    last_name: formData.last_name,
    middle_name: formData.middle_name || null,
    email: formData.email,
    phone: formData.phone,
    username: formData.username,
    role: formData.role,
    department: formData.department,
    position: formData.position || null,
    employee_id: formData.employee_id || null,
    is_active: formData.is_active,
    notes: formData.notes || null,
  };
};

// Helper functions
export const getUserDisplayName = (user: User): string => {
  const parts = [user.first_name, user.middle_name, user.last_name].filter(Boolean);
  return parts.join(' ');
};

export const getUserInitials = (user: User): string => {
  const firstInitial = user.first_name.charAt(0).toUpperCase();
  const lastInitial = user.last_name.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

export const isUserActive = (user: User): boolean => {
  return user.is_active && user.is_verified;
};

export const hasUserLoggedIn = (user: User): boolean => {
  return !!user.last_login_at;
};

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'SUPER_ADMIN': 10,
  'ADMIN': 9,
  'BARANGAY_CAPTAIN': 8,
  'BARANGAY_SECRETARY': 7,
  'BARANGAY_TREASURER': 6,
  'BARANGAY_COUNCILOR': 5,
  'BARANGAY_CLERK': 4,
  'HEALTH_WORKER': 3,
  'SOCIAL_WORKER': 3,
  'SECURITY_OFFICER': 3,
  'DATA_ENCODER': 2,
  'VIEWER': 1,
};

export const canUserEditUser = (currentUser: User, targetUser: User): boolean => {
  const currentUserLevel = ROLE_HIERARCHY[currentUser.role];
  const targetUserLevel = ROLE_HIERARCHY[targetUser.role];
  
  // Super admin can edit anyone
  if (currentUser.role === 'SUPER_ADMIN') return true;
  
  // Users can edit themselves (basic info only)
  if (currentUser.id === targetUser.id) return true;
  
  // Higher level users can edit lower level users
  return currentUserLevel > targetUserLevel;
};

export const canUserDeleteUser = (currentUser: User, targetUser: User): boolean => {
  // Only super admin and admin can delete users
  if (!['SUPER_ADMIN', 'ADMIN'].includes(currentUser.role)) return false;
  
  // Cannot delete yourself
  if (currentUser.id === targetUser.id) return false;
  
  // Super admin can delete anyone except other super admins
  if (currentUser.role === 'SUPER_ADMIN') {
    return targetUser.role !== 'SUPER_ADMIN';
  }
  
  // Admin can only delete users below admin level
  const targetUserLevel = ROLE_HIERARCHY[targetUser.role];
  return targetUserLevel < ROLE_HIERARCHY['ADMIN'];
};