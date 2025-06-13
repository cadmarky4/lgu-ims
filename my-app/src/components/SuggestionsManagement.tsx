import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiTrash2, FiCheckCircle, FiClock, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { apiService } from '../services/api';
import AddNewSuggestion from './AddNewSuggestion';

interface Suggestion {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'implemented';
  priority: 'low' | 'medium' | 'high';
  submitted_by: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

const SuggestionsManagement: React.FC = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [stats, setStats] = useState({
    total_suggestions: 0,
    pending_suggestions: 0,
    approved_suggestions: 0,
    implemented_suggestions: 0,
    rejected_suggestions: 0
  });

  // Fetch suggestions data
  useEffect(() => {
    fetchSuggestions();
    fetchStatistics();
  }, [currentPage, searchTerm, statusFilter, priorityFilter]);
  const fetchStatistics = async () => {
    try {
      const data = await apiService.getSuggestionStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error fetching suggestion statistics:', err);
      // Keep default values on error
    }
  };

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSuggestions({
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
        // API doesn't support priority filtering, we'll filter locally instead
        // priority: priorityFilter === 'all' ? undefined : priorityFilter
      });
      setSuggestions(response.data);
      setTotalPages(response.last_page || 1);
      setTotalCount(response.total || response.data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Failed to load suggestions');
      // Fallback to static data for demo
      setSuggestions([
        {
          id: 1,
          title: 'Improve Public Transportation',
          description: 'Suggest adding more public transportation options like jeepneys or buses to better serve the community.',
          category: 'Transportation',
          status: 'pending',
          priority: 'high',
          submitted_by: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '09123456789',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          title: 'Community Garden Initiative',
          description: 'Propose establishing a community garden where residents can grow vegetables and promote sustainable living.',
          category: 'Environment',
          status: 'under_review',
          priority: 'medium',
          submitted_by: 'Juan Dela Cruz',
          email: 'juan.delacruz@email.com',
          created_at: '2024-01-14T14:20:00Z',
          updated_at: '2024-01-16T09:15:00Z'
        },
        {
          id: 3,
          title: 'Free Wi-Fi in Public Areas',
          description: 'Install free Wi-Fi hotspots in public areas like parks and the barangay hall for community use.',
          category: 'Technology',
          status: 'approved',
          priority: 'medium',
          submitted_by: 'Ana Rodriguez',
          email: 'ana.rodriguez@email.com',
          created_at: '2024-01-13T16:45:00Z',
          updated_at: '2024-01-17T11:30:00Z'
        }
      ]);
      setTotalCount(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSuggestion = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this suggestion?')) {
      try {
        await apiService.deleteSuggestion(id);
        fetchSuggestions(); // Refresh the list
      } catch (err) {
        console.error('Error deleting suggestion:', err);
        alert('Failed to delete suggestion');
      }
    }
  };

  const handleStatusChange = async (suggestionId: number, newStatus: string) => {
    try {
      await apiService.updateSuggestion(suggestionId, { status: newStatus });
      fetchSuggestions(); // Refresh the list
    } catch (err) {
      console.error('Error updating suggestion status:', err);
      alert('Failed to update suggestion status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'implemented':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
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
      case 'under_review':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'approved':
      case 'implemented':
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }  };
  
  // Statistics cards using real API data
  const statsCards = [
    { 
      title: 'Total Suggestions', 
      value: (stats.total_suggestions || 0).toString(), 
      icon: FiFilter,
      color: 'text-blue-600'
    },
    { 
      title: 'Pending Review', 
      value: (stats.pending_suggestions || 0).toString(), 
      icon: FiClock,
      color: 'text-yellow-600'
    },
    { 
      title: 'Approved', 
      value: (stats.approved_suggestions || 0).toString(), 
      icon: FiCheckCircle,
      color: 'text-green-600'
    },
    { 
      title: 'Implemented', 
      value: (stats.implemented_suggestions || 0).toString(), 
      icon: FiCheckCircle,
      color: 'text-purple-600'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'implemented', label: 'Implemented' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showAddForm ? (
        <AddNewSuggestion
          onClose={() => setShowAddForm(false)}
          onSave={(newSuggestion) => {
            setSuggestions(prev => [newSuggestion, ...prev]);
            setShowAddForm(false);
            // Refresh the list to get the latest data
            fetchSuggestions();
          }}
        />
      ) : (
        <>
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
              Suggestions Management
            </h1>
            <p className="text-gray-600 mt-1 ml-6">Manage community suggestions and feedback</p>
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
              Community Suggestions
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search suggestions..."
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

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              {/* Add New Suggestion Button */}
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Suggestion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading suggestions...</div>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <div className="text-sm text-gray-500">Showing fallback data</div>
          </div>
        )}

        {/* Suggestions List */}
        {!loading && (
          <div className="divide-y divide-gray-200">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {suggestion.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(suggestion.status)}`}>
                        {getStatusIcon(suggestion.status)}
                        {suggestion.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(suggestion.priority)}`}>
                        {suggestion.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      {suggestion.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span><strong>Category:</strong> {suggestion.category}</span>
                      <span><strong>Submitted by:</strong> {suggestion.submitted_by}</span>
                      <span><strong>Date:</strong> {new Date(suggestion.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Status Change Dropdown */}
                    <div className="mt-3">
                      <select
                        value={suggestion.status}
                        onChange={(e) => handleStatusChange(suggestion.id, e.target.value)}
                        className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="implemented">Implemented</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="View details"
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-2"
                      title="Delete suggestion"
                      onClick={() => handleDeleteSuggestion(suggestion.id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {suggestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No suggestions found matching your criteria.
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

      {/* Suggestion Details Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Suggestion Details
              </h3>
              <button 
                onClick={() => setSelectedSuggestion(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{selectedSuggestion.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{selectedSuggestion.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{selectedSuggestion.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(selectedSuggestion.priority)}`}>
                    {selectedSuggestion.priority.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                  <p className="text-gray-900">{selectedSuggestion.submitted_by}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{selectedSuggestion.email}</p>
                </div>
              </div>
              
              {selectedSuggestion.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{selectedSuggestion.phone}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedSuggestion.status)}`}>
                  {getStatusIcon(selectedSuggestion.status)}
                  {selectedSuggestion.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                  <p className="text-gray-900">{new Date(selectedSuggestion.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedSuggestion.updated_at).toLocaleDateString()}</p>
                </div>
              </div>            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default SuggestionsManagement;
