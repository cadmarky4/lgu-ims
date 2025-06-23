import React, { useState, useEffect } from 'react';
// import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiFileText, FiFilter, FiChevronRight } from 'react-icons/fi';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiFileText, FiFilter } from 'react-icons/fi';
import Breadcrumb from '../global/Breadcrumb'; // Import your existing breadcrumb component
import EditBarangayOfficial from './EditBarangayOfficial';
import { barangayOfficialsService } from '../../services';
import type { BarangayOfficial } from '../../services/barangayOfficials.types';
import FileLeave from './FileLeave';

const BarangayOfficialsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Active Officials');  
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showOfficerSelection, setShowOfficerSelection] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<any | null>(null);
    // API state - using any for component data format
  const [officials, setOfficials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showFileLeave, setShowFileLeave] = useState(false);
  // const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Transform API data to component format
  const transformApiToComponent = (official: BarangayOfficial) => ({
    id: official.id,
    name: `${official.last_name}, ${official.first_name}${official.middle_name ? ' ' + official.middle_name : ''}`,
    position: official?.position === 'BARANGAY_CAPTAIN' ? 'Barangay Captain' : 
              official?.position === 'KAGAWAD' ? 'Kagawad' : 
              official?.position === 'BARANGAY_SECRETARY' ? 'Secretary' : 
              official?.position,
    contact: official?.contact_number,
    term: `${new Date(official.term_start).getFullYear()} - ${new Date(official.term_end).getFullYear()}`,
    status: official?.status === 'ACTIVE' ? 'Active' : 
            official?.status === 'INACTIVE' ? 'Inactive' : 
            official?.status,
    committee: official.committee_assignment || 'None',
    nationality: 'Filipino', // Default since not in API
    photo: official.profile_photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
  });

  // Load officials data
  useEffect(() => {
    loadOfficials();
  }, []);  const loadOfficials = async () => {
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
  const handleEditOfficial = async (officialData: any) => {
    try {
      console.log('Updated official data:', officialData);
      // Reload officials data to reflect changes
      await loadOfficials();
      setShowEditForm(false);
      setSelectedOfficial(null);
    } catch (err) {
      console.error('Error handling official update:', err);
    }
  };

  const handleFileLeave = (leaveData: any) => {
    console.log('Leave application filed:', leaveData);
    // Handle the leave data submission here
  };

  const handleSelectOfficerToEdit = (official: any) => {
    // Transform component format back to API format for editing
    const apiOfficial = {
      id: official.id,
      prefix: 'Mr.', // Default - could be enhanced
      firstName: official?.name.split(', ')[1]?.split(' ')[0] || '',
      middleName: official?.name.split(', ')[1]?.split(' ')[1] || '',
      lastName: official?.name.split(', ')[0] || '',
      gender: 'Male', // Default - would need to be stored in API
      birthDate: '1985-01-01', // Default - would need to be stored in API
      contactNumber: official?.contact,
      emailAddress: '', // Default - would need to be stored in API
      completeAddress: '', // Default - would need to be stored in API
      civilStatus: 'Single', // Default - would need to be stored in API
      educationalBackground: '', // Default - would need to be stored in API
      position: official?.position === 'Barangay Captain' ? 'BARANGAY_CAPTAIN' : 
                official?.position === 'Kagawad' ? 'KAGAWAD' : 
                official?.position === 'Secretary' ? 'BARANGAY_SECRETARY' : 
                official?.position,
      committeeAssignment: official.committee !== 'None' ? official.committee : '',
      termStart: official.term.split(' - ')[0] + '-01-01',
      termEnd: official.term.split(' - ')[1] + '-12-31',
      isActive: official?.status === 'Active'
    };
    
    setSelectedOfficial(apiOfficial);
    setShowOfficerSelection(false);
    setShowEditForm(true);
  };

  const handleEditOfficialDirect = (official: any) => {
    // Transform component format back to API format for editing
    const apiOfficial = {
      id: official.id,
      prefix: 'Mr.', // Default - could be enhanced
      firstName: official?.name.split(', ')[1]?.split(' ')[0] || '',
      middleName: official?.name.split(', ')[1]?.split(' ')[1] || '',
      lastName: official?.name.split(', ')[0] || '',
      gender: 'Male', // Default - would need to be stored in API
      birthDate: '1985-01-01', // Default - would need to be stored in API
      contactNumber: official?.contact,
      emailAddress: '', // Default - would need to be stored in API
      completeAddress: '', // Default - would need to be stored in API
      civilStatus: 'Single', // Default - would need to be stored in API
      educationalBackground: '', // Default - would need to be stored in API
      position: official?.position === 'Barangay Captain' ? 'BARANGAY_CAPTAIN' : 
                official?.position === 'Kagawad' ? 'KAGAWAD' : 
                official?.position === 'Secretary' ? 'BARANGAY_SECRETARY' : 
                official?.position,
      committeeAssignment: official.committee !== 'None' ? official.committee : '',
      termStart: official.term.split(' - ')[0] + '-01-01',
      termEnd: official.term.split(' - ')[1] + '-12-31',
      isActive: official?.status === 'Active'
    };
    
    setSelectedOfficial(apiOfficial);
    setShowEditForm(true);
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

  // Show Edit Form component
  if (showEditForm) {
    return (
      <div className={`transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <EditBarangayOfficial 
          onClose={() => setShowEditForm(false)} 
          onSave={handleEditOfficial}
          official={selectedOfficial}
        />
      </div>
    );
  }

  // Show Officer Selection component
  if (showOfficerSelection) {
    return (
      <main className={`p-6 bg-gray-50 min-h-screen flex flex-col gap-4 transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Breadcrumb */}
        <Breadcrumb isLoaded={isLoaded} />
        
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-darktext pl-0">Official Details</h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed information about {selectedOfficial?.name}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Photo */}
            <div className="lg:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <img
                    src={selectedOfficial?.photo}
                    alt={selectedOfficial?.name}
                    className="w-48 h-48 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">{selectedOfficial?.name}</h2>
                <p className="text-lg text-gray-600 text-center">{selectedOfficial?.position}</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getStatusBadgeColor(selectedOfficial?.status)}`}>
                  {selectedOfficial?.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.contact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nationality</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.nationality}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Position Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Committee Assignment</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.committee}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Term</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.term}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditOfficialDirect(selectedOfficial);
                }}
                className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors flex items-center space-x-2"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit Official</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // View Official Modal
  if (showViewModal && selectedOfficial) {
    return (
      <main className={`p-6 bg-gray-50 min-h-screen flex flex-col gap-4 transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Breadcrumb */}
        <Breadcrumb isLoaded={isLoaded} />
        
        {/* Header */}
        <div className={`mb-2 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '100ms' }}>
          <h1 className="text-2xl font-bold text-darktext pl-0">Official Details</h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed information about {selectedOfficial?.name}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Profile Photo */}
            <div className="lg:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                  <img
                    src={selectedOfficial?.photo}
                    alt={selectedOfficial?.name}
                    className="w-48 h-48 rounded-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center">{selectedOfficial?.name}</h2>
                <p className="text-lg text-gray-600 text-center">{selectedOfficial?.position}</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-2 ${getStatusBadgeColor(selectedOfficial?.status)}`}>
                  {selectedOfficial?.status}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="lg:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Contact Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.contact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nationality</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.nationality}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Position Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Committee Assignment</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.committee}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Term</label>
                      <p className="text-sm text-gray-900">{selectedOfficial?.term}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-8">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditOfficialDirect(selectedOfficial);
                }}
                className="px-6 py-2 bg-smblue-400 text-white rounded-lg hover:bg-smblue-300 transition-colors flex items-center space-x-2"
              >
                <FiEdit className="w-4 h-4" />
                <span>Edit Official</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show Officer Selection component
  if (showOfficerSelection) {
    return (
      <main className={`p-6 bg-gray-50 min-h-screen flex flex-col gap-4 transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Breadcrumb */}
        <Breadcrumb isLoaded={isLoaded} />
        
        {/* Header */}
        <div className={`mb-2 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '100ms' }}>
          <h1 className="text-2xl font-bold text-darktext pl-0">Select Officer to Edit</h1>
          <p className="text-sm text-gray-600 mt-1">Choose which barangay official you want to update</p>
        </div>

        {/* Search Bar */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for an official to edit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 transition-all"
            />
          </div>
        </div>

        {/* Officials Grid */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '300ms' }}>
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">
            Available Officials ({filteredOfficials.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOfficials.map((official, index) => (
              <div
                key={official.id}
                onClick={() => handleSelectOfficerToEdit(official)}
                className={`border border-gray-200 rounded-lg p-4 hover:border-smblue-400 hover:shadow-md transition-all duration-200 cursor-pointer group transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ animationDelay: `${400 + (index * 50)}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={official?.photo}
                    alt={official?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-smblue-400 transition-colors">
                      {official?.name}
                    </h4>
                    <p className="text-sm text-gray-600">{official?.position}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(official?.status)}`}>
                        {official?.status}
                      </span>
                      <span className="text-xs text-gray-500">{official.committee}</span>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-smblue-400 transition-colors">
                    <FiEdit className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOfficials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No officials found matching your search.</p>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className={`flex justify-start transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '500ms' }}>
          <button
            onClick={() => setShowOfficerSelection(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors hover:shadow-sm"
          >
            Back to Officials Page
          </button>
        </div>      </main>
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
                  <p className="text-2xl font-bold text-gray-900">1,051 days</p>
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
                setShowEditForm(true);
              }}
              className="w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm"
            >
              <FiUsers className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Add New Official</span>
            </button>
            <button 
              onClick={() => {
                console.log('Update Officers button clicked');
                setShowOfficerSelection(true);
              }}
              className="w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm hover:shadow-md"
            >
              <FiEdit className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Update Officers</span>
            </button>
            {/* ADRIAN VERSION */}
            <button 
              onClick={loadOfficials}
              disabled={isLoading}
              className="w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FiFileText className="w-5 h-5 text-white" />
              )}
              <span className="font-medium text-white">
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </span>
            </button>

          {/* SEAN VERSION */}
            <button 
              onClick={() => {
                console.log('File Leave button clicked');
                setShowFileLeave(true);
              }}
              className="w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm hover:shadow-md"
            >
              <FiFileText className="w-5 h-5 text-white" />
              <span className="font-medium text-white">File Leave</span>
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
            </thead>            <tbody className="bg-white divide-y divide-gray-200">
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
                        src={official?.photo}
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
                        onClick={() => handleSelectOfficerToEdit(official)}
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
                    src={captain?.photo}
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
                    src={secretary?.photo}
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
                    src={councilor?.photo}
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

