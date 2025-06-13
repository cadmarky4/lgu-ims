import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiFileText, FiFilter } from 'react-icons/fi';
import EditBarangayOfficial from './EditBarangayOfficial';
import { apiService } from '../services/api';

const BarangayOfficialsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Active Officials');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total_officials: 0,
    active_officials: 0,
    committee_heads: 0,
    upcoming_elections_days: 0
  });

  // Fetch officials data and statistics
  useEffect(() => {
    fetchOfficials();
    fetchStatistics();
  }, [currentPage, searchTerm, selectedFilter]);

  const fetchStatistics = async () => {
    try {
      const data = await apiService.getBarangayOfficialStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error fetching barangay official statistics:', err);
    }
  };
  const fetchOfficials = async () => {
    try {
      setLoading(true);
      const response = await apiService.getBarangayOfficials({
        page: currentPage,
        per_page: 15,
        search: searchTerm,
        is_active: selectedFilter === 'All Active Officials' ? true : undefined
      });
      setOfficials(response.data);
      setTotalPages(response.last_page);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching officials:', err);
      setError('Failed to load officials');
      // Fallback to static data for demo
      setOfficials([
        {
          id: 1,
          name: 'Dela Cruz, Juan',
          position: 'Barangay Captain',
          contact: '+639123456789',
          term: '2022 - 2025',
          status: 'Active',
          committee: 'Health',
          nationality: 'Filipino',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 2,
          name: 'Jose, Felicity',
          position: 'Secretary',
          contact: '+639123456789',
          term: '2022 - 2025',
          status: 'On-Leave',
          committee: 'Education',
          nationality: 'Filipino',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 3,
          name: 'Dalia, Emily',
          position: 'Kagawad',
          contact: '+639123456789',
          term: '2022 - 2025',
          status: 'Active',
          committee: 'Education',
          nationality: 'Filipino',
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 4,
          name: 'Diaz, Sebastian',
          position: 'Kagawad',
          contact: '+639123456789',
          term: '2022 - 2025',
          status: 'Active',
          committee: 'Education',
          nationality: 'Filipino',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
          id: 5,
          name: 'Sabaricos, Joe',
          position: 'Kagawad',
          contact: '+639123456789',
          term: '2022 - 2025',
          status: 'Active',
          committee: 'Education',
          nationality: 'Filipino',
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteOfficial = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this official?')) {
      try {
        await apiService.deleteBarangayOfficial(id);
        fetchOfficials(); // Refresh the list
      } catch (err) {
        console.error('Error deleting official:', err);
        alert('Failed to delete official');
      }
    }
  };

  const handleEditOfficial = (official: any) => {
    setSelectedOfficial(official);
    setShowEditForm(true);
  };

  const handleSaveOfficial = (officialData: any) => {
    console.log('Updated official data:', officialData);
    setShowEditForm(false);
    setSelectedOfficial(null);
    fetchOfficials(); // Refresh the list
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On-Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         official.committee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All Active Officials' || 
                         (selectedFilter === 'Active Only' && official.status === 'Active') ||
                         (selectedFilter === 'On Leave' && official.status === 'On-Leave') ||
                         (selectedFilter === 'Inactive' && official.status === 'Inactive');
    
    return matchesSearch && matchesFilter;
  });
  // Organizational chart data
  const captain = officials.find(official => official.position === 'Barangay Captain');
  const councilors = officials.filter(official => official.position === 'Kagawad').slice(0, 8);

  if (showEditForm) {
    return (
      <EditBarangayOfficial 
        onClose={() => {
          setShowEditForm(false);
          setSelectedOfficial(null);
        }} 
        onSave={handleSaveOfficial}
        official={selectedOfficial}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Officials Overview */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">Officials Overview</h1>
          <div className="grid grid-cols-2 gap-6">            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Officials</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_officials || 0} officials</p>
                </div>
                <div className="text-blue-600">
                  <FiUsers className="w-8 h-8" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Officials</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_officials || 0} active</p>
                </div>
                <div className="text-blue-600">
                  <FiUsers className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-600 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6 border-l-4 border-white border-opacity-30 pl-4">Quick Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => {
                console.log('Update Officers button clicked');
                setShowEditForm(true);
              }}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-md"
            >
              <FiUsers className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Update Officers</span>
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-400 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-md">
              <FiFileText className="w-5 h-5 text-white" />
              <span className="font-medium text-white">File Leave</span>
            </button>
          </div>
        </div>
      </div>      {/* Officials List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Officials List</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Officials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                title="Filter officials"
              >
                <option value="All Active Officials">All Active Officials</option>
                <option value="Active Only">Active Only</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors">
                <FiFilter className="w-4 h-4" />
                <span>Advance Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading officials...</div>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <div className="text-sm text-gray-500">Showing fallback data</div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Committee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOfficials.map((official) => (
                  <tr key={official.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={official.photo}
                        alt={official.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {official.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.term}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(official.status)}`}>
                        {official.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.committee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.nationality}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="View official details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          title="Edit official"
                          onClick={() => handleEditOfficial(official)}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Delete official"
                          onClick={() => handleDeleteOfficial(official.id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * 15) + 1} to {Math.min(currentPage * 15, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Organizational Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Organizational Chart</h2>
        </div>
        
        <div className="p-8">
          {/* Barangay Captain */}
          {captain && (
            <div className="flex flex-col items-center mb-8">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <img
                    src={captain.photo}
                    alt={captain.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{captain.name}</h3>
                <p className="text-sm text-gray-600">{captain.position}</p>
              </div>
              
              {/* Connection Line */}
              <div className="w-px h-8 bg-gray-300 mt-4"></div>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
          )}

          {/* Kagawads */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
            {councilors.map((councilor, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <img
                    src={councilor.photo}
                    alt={councilor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-medium text-gray-900 text-center">{councilor.name}</h4>
                <p className="text-xs text-gray-600 text-center">{councilor.position}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarangayOfficialsPage; 