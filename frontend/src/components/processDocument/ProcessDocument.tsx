// ============================================================================
// processDocument/ProcessDocument.tsx - Modern document processing center
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiFilter, 
  FiPrinter, 
  FiEye, 
  FiClipboard, 
  FiCheck, 
  FiX, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiFileText, 
  FiAlertCircle,
  FiRefreshCw,
  FiEdit3
} from 'react-icons/fi';

import { LoadingSpinner } from '../__shared/LoadingSpinner';
import { useDocumentQueue } from './_hooks/useDocumentQueue';
import { useNotifications } from '@/components/_global/NotificationSystem';
import Breadcrumb from '../_global/Breadcrumb';
import type { Document, DocumentStatus } from '@/services/documents/documents.types';

interface ProcessDocumentProps {
  onNavigate?: (page: string) => void;
}

const ProcessDocument: React.FC<ProcessDocumentProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  
  const {
    documents,
    statistics,
    statusCounts,
    filters,
    updateFilters,
    clearFilters,
    isLoading,
    isProcessing,
    error,
    actions,
    refetch,
  } = useDocumentQueue();

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const documentTypes = [
    { value: 'BARANGAY_CLEARANCE', label: 'Barangay Clearance' },
    { value: 'BUSINESS_PERMIT', label: 'Business Permit' },
    { value: 'CERTIFICATE_OF_INDIGENCY', label: 'Certificate of Indigency' },
    { value: 'CERTIFICATE_OF_RESIDENCY', label: 'Certificate of Residency' }
  ];

  const statusConfig = {
    PENDING: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: FiClock,
      label: 'Pending'
    },
    UNDER_REVIEW: {
      color: 'bg-blue-100 text-blue-800',
      icon: FiEye,
      label: 'Under Review'
    },
    APPROVED: {
      color: 'bg-green-100 text-green-800',
      icon: FiCheck,
      label: 'Approved'
    },
    RELEASED: {
      color: 'bg-gray-100 text-gray-800',
      icon: FiFileText,
      label: 'Released'
    },
    REJECTED: {
      color: 'bg-red-100 text-red-800',
      icon: FiX,
      label: 'Rejected'
    },
    CANCELLED: {
      color: 'bg-gray-100 text-gray-800',
      icon: FiX,
      label: 'Cancelled'
    }
  };

  const handleProcessDocument = async (
    documentId: string,
    action: 'approve' | 'reject' | 'release',
    data?: { notes?: string; certifying_official?: string }
  ) => {
    try {
      switch (action) {
        case 'approve':
          await actions.processDocument(documentId, {
            status: 'APPROVED',
            notes: data?.notes
          });
          break;
        case 'reject':
          await actions.rejectDocument(documentId, data?.notes || 'Document rejected');
          break;
        case 'release':
          await actions.releaseDocument(documentId, data?.notes);
          break;
      }

      setShowProcessModal(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Error processing document:', error);
    }
  };

  const handlePrintDocument = (document: Document) => {
    // Navigate to the appropriate print route based on document type
    const documentType = document.document_type.toLowerCase().replace(/_/g, '-');
    navigate(`/print/${documentType}/${document.id}`);
  };

  const formatDocumentType = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType?.label : type.replace(/_/g, ' ');
  };

  const getStatusIcon = (status: DocumentStatus) => {
    const config = statusConfig[status];
    if (!config) return null;
    const IconComponent = config.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = documents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(documents.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Documents</h3>
          <p className="text-red-700 mb-4">
            {error?.message || 'Failed to load document processing center'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={true} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
        <h1 className="text-2xl font-bold text-darktext">Document Processing Center</h1>
        <p className="text-gray-600 mt-1">Manage and process barangay documents and certificates</p>
      </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
              disabled={isLoading}
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.PENDING}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.UNDER_REVIEW}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiEye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.APPROVED}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Released</p>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.RELEASED}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <FiFileText className="w-6 h-6 text-gray-600" />
            </div>
        </div>
      </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.REJECTED}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FiX className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-darktext">
                {statistics?.total_documents || 0}
              </p>
            </div>
            <div className="p-3 bg-smblue-100 rounded-full">
              <FiFileText className="w-6 h-6 text-smblue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
                placeholder="Search by resident name, document type, or purpose..."
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value as DocumentStatus | 'ALL' })}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 appearance-none bg-white cursor-pointer"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="RELEASED">Released</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Document Type Filter */}
            <div className="relative">
              <select
                value={filters.documentType || 'ALL'}
                onChange={(e) => updateFilters({ 
                  documentType: e.target.value === 'ALL' ? undefined : e.target.value as any
                })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 appearance-none bg-white cursor-pointer"
              >
                <option value="ALL">All Document Types</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {documents.length} documents found
            </span>
            {(filters.searchTerm || filters.status !== 'ALL' || filters.documentType) && (
              <button
                onClick={clearFilters}
                className="text-sm text-smblue-400 hover:text-smblue-600"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resident
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-smblue-100 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-smblue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {document.applicant_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.applicant_contact || 'No contact'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDocumentType(document.document_type)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {document.purpose}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.[document.status]?.color}`}>
                      {getStatusIcon(document.status)}
                      <span className="ml-1">{statusConfig?.[document.status]?.label}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiCalendar className="mr-1 h-4 w-4" />
                      {new Date(document.date_added).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {document.processing_fee === 0 ? 'FREE' : `₱${document.processing_fee}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDocument(document);
                          setShowProcessModal(true);
                        }}
                        className="text-green-600 hover:text-green-700 p-1 rounded-md hover:bg-green-50 transition-colors"
                        title="Review & Process"
                      >
                        <FiClipboard className="h-4 w-4" />
                      </button>
                                <button
                        onClick={() => handlePrintDocument(document)}
                        className="text-smblue-600 hover:text-smblue-700 p-1 rounded-md hover:bg-smblue-50 transition-colors"
                        title="Print Certificate"
                      >
                        <FiPrinter className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
                </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, documents.length)}
                  </span>{' '}
                  of <span className="font-medium">{documents.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNumber
                          ? 'z-10 bg-smblue-50 border-smblue-400 text-smblue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
          </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">
            {filters.searchTerm || filters.status !== 'ALL' || filters.documentType
              ? 'Try adjusting your search criteria'
              : 'No documents to process at the moment'
            }
          </p>
        </div>
      )}

      {/* Process Document Modal */}
      {showProcessModal && selectedDocument && (
        <ProcessDocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowProcessModal(false);
            setSelectedDocument(null);
          }}
          onProcess={handleProcessDocument}
          isProcessing={isProcessing}
        />
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <LoadingSpinner size="md" />
            <span className="text-gray-700">Processing document...</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Process Document Modal Component
const ProcessDocumentModal: React.FC<{
  document: Document;
  onClose: () => void;
  onProcess: (
    id: string,
    action: 'approve' | 'reject' | 'release',
    data?: { notes?: string; certifying_official?: string }
  ) => Promise<void>;
  isProcessing: boolean;
}> = ({ document, onClose, onProcess, isProcessing }) => {
  const [action, setAction] = useState<'approve' | 'reject' | 'release'>('approve');
  const [notes, setNotes] = useState('');
  const [certifyingOfficial, setCertifyingOfficial] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      notes: notes.trim() || undefined,
      certifying_official: certifyingOfficial.trim() || undefined,
    };

    await onProcess(document.id, action, data);
  };

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Process Document Request
        </h3>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">
            <strong>Resident:</strong> {document.applicant_name}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Document:</strong> {formatDocumentType(document.document_type)}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Purpose:</strong> {document.purpose}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Fee:</strong> {document.processing_fee === 0 ? 'FREE' : `₱${document.processing_fee}`}
          </p>
              </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as 'approve' | 'reject' | 'release')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              disabled={isProcessing}
            >
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="release">Release</option>
            </select>
              </div>

          {action === 'approve' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certifying Official
              </label>
              <input
                type="text"
                value={certifyingOfficial}
                onChange={(e) => setCertifyingOfficial(e.target.value)}
                placeholder="Enter certifying official name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                disabled={isProcessing}
              />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes {action === 'reject' ? '(Required)' : '(Optional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Enter ${action === 'reject' ? 'rejection reason' : 'any notes or comments'}`}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              disabled={isProcessing}
              required={action === 'reject'}
            />
          </div>

          <div className="flex justify-end space-x-3">
              <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || (action === 'reject' && !notes.trim())}
              className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isProcessing && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{isProcessing ? 'Processing...' : 'Process Document'}</span>
            </button>
          </div>
        </form>
          </div>
        </div>
  );
};

export default ProcessDocument;