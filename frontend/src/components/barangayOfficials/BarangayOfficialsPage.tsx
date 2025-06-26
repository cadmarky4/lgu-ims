// 1. React core
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiFilter } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// 3. Project services & types
import { barangayOfficialsService } from '@/services/officials/barangayOfficials.service';
import { STORAGE_BASE_URL } from '@/services/__shared/_storage/storage.types';

// 4. Local components
import Breadcrumb from '../_global/Breadcrumb';
// import EditBarangayOfficial from './EditBarangayOfficial';
import FileLeave from './FileLeave';

// 5. Utils
import { getStatusBadgeColor } from './utils/getStatusBadgeColor';
import { transformApiToComponent } from './utils/transformApiToComponent';

const BarangayOfficialsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Active Officials');
  // const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  // const [showOfficerSelection, setShowOfficerSelection] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<any | null>(null);
  // API state - using any for component data format
  const [officials, setOfficials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showFileLeave, setShowFileLeave] = useState(false);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Load officials data
  useEffect(() => {
    loadOfficials();
  }, []); 
  const loadOfficials = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await barangayOfficialsService.getBarangayOfficials({
        is_active: true,
        per_page: 100 // Get all active officials
      });

      // The response.data should be an array from requestAll method
      const officialsArray = Array.isArray(response.data) ? response.data : [];
      const transformedOfficials = officialsArray.map(transformApiToComponent);
      setOfficials(transformedOfficials);
    } catch (err) {
      console.error('Error loading officials:', err);
      setError('Failed to load barangay officials. Please try again.');
      setOfficials([]); // Set empty array instead of fallback
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOfficials = officials.filter(official => {
    const matchesSearch = official?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official?.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      official.committee.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter === 'All Active Officials' ||
      (selectedFilter === 'Active Only' && official?.status === 'Active') ||
      (selectedFilter === 'On Leave' && official?.status === 'On-Leave') ||
      (selectedFilter === 'Inactive' && official?.status === 'Inactive');

    return matchesSearch && matchesFilter;
  });
  // Organizational chart data
  const captain = officials.find(official => official?.position === 'Barangay Captain');
  const secretary = officials.find(official => official?.position === 'Secretary');
  const councilors = officials.filter(official => official?.position === 'Kagawad').slice(0, 8);

  const handleFileLeave = (leaveData: any) => {
    console.log('Leave application filed:', leaveData);
    // Handle the leave data submission here
  };
  
  const handleViewOfficial = (official: any) => {
    setSelectedOfficial(official);
    setShowViewModal(true);
  };

  const handleDeleteOfficial = async (official: any) => {
    if (!confirm(`Are you sure you want to delete ${official?.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      await barangayOfficialsService.deleteBarangayOfficial(official.id);
      // Reload officials data to reflect changes
      await loadOfficials();
      console.log('Official deleted successfully');
    } catch (err) {
      console.error('Error deleting official:', err);
      alert('Failed to delete official. Please try again.');
    }
  };

  // Show File Leave component
  if (showFileLeave) {
    return (
      <div className={`transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <FileLeave
          onClose={() => setShowFileLeave(false)}
          onSave={handleFileLeave}
        />
      </div>
    );
  }

  return (
    <main className={`p-6 bg-gray-50 min-h-screen flex flex-col gap-4 transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Page Header */}
      <div className={`mb-2 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '100ms' }}>
        <h1 className="text-2xl font-bold text-darktext pl-0">Barangay Officials</h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={loadOfficials}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Try again
          </button>
        </div>
      )}

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Officials Overview */}
        <div className={`lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">Officials Overview</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className={`bg-white rounded-lg p-6 border border-gray-100 shadow-sm transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '250ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Officials</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '...' : `${officials.length} officials`}
                  </p>
                </div>
                <div className="text-smblue-400">
                  <FiUsers className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className={`bg-white rounded-lg p-6 border border-gray-100 shadow-sm transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '300ms' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Elections</p>
                  <p className="text-2xl font-bold text-gray-900">To be announced</p>
                </div>
                <div className="text-smblue-400">
                  <FiUsers className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`bg-smblue-400 rounded-2xl p-6 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '350ms' }}>
          <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-white border-opacity-30 pl-4">Quick Actions</h3>
          <div className="space-y-4">            <button
            onClick={() => {
              setSelectedOfficial(null); // Set to null for creating new official
              navigate('/officials/add');
            }}
            className="cursor-pointer w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm"
          >
            <FiUsers className="w-5 h-5 text-white" />
            <span className="font-medium text-white">Add New Official</span>
          </button>
            <button
              onClick={() => {
                console.log('Update Officers button clicked');
                // setShowOfficerSelection(true);
                navigate("/officials/edit")
              }}
              className="cursor-pointer w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm hover:shadow-md"
            >
              <FiEdit className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Update Officers</span>
            </button>
          </div>
        </div>
      </div>

      {/* Officials List */}
      <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '400ms' }}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Officials List</h3>

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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
                title="Filter officials"
              >
                <option value="All Active Officials">All Active Officials</option>
                <option value="Active Only">Active Only</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-all hover:shadow-sm">
                <FiFilter className="w-4 h-4" />
                <span>Advanced Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Official</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Committee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                // Loading skeleton rows
                Array(5).fill(0).map((_, index) => (
                  <tr key={`loading-${index}`} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="ml-4">
                          <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-28"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredOfficials.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No officials found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredOfficials.map((official) => (
                  <tr key={official.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={official?.photo ? `${STORAGE_BASE_URL}/${official?.photo}` : 'https://via.placeholder.com/150'}
                          alt={official?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{official?.name}</div>
                          <div className="text-sm text-gray-500">{official.nationality}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official?.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official?.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.term}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(official?.status)}`}>
                        {official?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {official.committee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-smblue-400 hover:text-smblue-300 transition-colors"
                          title="View official details"
                          onClick={() => handleViewOfficial(official)}
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-smblue-400 hover:text-smblue-300 transition-colors"
                          title="Edit official"
                          onClick={() => navigate(`/officials/edit/${official.id}`)}
                        // onClick={() => handleEditOfficialDirect(official)}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete official"
                          onClick={() => handleDeleteOfficial(official)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Organizational Chart */}
      <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '600ms' }}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext border-l-4 border-smblue-400 pl-4">Organizational Chart</h3>
        </div>
        <div className="p-8">
          {/* Barangay Captain */}
          {captain && (
            <div className={`flex flex-col items-center mb-8 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '650ms' }}>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <img
                    src={captain?.photo ? `${STORAGE_BASE_URL}/${captain?.photo}` : 'https://via.placeholder.com/150'}
                    alt={captain?.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{captain?.name}</h3>
                <p className="text-sm text-gray-600">{captain?.position}</p>
              </div>

              {/* Connection Line */}
              <div className="w-px h-8 bg-gray-300 mt-4"></div>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
          )}

          {/* Secretary (if exists) */}
          {secretary && (
            <div className="flex flex-col items-center mb-8">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <img
                    src={secretary?.photo ? `${STORAGE_BASE_URL}/${secretary?.photo}` : 'https://via.placeholder.com/150'}
                    alt={secretary?.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-900">{secretary?.name}</h3>
                <p className="text-sm text-gray-600">{secretary?.position}</p>
              </div>

              {/* Connection Line to Kagawads */}
              <div className="w-px h-8 bg-gray-300 mt-4"></div>
              <div className="w-full h-px bg-gray-300"></div>
            </div>
          )}

          {/* Kagawads */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-6">
            {councilors.map((councilor, index) => (
              <div key={index} className={`flex flex-col items-center transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`} style={{ animationDelay: `${700 + (index * 100)}ms` }}>
                <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                  <img
                    src={councilor?.photo ? `${STORAGE_BASE_URL}/${councilor?.photo}` : 'https://via.placeholder.com/150'}
                    alt={councilor?.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h4 className="text-sm font-medium text-gray-900 text-center">{councilor?.name}</h4>
                <p className="text-xs text-gray-600 text-center">{councilor?.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BarangayOfficialsPage;

