import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPrinter, FiEye, FiEdit3, FiCheck, FiX, FiClock, FiUser, FiCalendar, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { documentsService } from '../../services/documents.service';
import type { ApproveDocumentData, DocumentRequest, RejectDocumentData } from '../../services/document.types';
import { 
  BarangayClearanceTemplate, 
  CertificateOfResidencyTemplate, 
  CertificateOfIndigencyTemplate, 
  BusinessPermitTemplate,
  type DocumentData 
} from './CertificateTemplates';

interface ProcessDocumentProps {
  onNavigate: (page: string) => void;
}

// interface DocumentRequest {
//   id: number;
//   document_type: string;
//   resident_id: number;
//   resident_name: string;
//   purpose: string;
//   status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'RELEASED' | 'REJECTED';
//   request_date: string;
//   processed_date?: string;
//   processing_fee: number;
//   certifying_official?: string;
//   notes?: string;
//   resident: {
//     first_name: string;
//     last_name: string;
//     middle_name?: string;
//     complete_address: string;
//     mobile_number?: string;
//   };
// }

interface DocumentStats {
  pending: number;
  under_review: number;
  approved: number;
  released: number;
  rejected: number;
  total: number;
}

const ProcessDocument: React.FC<ProcessDocumentProps> = () => {
  const [documents, setDocuments] = useState<DocumentRequest[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentRequest[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    pending: 0,
    under_review: 0,
    approved: 0,
    released: 0,
    rejected: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('ALL');
  const [selectedDocument, setSelectedDocument] = useState<DocumentRequest | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showPrintTemplate, setShowPrintTemplate] = useState(false);
  const [selectedPrintDocument, setSelectedPrintDocument] = useState<DocumentData | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const documentTypes = [
    { value: 'BARANGAY_CLEARANCE', label: 'Barangay Clearance', fee: 50 },
    { value: 'BUSINESS_PERMIT', label: 'Business Permit', fee: 100 },
    { value: 'CERTIFICATE_INDIGENCY', label: 'Certificate of Indigency', fee: 0 },
    { value: 'CERTIFICATE_RESIDENCY', label: 'Certificate of Residency', fee: 30 }
  ];

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    UNDER_REVIEW: 'bg-blue-100 text-blue-800',
    APPROVED: 'bg-green-100 text-green-800',
    RELEASED: 'bg-gray-100 text-gray-800',
    REJECTED: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    PENDING: FiClock,
    UNDER_REVIEW: FiEye,
    APPROVED: FiCheck,
    RELEASED: FiFileText,
    REJECTED: FiX
  };

  useEffect(() => {
    // Use placeholder data for demonstration
    if (process.env.NODE_ENV === 'development') {
      loadPlaceholderData();
    } else {
      fetchDocuments();
      fetchDocumentStats();
    }
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [documents, searchTerm, statusFilter, documentTypeFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentsService.getDocuments();
      setDocuments(response.data);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      if (err instanceof Error) {
        setError((err instanceof Error ? err.message : 'Unknown error'));
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentStats = async () => {
    try {
      const response = await documentsService.getDocumentStatistics();
      setStats(response);
    } catch (err) {
      console.error('Failed to fetch document statistics:', err);
    }
  };

  const loadPlaceholderData = () => {
    // Placeholder data for demonstration
    const placeholderDocuments: DocumentRequest[] = [
      {
        id: 1,
        document_type: 'BARANGAY_CLEARANCE',
        resident_id: 1,
        resident_name: 'Juan Dela Cruz',
        purpose: 'Employment Application',
        status: 'PENDING',
        request_date: '2024-01-15T10:30:00Z',
        processing_fee: 50,
        certifying_official: 'Hon. Maria Santos - Kagawad',
        notes: 'For employment at ABC Company',
        resident: {
          first_name: 'Juan',
          last_name: 'Dela Cruz',
          complete_address: 'Purok 1, Barangay San Miguel',
          mobile_number: '+63 912 345 6789'
        }
      },
      {
        id: 2,
        document_type: 'CERTIFICATE_INDIGENCY',
        resident_id: 2,
        resident_name: 'Maria Santos',
        purpose: 'Medical Assistance',
        status: 'UNDER_REVIEW',
        request_date: '2024-01-14T14:20:00Z',
        processing_fee: 0,
        certifying_official: 'Hon. Juan Dela Cruz - Punong Barangay',
        notes: 'Income: Below poverty line, Household members: 5',
        resident: {
          first_name: 'Maria',
          last_name: 'Santos',
          complete_address: 'Purok 2, Barangay San Miguel',
          mobile_number: '+63 923 456 7890'
        }
      },
      {
        id: 3,
        document_type: 'BUSINESS_PERMIT',
        resident_id: 3,
        resident_name: 'Roberto Garcia',
        purpose: 'Business Permit for Sari-sari Store',
        status: 'APPROVED',
        request_date: '2024-01-12T09:15:00Z',
        processing_fee: 100,
        certifying_official: 'Hon. Roberto Garcia - Kagawad',
        notes: 'Business: Garcias Sari-sari Store, Type: Retail Store, Capital: ₱50,000',
        resident: {
          first_name: 'Roberto',
          last_name: 'Garcia',
          complete_address: 'Purok 3, Barangay San Miguel',
          mobile_number: '+63 934 567 8901'
        }
      },
      {
        id: 4,
        document_type: 'CERTIFICATE_RESIDENCY',
        resident_id: 4,
        resident_name: 'Ana Reyes',
        purpose: 'School Enrollment',
        status: 'RELEASED',
        request_date: '2024-01-10T16:45:00Z',
        processing_fee: 30,
        certifying_official: 'Carmen Rodriguez - Barangay Secretary',
        notes: 'Years of Residence: 15, Residency Status: Permanent Resident',
        resident: {
          first_name: 'Ana',
          last_name: 'Reyes',
          complete_address: 'Purok 4, Barangay San Miguel',
          mobile_number: '+63 945 678 9012'
        }
      },
      {
        id: 5,
        document_type: 'BARANGAY_CLEARANCE',
        resident_id: 5,
        resident_name: 'Carlos Mendoza',
        purpose: 'Passport Application',
        status: 'REJECTED',
        request_date: '2024-01-11T11:30:00Z',
        processing_fee: 50,
        certifying_official: 'Hon. Maria Santos - Kagawad',
        notes: 'Incomplete requirements - missing valid ID',
        resident: {
          first_name: 'Carlos',
          last_name: 'Mendoza',
          complete_address: 'Purok 1, Barangay San Miguel',
          mobile_number: '+63 956 789 0123'
        }
      }
    ];

    const placeholderStats: DocumentStats = {
      pending: 1,
      under_review: 1,
      approved: 1,
      released: 1,
      rejected: 1,
      total: 5
    };

    setDocuments(placeholderDocuments);
    setStats(placeholderStats);
    setLoading(false);
  };

  const filterDocuments = () => {
    let filtered = documents;

    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.resident_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    if (documentTypeFilter !== 'ALL') {
      filtered = filtered.filter(doc => doc.document_type === documentTypeFilter);
    }

    setFilteredDocuments(filtered);
  };

  const handleProcessDocument = async (documentId: number, action: string, data?: {
    notes?: string;
    certifying_official?: string;
  }) => {
    try {
      let response;
      switch (action) {
        case 'approve':
          response = await documentsService.approveDocument(documentId, data as ApproveDocumentData);
          break;
        case 'reject':
          response = await documentsService.rejectDocument(documentId, data as RejectDocumentData);
          break;
        case 'release':
          response = await documentsService.releaseDocument(documentId, data);
          break;
        default:
          throw new Error('Invalid action');
      }

      console.log('Document processed successfully:', response);

      // Refresh data
      await fetchDocuments();
      await fetchDocumentStats();
      setShowProcessModal(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error('Error processing document:', err);
      if (err instanceof Error) {
        setError((err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  };

  const handlePrintDocument = (document: DocumentRequest) => {
    // Convert DocumentRequest to DocumentData for the template
    const documentData: DocumentData = {
      id: document.id,
      document_type: document.document_type,
      resident_name: document.resident_name,
      purpose: document.purpose,
      status: document.status,
      request_date: document.request_date,
      resident: {
        first_name: document.resident.first_name,
        last_name: document.resident.last_name,
        middle_name: document.resident.middle_name || '',
        complete_address: document.resident.complete_address,
        birth_date: (document.resident as any).birth_date || '',
        civil_status: (document.resident as any).civil_status || '',
        nationality: (document.resident as any).nationality || 'Filipino',
      },
      certifying_official: (document as any).certifying_official || '',
      or_number: (document as any).or_number || '',
      amount_paid: (document as any).amount_paid || 0,
      date_issued: (document as any).date_issued || '',
    };

    setSelectedPrintDocument(documentData);
    setShowPrintTemplate(true);
  };

  const getDocumentTypeLabel = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  const getStatusIcon = (status: string) => {
    const IconComponent = statusIcons[status as keyof typeof statusIcons];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-darktext">Document Processing Center</h1>
        <p className="text-gray-600 mt-1">Manage and process barangay documents and certificates</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
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
              <p className="text-2xl font-bold text-blue-600">{stats.under_review}</p>
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
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
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
              <p className="text-2xl font-bold text-gray-600">{stats.released}</p>
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
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
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
              <p className="text-2xl font-bold text-darktext">{stats.total}</p>
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="RELEASED">Released</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            {/* Document Type Filter */}
            <div className="relative">
              <select
                value={documentTypeFilter}
                onChange={(e) => setDocumentTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 appearance-none bg-white"
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
                          {document.resident_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {document.resident?.mobile_number}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getDocumentTypeLabel(document.document_type)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {document.purpose}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[document.status]}`}>
                      {getStatusIcon(document.status)}
                      <span className="ml-1">{document.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiCalendar className="mr-1 h-4 w-4" />
                      {new Date(document.request_date).toLocaleDateString()}
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
                        className="text-smblue-400 hover:text-smblue-300"
                        title="Process Document"
                      >
                        <FiEdit3 className="h-4 w-4" />
                      </button>
                                <button
                        onClick={() => handlePrintDocument(document)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Print/View"
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
                    {Math.min(indexOfLastItem, filteredDocuments.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredDocuments.length}</span> results
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
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
                  ))}
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

      {/* Process Document Modal */}
      {showProcessModal && selectedDocument && (
        <ProcessDocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowProcessModal(false);
            setSelectedDocument(null);
          }}
          onProcess={handleProcessDocument}
        />
      )}

      {/* Print Templates */}
      {showPrintTemplate && selectedPrintDocument && (() => {
        const handleClosePrint = () => {
          setShowPrintTemplate(false);
          setSelectedPrintDocument(null);
        };

        switch (selectedPrintDocument.document_type) {
          case 'BARANGAY_CLEARANCE':
            return <BarangayClearanceTemplate document={selectedPrintDocument} onClose={handleClosePrint} />;
          case 'CERTIFICATE_OF_RESIDENCY':
            return <CertificateOfResidencyTemplate document={selectedPrintDocument} onClose={handleClosePrint} />;
          case 'CERTIFICATE_OF_INDIGENCY':
            return <CertificateOfIndigencyTemplate document={selectedPrintDocument} onClose={handleClosePrint} />;
          case 'BUSINESS_PERMIT':
            return <BusinessPermitTemplate document={selectedPrintDocument} onClose={handleClosePrint} />;
          default:
            return <BarangayClearanceTemplate document={selectedPrintDocument} onClose={handleClosePrint} />;
        }
      })()}

    </div>
  );
};

// Process Document Modal Component
const ProcessDocumentModal: React.FC<{
  document: DocumentRequest;
  onClose: () => void;
  onProcess: (id: number, action: string, data?: {
    notes?: string;
    certifying_official?: string;
  }) => void;
}> = ({ document, onClose, onProcess }) => {
  const [action, setAction] = useState<'approve' | 'reject' | 'release'>('approve');
  const [notes, setNotes] = useState('');
  const [certifyingOfficial, setCertifyingOfficial] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    const data = {
      notes,
      certifying_official: certifyingOfficial,
    };

    await onProcess(document.id, action, data);
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Process Document Request
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>Resident:</strong> {document.resident_name}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Document:</strong> {document.document_type.replace('_', ' ')}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Purpose:</strong> {document.purpose}
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
              disabled={processing}
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
                disabled={processing}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes or comments"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              disabled={processing}
            />
          </div>

          <div className="flex justify-end space-x-3">
              <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-4 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {processing && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{processing ? 'Processing...' : 'Process Document'}</span>
            </button>
          </div>
        </form>
          </div>
        </div>
  );
};



export default ProcessDocument; 

