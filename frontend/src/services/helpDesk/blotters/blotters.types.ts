// Blotter-specific types and interfaces

export type BlotterStatus = 
  | 'FILED'
  | 'UNDER_INVESTIGATION'
  | 'MEDIATION_SCHEDULED'
  | 'MEDIATION'
  | 'HEARING_SCHEDULED'
  | 'SETTLED'
  | 'DISMISSED'
  | 'REFERRED_TO_COURT'
  | 'ESCALATED'
  | 'PENDING_COMPLIANCE'
  | 'CLOSED';

export type BlotterPriority =
  | 'LOW'
  | 'NORMAL'
  | 'HIGH'
  | 'URGENT';

export type IncidentType = 
  | 'Theft'
  | 'Physical Assault'
  | 'Verbal Assault'
  | 'Property Damage'
  | 'Disturbance'
  | 'Trespassing'
  | 'Fraud'
  | 'Harassment'
  | 'Domestic Dispute'
  | 'Noise Complaint'
  | 'Other';

export type ResolutionType = 
  | 'AMICABLE_SETTLEMENT'
  | 'MEDIATION'
  | 'ARBITRATION'
  | 'COURT_REFERRAL'
  | 'DISMISSAL';

export type MediationOutcome = 
  | 'SETTLED'
  | 'FAILED'
  | 'PARTIAL_SETTLEMENT';

export type ComplianceStatus = 
  | 'COMPLIANT'
  | 'NON_COMPLIANT'
  | 'PARTIAL_COMPLIANCE'
  | 'PENDING';

export type ClosureReason = 
  | 'SETTLED'
  | 'DISMISSED'
  | 'WITHDRAWN'
  | 'RESOLVED';

export interface BlotterCase {
  id: number;
  case_number: string;
  
  // Complainant Information (from frontend)
  complainant_name: string;
  complainant_address: string;
  complainant_contact: string;
  complainant_email?: string;
  complainant_resident_id?: number;
  
  // Incident Details (from frontend)
  incident_type: IncidentType;
  incident_date: string;
  incident_time: string;
  incident_location: string;
  incident_description: string;
  
  // Respondent Information (from frontend)
  respondent_name?: string;
  respondent_address?: string;
  respondent_contact?: string;
  respondent_resident_id?: number;
  
  // Additional Information (from frontend)
  witnesses?: string;
  evidence?: string;
  
  // System Processing Fields
  status: BlotterStatus;
  priority: BlotterPriority;
  date_filed: string;
  
  // Personnel Assignment
  investigating_officer?: number;
  investigator_details?: {
    id: number;
    name: string;
    position: string;
  };
  mediator_assigned?: number;
  mediator_details?: {
    id: number;
    name: string;
    position: string;
  };
  lupon_members?: any[];
  
  // Investigation
  investigation_start_date?: string;
  investigation_notes?: string;
  investigation_report?: string;
  
  // Hearing Information
  hearing_date?: string;
  hearing_time?: string;
  hearing_location?: string;
  
  // Mediation
  mediation_date?: string;
  mediation_time?: string;
  mediation_venue?: string;
  mediation_notes?: string;
  mediation_outcome?: MediationOutcome;
  mediation_completed_at?: string;
  mediation_summary?: string;
  
  // Resolution
  settlement_agreement?: string;
  settlement_date?: string;
  settlement_terms?: string;
  resolution_type?: ResolutionType;
  next_action?: string;
  
  // Compliance & Monitoring
  requires_monitoring: boolean;
  next_followup_date?: string;
  followup_notes?: string;
  compliance_status?: ComplianceStatus;
  compliance_notes?: string;
  monitoring_date?: string;
  
  // Case Closure
  closure_reason?: ClosureReason;
  closure_notes?: string;
  closed_by?: number;
  
  // Documents & Reports
  attachments?: any[];
  court_documents?: any[];
  
  // Additional Information
  is_confidential: boolean;
  tags?: string[];
  remarks?: string;
  legal_basis?: string;
  penalties_imposed?: string;
  
  // System Fields
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

export interface BlotterParams {
  page?: number;
  per_page?: number;
  search?: string;
  incident_type?: IncidentType;
  status?: BlotterStatus;
  priority?: BlotterPriority;
  date_from?: string;
  date_to?: string;
  investigating_officer?: number;
  mediator_assigned?: number;
  requires_monitoring?: boolean;
  is_confidential?: boolean;
  compliance_status?: ComplianceStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateBlotterData {
  // Required fields from frontend form
  complainant_name: string;
  complainant_address: string;
  complainant_contact: string;
  incident_type: IncidentType;
  incident_date: string;
  incident_time: string;
  incident_location: string;
  incident_description: string;
  
  // Optional fields from frontend form
  complainant_email?: string;
  respondent_name?: string;
  respondent_address?: string;
  respondent_contact?: string;
  witnesses?: string;
  evidence?: string;
  
  // Optional system fields
  complainant_resident_id?: number;
  respondent_resident_id?: number;
  priority?: BlotterPriority;
  is_confidential?: boolean;
  tags?: string[];
}

export interface UpdateBlotterData {
  complainant_name?: string;
  complainant_address?: string;
  complainant_contact?: string;
  complainant_email?: string;
  incident_type?: IncidentType;
  incident_date?: string;
  incident_time?: string;
  incident_location?: string;
  incident_description?: string;
  respondent_name?: string;
  respondent_address?: string;
  respondent_contact?: string;
  witnesses?: string;
  evidence?: string;
  
  // System fields that can be updated
  status?: BlotterStatus;
  priority?: BlotterPriority;
  investigation_notes?: string;
  hearing_date?: string;
  hearing_time?: string;
  hearing_location?: string;
  settlement_agreement?: string;
  requires_monitoring?: boolean;
  next_followup_date?: string;
  followup_notes?: string;
  is_confidential?: boolean;
  tags?: string[];
  remarks?: string;
}

export interface AssignInvestigatorData {
  investigator_id: number;
  investigation_notes?: string;
}

export interface ScheduleMediationData {
  mediator_id: number;
  mediation_date: string;
  mediation_time: string;
  mediation_venue: string;
  mediation_notes?: string;
}

export interface CompleteMediationData {
  mediation_outcome: MediationOutcome;
  settlement_terms?: string;
  mediation_summary: string;
  next_action?: string;
}

export interface UpdateComplianceData {
  compliance_status: ComplianceStatus;
  compliance_notes?: string;
  monitoring_date: string;
}

export interface CloseCaseData {
  closure_reason: ClosureReason;
  closure_notes: string;
}

export interface BlotterStatistics {
  total_cases: number;
  filed_cases: number;
  under_investigation: number;
  mediation_scheduled: number;
  settled_cases: number;
  closed_cases: number;
  escalated_cases: number;
  by_incident_type: Record<IncidentType, number>;
  by_status: Record<BlotterStatus, number>;
  by_priority: Record<BlotterPriority, number>;
  cases_by_month: Array<{
    month: string;
    count: number;
  }>;
  average_resolution_days: number;
  resolution_rate: number; // percentage
  mediation_success_rate: number; // percentage
  compliance_rate: number; // percentage
  confidential_cases: number;
  cases_requiring_monitoring: number;
}
