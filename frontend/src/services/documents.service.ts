// Documents Service - Connected to Backend API
import { BaseApiService } from './api';
import { type PaginatedResponse } from './types';
import {
  type DocumentRequest,
  type DocumentStats,
  type DocumentFilters,
  type CreateDocumentData,
  type UpdateDocumentData,
  type ApproveDocumentData,
  type RejectDocumentData,
  type DocumentTracking
} from './document.types';

export class DocumentsService extends BaseApiService {
  private baseUrl = '/documents';

  // Get paginated list of documents
  async getDocuments(params?: DocumentFilters & { search?: string }): Promise<PaginatedResponse<DocumentRequest>> {
    const queryParams = new URLSearchParams();
    
    if (params?.document_type) queryParams.append('document_type', params.document_type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.payment_status) queryParams.append('payment_status', params.payment_status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
    return await this.requestAll<DocumentRequest>(url);
  }
  // Create new document request
  async createDocument(data: CreateDocumentData): Promise<DocumentRequest> {
    const response = await this.request<DocumentRequest>(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  // Get single document by ID
  async getDocument(id: number): Promise<DocumentRequest> {
    const response = await this.request<DocumentRequest>(`${this.baseUrl}/${id}`);
    return response.data!;
  }

  // Update document
  async updateDocument(id: number, data: UpdateDocumentData): Promise<DocumentRequest> {
    const response = await this.request<DocumentRequest>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  // Delete document
  async deleteDocument(id: number): Promise<void> {
    await this.request(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }
  // Approve document
  async approveDocument(id: number, data: ApproveDocumentData): Promise<DocumentRequest> {
    const response = await this.request<DocumentRequest>(`${this.baseUrl}/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  // Reject document
  async rejectDocument(id: number, data: RejectDocumentData): Promise<DocumentRequest> {
    const response = await this.request<DocumentRequest>(`${this.baseUrl}/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }

  // Mark document as released
  async releaseDocument(id: number): Promise<DocumentRequest> {
    const response = await this.request<DocumentRequest>(`${this.baseUrl}/${id}/release`, {
      method: 'POST',
    });
    return response.data!;
  }

  // Get document statistics
  async getDocumentStats(): Promise<DocumentStats> {
    const response = await this.request<DocumentStats>(`${this.baseUrl}/stats`);
    return response.data!;
  }

  // Track document status
  async trackDocument(documentNumber: string): Promise<DocumentTracking> {
    const response = await this.request<DocumentTracking>(`${this.baseUrl}/track/${documentNumber}`);
    return response.data!;
  }

  // Get filter options for dropdowns
  async getFilterOptions(): Promise<{
    document_types: { value: string; label: string }[];
    statuses: { value: string; label: string }[];
    priorities: { value: string; label: string }[];
  }> {
    try {
      const response = await this.request<{
        document_types: { value: string; label: string }[];
        statuses: { value: string; label: string }[];
        priorities: { value: string; label: string }[];
      }>(`${this.baseUrl}/filter-options`);
      return response.data!;
    } catch (error) {
      // Fallback to hardcoded options if endpoint doesn't exist
      return {
        document_types: [
          { value: 'BARANGAY_CLEARANCE', label: 'Barangay Clearance' },
          { value: 'CERTIFICATE_OF_RESIDENCY', label: 'Certificate of Residency' },
          { value: 'CERTIFICATE_OF_INDIGENCY', label: 'Certificate of Indigency' },
          { value: 'BUSINESS_PERMIT', label: 'Business Permit' },
          { value: 'BUILDING_PERMIT', label: 'Building Permit' }
        ],
        statuses: [
          { value: 'PENDING', label: 'Pending' },
          { value: 'UNDER_REVIEW', label: 'Under Review' },
          { value: 'APPROVED', label: 'Approved' },
          { value: 'RELEASED', label: 'Released' },
          { value: 'REJECTED', label: 'Rejected' }
        ],
        priorities: [
          { value: 'LOW', label: 'Low' },
          { value: 'NORMAL', label: 'Normal' },
          { value: 'HIGH', label: 'High' },
          { value: 'URGENT', label: 'Urgent' }
        ]
      };
    }
  }
}

// Create singleton instance
const documentsService = new DocumentsService();
export default documentsService;
