// Mock Documents Service
// This service provides mock implementations for all document-related endpoints

import { BaseApiService } from './api';
import { type ApiResponse, type PaginatedResponse } from './types';
import {
  type DocumentRequest,
  type DocumentStats,
  type DocumentFilters,
  type CreateDocumentData,
  type UpdateDocumentData,
  type ApproveDocumentData,
  type RejectDocumentData,
  type DocumentTracking,
  type TrackingTimelineItem,
  type DocumentParams
} from './document.types';

export class DocumentsService extends BaseApiService {
  private mockDocuments: DocumentRequest[] = [
    {
      id: 1,
      document_type: 'BARANGAY_CLEARANCE',
      title: 'Barangay Clearance for Juan Dela Cruz',
      resident_id: 1,
      resident_name: 'Juan Dela Cruz',
      applicant_name: 'Juan Dela Cruz',
      applicant_address: 'Purok 1, Barangay San Miguel',
      applicant_contact: '+63 912 345 6789',
      purpose: 'Employment Application',
      status: 'PENDING',
      priority: 'NORMAL',
      request_date: '2024-01-15T10:30:00Z',
      requested_date: '2024-01-15T10:30:00Z',
      needed_date: '2024-01-25T00:00:00Z',
      processing_fee: 50,
      payment_status: 'UNPAID',
      certifying_official: 'Hon. Maria Santos - Kagawad',
      notes: 'For employment at ABC Company',
      document_number: 'BC-2024-0001',
      resident: {
        id: 1,
        first_name: 'Juan',
        last_name: 'Dela Cruz',
        complete_address: 'Purok 1, Barangay San Miguel',
        mobile_number: '+63 912 345 6789'
      }
    },
    {
      id: 2,
      document_type: 'CERTIFICATE_OF_INDIGENCY',
      title: 'Certificate of Indigency for Maria Santos',
      resident_id: 2,
      resident_name: 'Maria Santos',
      applicant_name: 'Maria Santos',
      applicant_address: 'Purok 2, Barangay San Miguel',
      applicant_contact: '+63 923 456 7890',
      purpose: 'Medical Assistance',
      status: 'UNDER_REVIEW',
      priority: 'HIGH',
      request_date: '2024-01-14T14:20:00Z',
      requested_date: '2024-01-14T14:20:00Z',
      needed_date: '2024-01-20T00:00:00Z',
      processing_fee: 0,
      payment_status: 'WAIVED',
      certifying_official: 'Hon. Juan Dela Cruz - Punong Barangay',
      notes: 'Income: Below poverty line, Household members: 5',
      document_number: 'CI-2024-0002',
      processed_by: 1,
      resident: {
        id: 2,
        first_name: 'Maria',
        last_name: 'Santos',
        complete_address: 'Purok 2, Barangay San Miguel',
        mobile_number: '+63 923 456 7890'
      },
      processedBy: {
        id: 1,
        name: 'Admin User'
      }
    },
    {
      id: 3,
      document_type: 'BUSINESS_PERMIT',
      title: 'Business Permit for Roberto Garcia',
      resident_id: 3,
      resident_name: 'Roberto Garcia',
      applicant_name: 'Roberto Garcia',
      applicant_address: 'Purok 3, Barangay San Miguel',
      applicant_contact: '+63 934 567 8901',
      purpose: 'Business Permit for Sari-sari Store',
      status: 'APPROVED',
      priority: 'NORMAL',
      request_date: '2024-01-12T09:15:00Z',
      requested_date: '2024-01-12T09:15:00Z',
      needed_date: '2024-01-22T00:00:00Z',
      approved_date: '2024-01-14T15:30:00Z',
      processing_fee: 100,
      payment_status: 'PAID',
      certifying_official: 'Hon. Roberto Garcia - Kagawad',
      notes: 'Business: Garcias Sari-sari Store, Type: Retail Store, Capital: ₱50,000',
      document_number: 'BP-2024-0003',
      processed_by: 1,
      approved_by: 1,
      expiry_date: '2025-01-14T00:00:00Z',
      resident: {
        id: 3,
        first_name: 'Roberto',
        last_name: 'Garcia',
        complete_address: 'Purok 3, Barangay San Miguel',
        mobile_number: '+63 934 567 8901'
      },
      processedBy: {
        id: 1,
        name: 'Admin User'
      },
      approvedBy: {
        id: 1,
        name: 'Admin User'
      }
    },
    {
      id: 4,
      document_type: 'CERTIFICATE_OF_RESIDENCY',
      title: 'Certificate of Residency for Ana Reyes',
      resident_id: 4,
      resident_name: 'Ana Reyes',
      applicant_name: 'Ana Reyes',
      applicant_address: 'Purok 4, Barangay San Miguel',
      applicant_contact: '+63 945 678 9012',
      purpose: 'School Enrollment',
      status: 'RELEASED',
      priority: 'NORMAL',
      request_date: '2024-01-10T16:45:00Z',
      requested_date: '2024-01-10T16:45:00Z',
      needed_date: '2024-01-20T00:00:00Z',
      approved_date: '2024-01-12T10:00:00Z',
      released_date: '2024-01-13T14:30:00Z',
      processing_fee: 30,
      payment_status: 'PAID',
      certifying_official: 'Carmen Rodriguez - Barangay Secretary',
      notes: 'Years of Residence: 15, Residency Status: Permanent Resident',
      document_number: 'CR-2024-0004',
      processed_by: 1,
      approved_by: 1,
      released_by: 1,
      expiry_date: '2025-01-12T00:00:00Z',
      resident: {
        id: 4,
        first_name: 'Ana',
        last_name: 'Reyes',
        complete_address: 'Purok 4, Barangay San Miguel',
        mobile_number: '+63 945 678 9012'
      },
      processedBy: {
        id: 1,
        name: 'Admin User'
      },
      approvedBy: {
        id: 1,
        name: 'Admin User'
      },
      releasedBy: {
        id: 1,
        name: 'Admin User'
      }
    },
    {
      id: 5,
      document_type: 'BARANGAY_CLEARANCE',
      title: 'Barangay Clearance for Carlos Mendoza',
      resident_id: 5,
      resident_name: 'Carlos Mendoza',
      applicant_name: 'Carlos Mendoza',
      applicant_address: 'Purok 1, Barangay San Miguel',
      applicant_contact: '+63 956 789 0123',
      purpose: 'Passport Application',
      status: 'REJECTED',
      priority: 'NORMAL',
      request_date: '2024-01-11T11:30:00Z',
      requested_date: '2024-01-11T11:30:00Z',
      needed_date: '2024-01-21T00:00:00Z',
      processed_date: '2024-01-12T16:00:00Z',
      processing_fee: 50,
      payment_status: 'UNPAID',
      certifying_official: 'Hon. Maria Santos - Kagawad',
      notes: 'Incomplete requirements - missing valid ID',
      remarks: 'Please submit valid government-issued ID',
      document_number: 'BC-2024-0005',
      processed_by: 1,
      resident: {
        id: 5,
        first_name: 'Carlos',
        last_name: 'Mendoza',
        complete_address: 'Purok 1, Barangay San Miguel',
        mobile_number: '+63 956 789 0123'
      },
      processedBy: {
        id: 1,
        name: 'Admin User'
      }
    }
  ];

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateDocumentNumber(type: string): string {
    const typeMap: { [key: string]: string } = {
      'BARANGAY_CLEARANCE': 'BC',
      'CERTIFICATE_OF_RESIDENCY': 'CR',
      'CERTIFICATE_OF_INDIGENCY': 'CI',
      'BUSINESS_PERMIT': 'BP',
      'BUILDING_PERMIT': 'BLD',
      'ELECTRICAL_PERMIT': 'EP',
      'SANITARY_PERMIT': 'SP',
      'FENCING_PERMIT': 'FP',
      'EXCAVATION_PERMIT': 'EXP',
      'CERTIFICATE_OF_GOOD_MORAL': 'CGM',
      'FIRST_TIME_JOB_SEEKER': 'FTJS',
      'SOLO_PARENT_CERTIFICATE': 'SPC',
      'SENIOR_CITIZEN_ID': 'SCID',
      'PWD_ID': 'PWDID',
      'CERTIFICATE_OF_COHABITATION': 'COC',
      'DEATH_CERTIFICATE': 'DC',
      'BIRTH_CERTIFICATE_COPY': 'BCC',
      'MARRIAGE_CONTRACT_COPY': 'MCC',
      'OTHER': 'OTH'
    };

    const prefix = typeMap[type] || 'DOC';
    const year = new Date().getFullYear();
    const id = this.mockDocuments.length + 1;
    return `${prefix}-${year}-${id.toString().padStart(4, '0')}`;
  }  /**
   * Get all documents with optional filters and pagination
   */
  async getDocuments(filters?: DocumentFilters): Promise<PaginatedResponse<DocumentRequest>> {
    await this.delay(300);

    let filteredDocuments = [...this.mockDocuments];

    // Apply filters
    if (filters?.document_type) {
      filteredDocuments = filteredDocuments.filter(doc => doc.document_type === filters.document_type);
    }

    if (filters?.status) {
      filteredDocuments = filteredDocuments.filter(doc => doc.status === filters.status);
    }

    if (filters?.priority) {
      filteredDocuments = filteredDocuments.filter(doc => doc.priority === filters.priority);
    }

    if (filters?.payment_status) {
      filteredDocuments = filteredDocuments.filter(doc => doc.payment_status === filters.payment_status);
    }

    if (filters?.date_from) {
      filteredDocuments = filteredDocuments.filter(doc => 
        new Date(doc.requested_date || doc.request_date || '') >= new Date(filters.date_from!)
      );
    }

    if (filters?.date_to) {
      filteredDocuments = filteredDocuments.filter(doc => 
        new Date(doc.requested_date || doc.request_date || '') <= new Date(filters.date_to!)
      );
    }    // Apply sorting
    const sortBy = filters?.sort_by || 'requested_date';
    const sortOrder = filters?.sort_order || 'desc';    filteredDocuments.sort((a, b) => {
      const aValue = String((a as unknown as Record<string, unknown>)[sortBy] || '');
      const bValue = String((b as unknown as Record<string, unknown>)[sortBy] || '');
      
      if (sortOrder === 'desc') {
        return bValue.localeCompare(aValue);
      }
      return aValue.localeCompare(bValue);
    });

    // Apply pagination
    const page = filters?.page || 1;
    const perPage = filters?.per_page || 15;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        data: paginatedDocuments,
        current_page: page,
        last_page: Math.ceil(filteredDocuments.length / perPage),
        per_page: perPage,
        total: filteredDocuments.length,
        from: startIndex + 1,
        to: Math.min(endIndex, filteredDocuments.length)
      },
      message: 'Documents retrieved successfully'
    };
  }
  /**
   * Create a new document request
   */
  async createDocument(data: CreateDocumentData): Promise<DocumentApiResponse<DocumentRequest>> {
    await this.delay(500);

    const newDocument: DocumentRequest = {
      id: this.mockDocuments.length + 1,
      document_type: data.document_type,
      title: data.title,
      description: data.description,
      resident_id: data.resident_id,
      applicant_name: data.applicant_name,
      applicant_address: data.applicant_address,
      applicant_contact: data.applicant_contact,
      purpose: data.purpose,
      status: 'PENDING',
      priority: data.priority || 'NORMAL',
      request_date: new Date().toISOString(),
      requested_date: new Date().toISOString(),
      needed_date: data.needed_date,
      processing_fee: data.processing_fee || 0,
      payment_status: 'UNPAID',
      requirements_submitted: data.requirements_submitted,
      remarks: data.remarks,
      document_number: this.generateDocumentNumber(data.document_type),
      created_by: 1,
      // Mock resident data - in real app this would be fetched based on resident_id
      resident: {
        id: data.resident_id,
        first_name: 'John',
        last_name: 'Doe',
        complete_address: 'Sample Address',
        mobile_number: '+63 900 000 0000'
      }
    };

    this.mockDocuments.push(newDocument);

    return {
      success: true,
      data: newDocument,
      message: 'Document request created successfully'
    };
  }

  /**
   * Get a specific document by ID
   */
  async getDocument(id: number): Promise<DocumentApiResponse<DocumentRequest>> {
    await this.delay(200);

    const document = this.mockDocuments.find(doc => doc.id === id);

    if (!document) {
      return {
        success: false,
        data: {} as DocumentRequest,
        message: 'Document not found'
      };
    }

    return {
      success: true,
      data: document,
      message: 'Document retrieved successfully'
    };
  }

  /**
   * Update a document
   */
  async updateDocument(id: number, data: UpdateDocumentData): Promise<DocumentApiResponse<DocumentRequest>> {
    await this.delay(400);

    const documentIndex = this.mockDocuments.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return {
        success: false,
        data: {} as DocumentRequest,
        message: 'Document not found'
      };
    }

    const updatedDocument = {
      ...this.mockDocuments[documentIndex],
      ...data,
      updated_by: 1
    };

    this.mockDocuments[documentIndex] = updatedDocument;

    return {
      success: true,
      data: updatedDocument,
      message: 'Document updated successfully'
    };
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: number): Promise<DocumentApiResponse<null>> {
    await this.delay(300);

    const documentIndex = this.mockDocuments.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return {
        success: false,
        data: null,
        message: 'Document not found'
      };
    }

    const document = this.mockDocuments[documentIndex];

    // Only allow deletion of pending documents
    if (!['PENDING', 'CANCELLED'].includes(document.status)) {
      return {
        success: false,
        data: null,
        message: 'Cannot delete document that is already being processed'
      };
    }

    this.mockDocuments.splice(documentIndex, 1);

    return {
      success: true,
      data: null,
      message: 'Document deleted successfully'
    };
  }

  /**
   * Get document statistics
   */
  async getDocumentStatistics(): Promise<DocumentStats> {
    await this.delay(250);

    const statusCounts = this.mockDocuments.reduce((acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const typeCounts = this.mockDocuments.reduce((acc, doc) => {
      acc[doc.document_type] = (acc[doc.document_type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const priorityCounts = this.mockDocuments.reduce((acc, doc) => {
      acc[doc.priority] = (acc[doc.priority] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const pendingRevenue = this.mockDocuments
      .filter(doc => doc.payment_status === 'UNPAID')
      .reduce((sum, doc) => sum + doc.processing_fee, 0);

    const totalRevenue = this.mockDocuments
      .reduce((sum, doc) => sum + doc.processing_fee, 0);

    const overdueCount = this.mockDocuments.filter(doc => 
      doc.needed_date && new Date(doc.needed_date) < new Date() && 
      !['RELEASED', 'REJECTED', 'CANCELLED'].includes(doc.status)
    ).length;

    return {
      total_documents: this.mockDocuments.length,
      pending: statusCounts['PENDING'] || 0,
      under_review: statusCounts['UNDER_REVIEW'] || 0,
      approved: statusCounts['APPROVED'] || 0,
      released: statusCounts['RELEASED'] || 0,
      rejected: statusCounts['REJECTED'] || 0,
      cancelled: statusCounts['CANCELLED'] || 0,
      total: this.mockDocuments.length,
      by_status: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
      by_type: Object.entries(typeCounts).map(([document_type, count]) => ({ document_type, count })),
      by_priority: Object.entries(priorityCounts).map(([priority, count]) => ({ priority, count })),
      pending_count: (statusCounts['PENDING'] || 0) + (statusCounts['UNDER_REVIEW'] || 0),
      overdue_count: overdueCount,
      revenue: {
        pending: pendingRevenue,
        total: totalRevenue
      },
      processing_times: {
        average_days: 3,
        fastest_days: 1,
        slowest_days: 7
      }
    };
  }
  /**
   * Search documents
   */
  async searchDocuments(query: string, perPage: number = 15): Promise<DocumentApiResponse<DocumentPaginatedResponse<DocumentRequest>>> {
    await this.delay(400);

    const searchResults = this.mockDocuments.filter(doc =>
      doc.document_number?.toLowerCase().includes(query.toLowerCase()) ||
      doc.applicant_name.toLowerCase().includes(query.toLowerCase()) ||
      doc.purpose.toLowerCase().includes(query.toLowerCase()) ||
      doc.title.toLowerCase().includes(query.toLowerCase())
    );

    return {
      success: true,
      data: {
        data: searchResults.slice(0, perPage),
        current_page: 1,
        last_page: Math.ceil(searchResults.length / perPage),
        per_page: perPage,
        total: searchResults.length,
        from: 1,
        to: Math.min(perPage, searchResults.length)
      },
      message: 'Document search completed successfully'
    };
  }

  /**
   * Get documents by type
   */
  async getDocumentsByType(type: string): Promise<DocumentApiResponse<DocumentPaginatedResponse<DocumentRequest>>> {
    await this.delay(300);

    const documentsOfType = this.mockDocuments.filter(doc => 
      doc.document_type === type.toUpperCase()
    );

    return {
      success: true,
      data: {
        data: documentsOfType,
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: documentsOfType.length,
        from: 1,
        to: documentsOfType.length
      },
      message: `Documents of type ${type} retrieved successfully`
    };
  }

  /**
   * Approve a document
   */
  async approveDocument(id: number, data?: ApproveDocumentData): Promise<DocumentApiResponse<DocumentRequest>> {
    await this.delay(500);

    const documentIndex = this.mockDocuments.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return {
        success: false,
        data: {} as DocumentRequest,
        message: 'Document not found'
      };
    }

    const document = this.mockDocuments[documentIndex];

    if (!['PENDING', 'UNDER_REVIEW'].includes(document.status)) {
      return {
        success: false,
        data: document,
        message: 'Document cannot be approved in its current status'
      };
    }

    const updatedDocument = {
      ...document,
      status: 'APPROVED' as const,
      approved_date: new Date().toISOString(),
      approved_by: 1,
      expiry_date: data?.expiry_date,
      remarks: data?.remarks || document.remarks,
      approvedBy: {
        id: 1,
        name: 'Admin User'
      }
    };

    this.mockDocuments[documentIndex] = updatedDocument;

    return {
      success: true,
      data: updatedDocument,
      message: 'Document approved successfully'
    };
  }

  /**
   * Reject a document
   */
  async rejectDocument(id: number, data: RejectDocumentData): Promise<DocumentApiResponse<DocumentRequest>> {
    await this.delay(400);

    const documentIndex = this.mockDocuments.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return {
        success: false,
        data: {} as DocumentRequest,
        message: 'Document not found'
      };
    }

    const document = this.mockDocuments[documentIndex];

    const updatedDocument = {
      ...document,
      status: 'REJECTED' as const,
      processed_date: new Date().toISOString(),
      processed_by: 1,
      remarks: data.reason,
      processedBy: {
        id: 1,
        name: 'Admin User'
      }
    };

    this.mockDocuments[documentIndex] = updatedDocument;

    return {
      success: true,
      data: updatedDocument,
      message: 'Document rejected successfully'
    };
  }

  /**
   * Release a document
   */
  async releaseDocument(id: number, data?: { notes?: string; certifying_official?: string }): Promise<DocumentApiResponse<DocumentRequest>> {
    await this.delay(400);

    const documentIndex = this.mockDocuments.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return {
        success: false,
        data: {} as DocumentRequest,
        message: 'Document not found'
      };
    }

    const document = this.mockDocuments[documentIndex];

    if (document.status !== 'APPROVED') {
      return {
        success: false,
        data: document,
        message: 'Document must be approved before it can be released'
      };
    }

    const updatedDocument = {
      ...document,
      status: 'RELEASED' as const,
      released_date: new Date().toISOString(),
      released_by: 1,
      notes: data?.notes || document.notes,
      certifying_official: data?.certifying_official || document.certifying_official,
      releasedBy: {
        id: 1,
        name: 'Admin User'
      }
    };

    this.mockDocuments[documentIndex] = updatedDocument;

    return {
      success: true,
      data: updatedDocument,
      message: 'Document released successfully'
    };
  }

  /**
   * Track a document
   */
  async trackDocument(id: number): Promise<DocumentApiResponse<DocumentTracking>> {
    await this.delay(300);

    const document = this.mockDocuments.find(doc => doc.id === id);

    if (!document) {
      return {
        success: false,
        data: {} as DocumentTracking,
        message: 'Document not found'
      };
    }

    const timeline: TrackingTimelineItem[] = [];

    // Request submitted
    if (document.requested_date || document.request_date) {
      timeline.push({
        date: document.requested_date || document.request_date || '',
        status: 'SUBMITTED',
        description: 'Document request submitted',
        user: document.createdBy?.name || 'System'
      });
    }

    // Under review
    if (document.status !== 'PENDING') {
      timeline.push({
        date: document.processed_date || new Date().toISOString(),
        status: 'UNDER_REVIEW',
        description: 'Document is under review',
        user: document.processedBy?.name || 'Staff'
      });
    }

    // Approved
    if (document.approved_date) {
      timeline.push({
        date: document.approved_date,
        status: 'APPROVED',
        description: 'Document has been approved',
        user: document.approvedBy?.name || 'Approver'
      });
    }

    // Released
    if (document.released_date) {
      timeline.push({
        date: document.released_date,
        status: 'RELEASED',
        description: 'Document has been released and ready for pickup/delivery',
        user: document.releasedBy?.name || 'Staff'
      });
    }

    // Rejected
    if (document.status === 'REJECTED') {
      timeline.push({
        date: document.processed_date || new Date().toISOString(),
        status: 'REJECTED',
        description: `Document rejected: ${document.remarks || 'No reason provided'}`,
        user: document.processedBy?.name || 'Staff'
      });
    }

    return {
      success: true,
      data: {
        document,
        timeline
      },
      message: 'Document tracking information retrieved successfully'
    };
  }

  /**
   * Generate QR code for a document
   */
  async generateQR(id: number): Promise<DocumentApiResponse<{ qr_code: string }>> {
    await this.delay(300);

    const documentIndex = this.mockDocuments.findIndex(doc => doc.id === id);

    if (documentIndex === -1) {
      return {
        success: false,
        data: { qr_code: '' },
        message: 'Document not found'
      };
    }

    const document = this.mockDocuments[documentIndex];

    // Generate a mock QR code (in real app this would be actual QR generation)
    const qrCode = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" dy="0.3em">QR-${document.document_number}</text></svg>`)}`;

    this.mockDocuments[documentIndex] = {
      ...document,
      qr_code: qrCode
    };

    return {
      success: true,
      data: { qr_code: qrCode },
      message: 'QR code generated successfully'
    };
  }
}

// Export a singleton instance
export const documentsService = new DocumentsService();
export default documentsService;
