// Household-specific types and interfaces

export type HouseholdType = 
  | 'nuclear'
  | 'extended'
  | 'single'
  | 'single-parent'
  | 'other';

export type MonthlyIncomeRange = 
  | 'below-10000'
  | '10000-25000'
  | '25000-50000'
  | '50000-100000'
  | 'above-100000';

export type HouseType = 
  | 'concrete'
  | 'semi-concrete'
  | 'wood'
  | 'bamboo'
  | 'mixed';

export type OwnershipStatus = 
  | 'owned'
  | 'rented'
  | 'shared'
  | 'informal-settler';

// Backend Household interface (snake_case for API)
export interface Household {
  id: number;
  household_number: string;
  household_type: HouseholdType;
  head_resident_id?: number;
  house_number: string;
  street_sitio: string;
  barangay: string;
  complete_address: string;
  monthly_income?: MonthlyIncomeRange;
  primary_income_source?: string;
  four_ps_beneficiary: boolean;
  indigent_family: boolean;
  has_senior_citizen: boolean;
  has_pwd_member: boolean;
  house_type?: HouseType;
  ownership_status?: OwnershipStatus;
  has_electricity: boolean;
  has_water_supply: boolean;
  has_internet_access: boolean;
  remarks?: string;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  head_resident?: {
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    contact_number?: string;
  };
  members?: Array<{
    id: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    relationship: string;
  }>;
}

// Frontend form data interface (camelCase for forms)
export interface HouseholdFormData {
  householdId: string;
  householdType: HouseholdType | '';
  barangay: string;
  streetSitio: string;
  houseNumber: string;
  completeAddress: string;
  householdHeadSearch: string;
  memberSearch: string;
  monthlyIncome: MonthlyIncomeRange | '';
  primaryIncomeSource: string;
  householdClassification: {
    fourPsBeneficiary: boolean;
    indigentFamily: boolean;
    hasSeniorCitizen: boolean;
    hasPwdMember: boolean;
  };
  houseType: HouseType | '';
  ownershipStatus: OwnershipStatus | '';
  utilitiesAccess: {
    electricity: boolean;
    waterSupply: boolean;
    internetAccess: boolean;
  };
  remarks: string;
  headResidentId?: number;
  members?: Array<{
    residentId: number;
    relationship: string;
  }>;
}

// Household creation request (what we send to API)
export interface CreateHouseholdRequest {
  household_number?: string;
  household_type: HouseholdType;
  head_resident_id?: number;
  house_number: string;
  street_sitio: string;
  barangay: string;
  complete_address: string;
  monthly_income?: MonthlyIncomeRange;
  primary_income_source?: string;
  four_ps_beneficiary: boolean;
  indigent_family: boolean;
  has_senior_citizen: boolean;
  has_pwd_member: boolean;
  house_type?: HouseType;
  ownership_status?: OwnershipStatus;
  has_electricity: boolean;
  has_water_supply: boolean;
  has_internet_access: boolean;
  remarks?: string;
  member_ids?: Array<{
    resident_id: number;
    relationship: string;
  }>;
}

// Household statistics interface
export interface HouseholdStatistics {
  total_households: number;
  by_barangay: Array<{ barangay: string; count: number }>;
  by_household_type: Array<{ household_type: string; count: number }>;
  by_house_type: Array<{ house_type: string; count: number }>;
  by_ownership_status: Array<{ ownership_status: string; count: number }>;
  by_monthly_income: Array<{ monthly_income: string; count: number }>;
  classifications: {
    four_ps_beneficiaries: number;
    indigent_families: number;
    with_senior_citizens: number;
    with_pwd_members: number;
  };
  utilities: {
    with_electricity: number;
    with_water_supply: number;
    with_internet_access: number;
  };
}

