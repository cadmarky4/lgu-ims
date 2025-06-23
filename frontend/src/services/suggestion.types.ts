// Suggestion-specific types and interfaces

export type SuggestionPriority = 'low' | 'medium' | 'high';

export type SuggestionStatus = 
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'IMPLEMENTATION_PLANNED'
  | 'IN_PROGRESS'
  | 'IMPLEMENTED'
  | 'DEFERRED';

export type ImplementationStatus = 
  | 'NOT_STARTED'
  | 'PLANNING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED';

export type VoteType = 'up' | 'down';

export interface Suggestion {
  id: number;
  suggestion_number: string;
  
  // Personal Information (from frontend form)
  name: string;
  email?: string;
  phone?: string;
  is_resident: boolean;
  
  // Suggestion Details
  category: string;
  title: string;
  description: string;
  benefits?: string;
  implementation?: string;
  resources?: string;
  
  // Additional
  priority: SuggestionPriority;
  allow_contact: boolean;
  
  // System Processing Fields
  status: SuggestionStatus;
  implementation_status: ImplementationStatus;
  date_submitted: string;
  date_reviewed?: string;
  date_implemented?: string;
  
  // Review & Approval
  reviewed_by?: number;
  reviewer?: {
    id: number;
    name: string;
    position: string;
  };
  review_notes?: string;
  review_score?: number;
  
  // Implementation Details
  implementation_plan?: string;
  implementation_timeline?: string;
  implementation_budget?: number;
  implementation_department?: string;
  implementation_lead?: number;
  implementation_lead_details?: {
    id: number;
    name: string;
    position: string;
  };
  
  // Progress Tracking
  progress_percentage?: number;
  progress_notes?: string;
  milestones?: any[];
  challenges?: string;
  next_steps?: string;
  
  // Community Engagement
  votes_count: number;
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  views_count: number;
  
  // Impact Assessment
  estimated_impact?: string;
  actual_impact?: string;
  beneficiaries_count?: number;
  cost_saved?: number;
  revenue_generated?: number;
  
  // Related Information
  related_suggestions?: number[];
  attachments?: any[];
  tags?: string[];
  
  // System Fields
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
}

export interface SuggestionParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: string;
  status?: SuggestionStatus;
  priority?: SuggestionPriority;
  implementation_status?: ImplementationStatus;
  date_from?: string;
  date_to?: string;
  reviewed_by?: number;
  implementation_lead?: number;
  is_resident?: boolean;
  min_votes?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface CreateSuggestionData {
  // Required fields from frontend form
  name: string;
  category: string;
  title: string;
  description: string;
  
  // Optional fields from frontend form
  email?: string;
  phone?: string;
  is_resident?: boolean;
  benefits?: string;
  implementation?: string;
  resources?: string;
  priority?: SuggestionPriority;
  allow_contact?: boolean;
  
  // Optional system fields
  resident_id?: number;
  tags?: string[];
}

export interface UpdateSuggestionData {
  name?: string;
  email?: string;
  phone?: string;
  is_resident?: boolean;
  category?: string;
  title?: string;
  description?: string;
  benefits?: string;
  implementation?: string;
  resources?: string;
  priority?: SuggestionPriority;
  allow_contact?: boolean;
  
  // System fields that can be updated
  status?: SuggestionStatus;
  implementation_status?: ImplementationStatus;
  review_notes?: string;
  review_score?: number;
  implementation_plan?: string;
  implementation_timeline?: string;
  implementation_budget?: number;
  implementation_department?: string;
  implementation_lead?: number;
  progress_percentage?: number;
  progress_notes?: string;
  challenges?: string;
  next_steps?: string;
  estimated_impact?: string;
  tags?: string[];
}

export interface ReviewSuggestionData {
  status: 'APPROVED' | 'REJECTED' | 'DEFERRED';
  review_notes?: string;
  review_score?: number; // 1-10 scale
  implementation_priority?: SuggestionPriority;
  estimated_budget?: number;
  estimated_timeline?: string;
  recommended_department?: string;
  recommended_lead?: number;
}

export interface VoteSuggestionData {
  vote_type: VoteType;
  comment?: string;
}

export interface UpdateImplementationData {
  implementation_status: ImplementationStatus;
  implementation_plan?: string;
  implementation_timeline?: string;
  implementation_budget?: number;
  implementation_department?: string;
  implementation_lead?: number;
  progress_percentage?: number;
  progress_notes?: string;
  milestones?: any[];
  challenges?: string;
  next_steps?: string;
  actual_impact?: string;
  beneficiaries_count?: number;
  cost_saved?: number;
  revenue_generated?: number;
}

export interface SuggestionVote {
  id: number;
  suggestion_id: number;
  user_id: number;
  vote_type: VoteType;
  comment?: string;
  created_at: string;
}

export interface SuggestionComment {
  id: number;
  suggestion_id: number;
  user_id: number;
  comment: string;
  parent_id?: number;
  likes_count: number;
  created_at: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface SuggestionStatistics {
  total_suggestions: number;
  submitted_suggestions: number;
  under_review_suggestions: number;
  approved_suggestions: number;
  rejected_suggestions: number;
  implemented_suggestions: number;
  deferred_suggestions: number;
  in_progress_suggestions: number;
  by_category: Record<string, number>;
  by_priority: Record<SuggestionPriority, number>;
  by_status: Record<SuggestionStatus, number>;
  by_implementation_status: Record<ImplementationStatus, number>;
  suggestions_by_month: Array<{
    month: string;
    count: number;
  }>;
  average_review_time: number; // in days
  average_implementation_time: number; // in days
  implementation_rate: number; // percentage
  approval_rate: number; // percentage
  total_votes: number;
  total_comments: number;
  top_categories: Array<{
    category: string;
    count: number;
    implementation_rate: number;
  }>;
  impact_metrics: {
    total_beneficiaries: number;
    total_cost_saved: number;
    total_revenue_generated: number;
    average_impact_score: number;
  };
}
