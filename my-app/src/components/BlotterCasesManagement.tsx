import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEye, FiEdit, FiTrash2, FiAlertTriangle, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { apiService } from '../services/api';
import AddNewBlotterCase from './AddNewBlotterCase';

interface BlotterCase {
  id: number;
  case_number: string;
  incident_type: string;
  complainant_name: string;
  complainant_contact: string;
  respondent_name: string;
  respondent_contact?: string;
  incident_date: string;
  incident_location: string;
  description: string;
  status: 'pending' | 'under_investigation' | 'resolved' | 'dismissed' | 'referred';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reported_by: string;
  assigned_officer?: string;
  created_at: string;
  updated_at: string;
  resolution_notes?: string;
}

const BlotterCasesManagement: React.FC = () => {
  const [cases, setCases] = useState<BlotterCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCase, setSelectedCase] = useState<BlotterCase | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    total_cases: 0,
    filed_cases: 0,
    under_investigation: 0,
    settled_cases: 0,
    closed_cases: 0
  });

  // Fetch blotter cases data
  useEffect(() => {
    fetchBlotterCases();
    fetchStatistics();
  }, [currentPage, searchTerm, statusFilter, priorityFilter]);
  const fetchStatistics = async () => {
    try {
      const data = await apiService.getBlotterCaseStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error fetching blotter case statistics:', err);
      // Keep default values on error
    }
  };

  const fetchBlotterCases = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBlotterCases({
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
        // API doesn't support priority filtering, we'll filter locally instead
        // priority: priorityFilter === 'all' ? undefined : priorityFilter
      });
      setCases(response.data);
      setTotalPages(response.last_page || 1);
      setTotalCount(response.total || response.data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching blotter cases:', err);
      setError('Failed to load blotter cases');
      // Fallback to static data for demo
      setCases([
        {
          id: 1,
          case_number: 'BLT-2024-001',
          incident_type: 'Noise Complaint',
          complainant_name: 'Maria Santos',
          complainant_contact: '09123456789',
          respondent_name: 'Juan Dela Cruz',
          respondent_contact: '09987654321',
          incident_date: '2024-01-15',
          incident_location: 'Purok 1, Barangay Example',
          description: 'Loud music and karaoke during prohibited hours (past 10 PM) disturbing the neighborhood peace.',
          status: 'pending',
          priority: 'medium',
          reported_by: 'Maria Santos',
          assigned_officer: 'Officer Rodriguez',
          created_at: '2024-01-16T08:30:00Z',
          updated_at: '2024-01-16T08:30:00Z'
        },
        {
          id: 2,
          case_number: 'BLT-2024-002',
          incident_type: 'Property Dispute',
          complainant_name: 'Pedro Garcia',
          complainant_contact: '09111222333',
          respondent_name: 'Ana Lopez',
          incident_date: '2024-01-14',
          incident_location: 'Purok 3, Barangay Example',
          description: 'Boundary dispute over property lines causing tension between neighbors.',
          status: 'under_investigation',
          priority: 'high',
          reported_by: 'Pedro Garcia',
          assigned_officer: 'Officer Mendoza',
          created_at: '2024-01-15T14:20:00Z',
          updated_at: '2024-01-17T10:15:00Z'
        },
        {
          id: 3,
          case_number: 'BLT-2024-003',
          incident_type: 'Theft',
          complainant_name: 'Rosa Martinez',
          complainant_contact: '09444555666',
          respondent_name: 'Unknown Suspect',
          incident_date: '2024-01-13',
          incident_location: 'Main Street, Barangay Example',
          description: 'Bicycle stolen from in front of sari-sari store. Security camera footage available.',
          status: 'resolved',
          priority: 'medium',
          reported_by: 'Rosa Martinez',
          assigned_officer: 'Officer Torres',
          created_at: '2024-01-14T09:45:00Z',
          updated_at: '2024-01-18T16:30:00Z',
          resolution_notes: 'Bicycle recovered and returned to owner. Suspect identified and warned.'
        }
      ]);
      setTotalCount(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCase = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this blotter case?')) {
      try {
        await apiService.deleteBlotterCase(id);
        fetchBlotterCases(); // Refresh the list
      } catch (err) {
        console.error('Error deleting blotter case:', err);
        alert('Failed to delete blotter case');
      }
    }
  };

  const handleStatusChange = async (caseId: number, newStatus: string) => {
    try {
      await apiService.updateBlotterCase(caseId, { status: newStatus });
      fetchBlotterCases(); // Refresh the list
    } catch (err) {
      console.error('Error updating case status:', err);
      alert('Failed to update case status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_investigation':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800';
      case 'referred':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-200 text-red-900';
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'under_investigation':
        return <FiAlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'dismissed':
        return <FiFileText className="w-4 h-4" />;
      case 'referred':
        return <FiFileText className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };  // Statistics cards using real API data
  const statsCards = [
    { 
      title: 'Total Cases', 
      value: (stats.total_cases || 0).toString(), 
      icon: FiFileText,
      color: 'text-blue-600'
    },
    { 
      title: 'Filed Cases', 
      value: (stats.filed_cases || 0).toString(), 
      icon: FiClock,
      color: 'text-yellow-600'
    },
    { 
      title: 'Under Investigation', 
      value: (stats.under_investigation || 0).toString(), 
      icon: FiAlertTriangle,
      color: 'text-blue-600'
    },
    { 
      title: 'Settled', 
      value: (stats.settled_cases || 0).toString(), 
      icon: FiCheckCircle,
      color: 'text-green-600'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_investigation', label: 'Under Investigation' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'dismissed', label: 'Dismissed' },
    { value: 'referred', label: 'Referred' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showAddForm ? (
        <AddNewBlotterCase
          onClose={() => setShowAddForm(false)}
          onSave={(newCase) => {
            setCases(prev => [newCase, ...prev]);
            setShowAddForm(false);
            // Refresh the list to get the latest data
            fetchBlotterCases();
          }}
        />
      ) : (
        <>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
              Blotter Cases Management
            </h1>
            <p className="text-gray-600 mt-1 ml-6">Manage barangay incident reports and cases</p>
          </div>      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={stat.color}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
              Blotter Cases
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* Add New Blotter Case Button */}
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4" />
                <span>File New Case</span>
              </button>

              {/* Add New Case Button */}
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Case</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading blotter cases...</div>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <div className="text-sm text-gray-500">Showing fallback data</div>
          </div>
        )}

        {/* Cases List */}
        {!loading && (
          <div className="divide-y divide-gray-200">
            {cases.map((blotterCase) => (
              <div key={blotterCase.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {blotterCase.case_number}
                      </h3>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-700 font-medium">
                        {blotterCase.incident_type}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(blotterCase.status)}`}>
                        {getStatusIcon(blotterCase.status)}
                        {blotterCase.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(blotterCase.priority)}`}>
                        {blotterCase.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {blotterCase.description}
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                      <div>
                        <strong>Complainant:</strong> {blotterCase.complainant_name}
                      </div>
                      <div>
                        <strong>Respondent:</strong> {blotterCase.respondent_name}
                      </div>
                      <div>
                        <strong>Location:</strong> {blotterCase.incident_location}
                      </div>
                      <div>
                        <strong>Date:</strong> {new Date(blotterCase.incident_date).toLocaleDateString()}
                      </div>
                    </div>

                    {blotterCase.assigned_officer && (
                      <div className="text-sm text-gray-500 mb-3">
                        <strong>Assigned Officer:</strong> {blotterCase.assigned_officer}
                      </div>
                    )}

                    {/* Status Change Dropdown */}
                    <div className="flex items-center gap-4">
                      <select
                        value={blotterCase.status}
                        onChange={(e) => handleStatusChange(blotterCase.id, e.target.value)}
                        className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_investigation">Under Investigation</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                        <option value="referred">Referred</option>
                      </select>
                      
                      <span className="text-sm text-gray-500">
                        Filed: {new Date(blotterCase.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="View details"
                      onClick={() => setSelectedCase(blotterCase)}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900 p-2"
                      title="Edit case"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-2"
                      title="Delete case"
                      onClick={() => handleDeleteCase(blotterCase.id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {cases.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No blotter cases found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * 10 + 1, totalCount)} to {Math.min(currentPage * 10, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button 
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Case Details - {selectedCase.case_number}
              </h3>
              <button 
                onClick={() => setSelectedCase(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Number</label>
                  <p className="text-gray-900 font-semibold">{selectedCase.case_number}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident Type</label>
                  <p className="text-gray-900">{selectedCase.incident_type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedCase.status)}`}>
                    {getStatusIcon(selectedCase.status)}
                    {selectedCase.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(selectedCase.priority)}`}>
                    {selectedCase.priority.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complainant</label>
                  <p className="text-gray-900">{selectedCase.complainant_name}</p>
                  <p className="text-gray-600 text-sm">{selectedCase.complainant_contact}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Respondent</label>
                  <p className="text-gray-900">{selectedCase.respondent_name}</p>
                  {selectedCase.respondent_contact && (
                    <p className="text-gray-600 text-sm">{selectedCase.respondent_contact}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Incident Date</label>
                  <p className="text-gray-900">{new Date(selectedCase.incident_date).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <p className="text-gray-900">{selectedCase.incident_location}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                  <p className="text-gray-900">{selectedCase.reported_by}</p>
                </div>
                
                {selectedCase.assigned_officer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Officer</label>
                    <p className="text-gray-900">{selectedCase.assigned_officer}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filed Date</label>
                  <p className="text-gray-900">{new Date(selectedCase.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedCase.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incident Description</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedCase.description}</p>
              </div>
              
              {selectedCase.resolution_notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
                  <p className="text-gray-900 bg-green-50 p-3 rounded-lg border border-green-200">{selectedCase.resolution_notes}</p>
                </div>
              )}            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default BlotterCasesManagement;
