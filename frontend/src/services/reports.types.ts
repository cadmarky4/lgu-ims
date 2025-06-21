// Reports-specific types and interfaces

export interface StatisticsOverview {
  totalResidents: number;
  totalHouseholds: number;
  activeBarangayOfficials: number;
  totalBlotterCases: number;
  totalIssuedClearance: number;
  ongoingProjects: number;
}

export interface AgeGroupDistribution {
  name: string;
  percentage: number;
}

export interface SpecialPopulationRegistry {
  name: string;
  percentage: number;
}

export interface MonthlyRevenue {
  timeLabel: string;
  value: number;
}

export interface PopulationDistributionByPurok {
  label: string;
  value: number;
}

export interface DocumentTypesIssued {
  label: string;
  value: number;
}

export interface MostRequestedService {
  service: string;
  requested: number;
  completed: number;
  avgProcessingTimeInDays: number;
  feesCollected: number;
}

export interface FilterOptions {
  years: number[];
  quarters: string[];
  puroks: string[];
}

export interface ReportsFilters {
  year?: string | number;
  quarter?: string;
  purok?: string;
}
