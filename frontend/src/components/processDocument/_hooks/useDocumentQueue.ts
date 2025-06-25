// ============================================================================
// processDocument/_hooks/useDocumentQueue.ts - Custom hook for document queue management
// ============================================================================

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@/components/_global/NotificationSystem';

import { 
  useDocuments, 
  useDocumentStatistics,
  useProcessDocument,
  useRejectDocument,
  useReleaseDocument,
  useCancelDocument,
  documentsKeys
} from '@/services/documents/useDocuments';
import type { DocumentStatus, DocumentPriority, Document, DocumentType } from '@/services/documents/documents.types';

export interface QueueFilters {
  status: DocumentStatus | 'ALL';
  priority?: DocumentPriority;
  documentType?: DocumentType;
  searchTerm: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface QueueActions {
  processDocument: (id: string, data: { status: DocumentStatus; notes?: string }) => Promise<void>;
  rejectDocument: (id: string, reason: string) => Promise<void>;
  releaseDocument: (id: string, notes?: string) => Promise<void>;
  cancelDocument: (id: string, reason: string) => Promise<void>;
}

export function useDocumentQueue() {
  const queryClient = useQueryClient();
  const { showNotification } = useNotifications();
  
  // State
  const [filters, setFilters] = useState<QueueFilters>({
    status: 'PENDING',
    searchTerm: '',
  });

  // Queries
  const { 
    data: documentsData, 
    isLoading: documentsLoading, 
    error: documentsError,
    refetch: refetchDocuments 
  } = useDocuments({
    status: filters.status !== 'ALL' ? filters.status : undefined,
    priority: filters.priority,
    document_type: filters.documentType,
    per_page: 50,
    sort_by: 'date_added',
    sort_order: 'desc',
  });

  const { 
    data: statistics, 
    isLoading: statisticsLoading 
  } = useDocumentStatistics();

  // Mutations
  const processDocumentMutation = useProcessDocument();
  const rejectDocumentMutation = useRejectDocument();
  const releaseDocumentMutation = useReleaseDocument();
  const cancelDocumentMutation = useCancelDocument();

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    if (!documentsData?.data) return [];
    
    return documentsData.data.filter((doc: Document) => {
      const searchMatch = filters.searchTerm === '' || 
        doc.applicant_name?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.purpose?.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const dateMatch = (!filters.dateFrom || new Date(doc.date_added) >= new Date(filters.dateFrom)) &&
        (!filters.dateTo || new Date(doc.date_added) <= new Date(filters.dateTo));

      return searchMatch && dateMatch;
    });
  }, [documentsData?.data, filters]);

  // Status counts from statistics
  const statusCounts = useMemo(() => {
    if (!statistics) {
      return {
        PENDING: 0,
        UNDER_REVIEW: 0,
        APPROVED: 0,
        RELEASED: 0,
        REJECTED: 0,
        CANCELLED: 0,
      };
    }
    return {
      PENDING: statistics.pending_documents,
      UNDER_REVIEW: statistics.under_review_documents,
      APPROVED: statistics.approved_documents,
      RELEASED: statistics.released_documents,
      REJECTED: statistics.rejected_documents,
      CANCELLED: statistics.cancelled_documents,
    };
  }, [statistics]);

  // Actions
  const actions: QueueActions = {
    processDocument: async (id: string, data: { status: DocumentStatus; notes?: string }) => {
      try {
        await processDocumentMutation.mutateAsync({ 
          id, 
          data: { 
            status: data.status,
            notes: data.notes 
          } 
        });
        
        showNotification({
          type: 'success',
          title: 'Document Processed',
          message: `Document status updated to ${data.status.toLowerCase().replace('_', ' ')}`
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: documentsKeys.statistics() });
      } catch (error: any) {
        showNotification({
          type: 'error',
          title: 'Processing Failed',
          message: error.message || 'Failed to process document'
        });
        throw error;
      }
    },

    rejectDocument: async (id: string, reason: string) => {
      try {
        await rejectDocumentMutation.mutateAsync({ 
          id, 
          data: { reason } 
        });
        
        showNotification({
          type: 'success',
          title: 'Document Rejected',
          message: 'Document has been rejected'
        });
        
        queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: documentsKeys.statistics() });
      } catch (error: any) {
        showNotification({
          type: 'error',
          title: 'Rejection Failed',
          message: error.message || 'Failed to reject document'
        });
        throw error;
      }
    },

    releaseDocument: async (id: string, notes?: string) => {
      try {
        await releaseDocumentMutation.mutateAsync({ 
          id, 
          data: { notes } 
        });
        
        showNotification({
          type: 'success',
          title: 'Document Released',
          message: 'Document has been released'
        });
        
        queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: documentsKeys.statistics() });
      } catch (error: any) {
        showNotification({
          type: 'error',
          title: 'Release Failed',
          message: error.message || 'Failed to release document'
        });
        throw error;
      }
    },

    cancelDocument: async (id: string, reason: string) => {
      try {
        await cancelDocumentMutation.mutateAsync({ 
          id, 
          reason 
        });
        
        showNotification({
          type: 'success',
          title: 'Document Cancelled',
          message: 'Document has been cancelled'
        });
        
        queryClient.invalidateQueries({ queryKey: documentsKeys.lists() });
        queryClient.invalidateQueries({ queryKey: documentsKeys.statistics() });
      } catch (error: any) {
        showNotification({
          type: 'error',
          title: 'Cancellation Failed',
          message: error.message || 'Failed to cancel document'
        });
        throw error;
      }
    },
  };

  // Filter functions
  const updateFilters = (newFilters: Partial<QueueFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'ALL',
      searchTerm: '',
    });
  };

  return {
    // Data
    documents: filteredDocuments,
    statistics,
    statusCounts,
    
    // State
    filters,
    updateFilters,
    clearFilters,
    
    // Loading states
    isLoading: documentsLoading || statisticsLoading,
    documentsLoading,
    statisticsLoading,
    isProcessing: processDocumentMutation.isPending ||
                  rejectDocumentMutation.isPending ||
                  releaseDocumentMutation.isPending ||
                  cancelDocumentMutation.isPending,
    
    // Error states
    error: documentsError,
    
    // Actions
    actions,
    
    // Utils
    refetch: refetchDocuments,
  };
} 