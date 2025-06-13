import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiFile, FiEye, FiX, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { apiService } from '../services/api';
import ProcessDocument from './ProcessDocument';

interface Document {
  id: number;
  document_number: string;
  resident_name: string;
  document_type: string;
  purpose: string;
  request_date: string;
  status: 'pending' | 'approved' | 'released' | 'rejected';
  valid_id?: string;
  years_of_residency?: string;
  certifying_official?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

const DocumentsManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showProcessDocumentForm, setShowProcessDocumentForm] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'release' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch documents data
  useEffect(() => {
    fetchDocuments();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDocuments({
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
        document_type: typeFilter === 'all' ? undefined : typeFilter
      });
      setDocuments(response.data);
      setTotalPages(response.last_page || 1);
      setTotalCount(response.total || response.data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents');
      // Fallback to static data for demo
      setDocuments([
        {
          id: 1,
          document_number: 'DOC-2024-001',
          resident_name: 'Maria Santos',
          document_type: 'Barangay Clearance',
          purpose: 'Employment',
          request_date: '2024-01-16',
          status: 'pending',
          created_at: '2024-01-16T08:30:00Z',
          updated_at: '2024-01-16T08:30:00Z'
        },
        {
          id: 2,
          document_number: 'DOC-2024-002',
          resident_name: 'Juan Dela Cruz',
          document_type: 'Certificate of Residency',
          purpose: 'School enrollment',
          request_date: '2024-01-15',
          status: 'approved',
          created_at: '2024-01-15T10:20:00Z',
          updated_at: '2024-01-16T09:15:00Z'
        },
        {
          id: 3,
          document_number: 'DOC-2024-003',
          resident_name: 'Ana Lopez',
          document_type: 'Business Permit',
          purpose: 'Business registration',
          request_date: '2024-01-14',
          status: 'released',
          created_at: '2024-01-14T14:45:00Z',
          updated_at: '2024-01-17T11:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDocument = async (id: number) => {
    try {
      setLoading(true);
      await apiService.approveDocument(id);
      fetchDocuments();
      setIsActionModalOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error('Error approving document:', err);
      setError('Failed to approve document');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectDocument = async (id: number) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    try {
      setLoading(true);
      await apiService.rejectDocument(id, { rejection_reason: rejectionReason });
      fetchDocuments();
      setIsActionModalOpen(false);
      setSelectedDocument(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Error rejecting document:', err);
      setError('Failed to reject document');
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseDocument = async (id: number) => {
    try {
      setLoading(true);
      await apiService.releaseDocument(id);
      fetchDocuments();
      setIsActionModalOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error('Error releasing document:', err);
      setError('Failed to release document');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document request?')) {
      try {
        // Note: This would need to be implemented in the backend API
        // await apiService.deleteDocument(id);
        // For now just filter it out locally
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        console.error('Error deleting document:', err);
        setError('Failed to delete document');
      }
    }
  };

  const handleActionClick = (document: Document, action: 'approve' | 'reject' | 'release') => {
    setSelectedDocument(document);
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const documentTypes = ['Barangay Clearance', 'Business Permit', 'Certificate of Indigency', 'Certificate of Residency'];
  const statusOptions = ['pending', 'approved', 'released', 'rejected'];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'released':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showProcessDocumentForm ? (
        <ProcessDocument
          onNavigate={() => setShowProcessDocumentForm(false)}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Documents Management</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-60 md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                onClick={() => setShowProcessDocumentForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>Process New Document</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg font-medium text-gray-900">Document Requests</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <label htmlFor="statusFilter" className="mr-2 text-sm text-gray-500">Status:</label>
                    <select
                      id="statusFilter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label htmlFor="typeFilter" className="mr-2 text-sm text-gray-500">Type:</label>
                    <select
                      id="typeFilter"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="border border-gray-300 rounded-md py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      {documentTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                <p className="mt-2 text-gray-500">Loading documents...</p>
              </div>
            ) : error ? (
              <div className="text-center p-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={fetchDocuments} 
                  className="mt-3 text-blue-600 hover:text-blue-800"
                >
                  Try Again
                </button>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center p-8">
                <FiFile className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No document requests found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document#
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Resident Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Request Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{doc.document_number}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.resident_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.document_type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{doc.purpose}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(doc.request_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeColor(doc.status)}`}>
                              {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button 
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setIsViewModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <FiEye className="h-5 w-5" />
                              </button>
                              
                              {doc.status === 'pending' && (
                                <>
                                  <button 
                                    onClick={() => handleActionClick(doc, 'approve')}
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <FiCheckCircle className="h-5 w-5" />
                                  </button>
                                  <button 
                                    onClick={() => handleActionClick(doc, 'reject')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FiXCircle className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                              
                              {doc.status === 'approved' && (
                                <button 
                                  onClick={() => handleActionClick(doc, 'release')}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <FiCheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              
                              <button 
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{documents.length}</span> of <span className="font-medium">{totalCount}</span> documents
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* View Document Modal */}
          {isViewModalOpen && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Document Details</h3>
                    <button 
                      onClick={() => {
                        setIsViewModalOpen(false);
                        setSelectedDocument(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Document Number</p>
                      <p className="mt-1 text-base text-gray-900">{selectedDocument.document_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Request Date</p>
                      <p className="mt-1 text-base text-gray-900">
                        {new Date(selectedDocument.request_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Resident Name</p>
                      <p className="mt-1 text-base text-gray-900">{selectedDocument.resident_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Document Type</p>
                      <p className="mt-1 text-base text-gray-900">{selectedDocument.document_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Purpose</p>
                      <p className="mt-1 text-base text-gray-900">{selectedDocument.purpose}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`mt-1 px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeColor(selectedDocument.status)}`}>
                        {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                      </span>
                    </div>
                    {selectedDocument.valid_id && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Valid ID Presented</p>
                        <p className="mt-1 text-base text-gray-900">{selectedDocument.valid_id}</p>
                      </div>
                    )}
                    {selectedDocument.years_of_residency && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Years of Residency</p>
                        <p className="mt-1 text-base text-gray-900">{selectedDocument.years_of_residency}</p>
                      </div>
                    )}
                    {selectedDocument.certifying_official && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Certifying Official</p>
                        <p className="mt-1 text-base text-gray-900">{selectedDocument.certifying_official}</p>
                      </div>
                    )}
                    {selectedDocument.status === 'rejected' && selectedDocument.rejection_reason && (
                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Rejection Reason</p>
                        <p className="mt-1 text-base text-gray-900">{selectedDocument.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setSelectedDocument(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Modal */}
          {isActionModalOpen && selectedDocument && actionType && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {actionType === 'approve' && 'Approve Document'}
                      {actionType === 'reject' && 'Reject Document'}
                      {actionType === 'release' && 'Release Document'}
                    </h3>
                    <button 
                      onClick={() => {
                        setIsActionModalOpen(false);
                        setSelectedDocument(null);
                        setActionType(null);
                        setRejectionReason('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-4 text-gray-700">
                    {actionType === 'approve' && `Are you sure you want to approve this ${selectedDocument.document_type.toLowerCase()} request?`}
                    {actionType === 'release' && `Are you sure you want to mark this ${selectedDocument.document_type.toLowerCase()} as released?`}
                  </p>
                  
                  {actionType === 'reject' && (
                    <div className="mb-4">
                      <p className="mb-2 text-gray-700">
                        Please provide a reason for rejecting this {selectedDocument.document_type.toLowerCase()} request:
                      </p>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Enter rejection reason"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        required
                      />
                    </div>
                  )}
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                      {error}
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setIsActionModalOpen(false);
                      setSelectedDocument(null);
                      setActionType(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (actionType === 'approve') handleApproveDocument(selectedDocument.id);
                      if (actionType === 'reject') handleRejectDocument(selectedDocument.id);
                      if (actionType === 'release') handleReleaseDocument(selectedDocument.id);
                    }}
                    disabled={actionType === 'reject' && !rejectionReason.trim()}
                    className={`px-4 py-2 text-white rounded-lg ${
                      actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 
                      actionType === 'release' ? 'bg-blue-600 hover:bg-blue-700' : 
                      'bg-red-600 hover:bg-red-700'
                    } ${
                      (actionType === 'reject' && !rejectionReason.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      <>
                        {actionType === 'approve' && 'Approve'}
                        {actionType === 'reject' && 'Reject'}
                        {actionType === 'release' && 'Release'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentsManagement;
