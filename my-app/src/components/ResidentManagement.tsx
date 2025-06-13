import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';
import AddNewResident from './AddNewResident';
import { apiService } from '../services/api';

const ResidentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total_residents: 0,
    male_residents: 0,
    female_residents: 0,
    senior_citizens: 0,
    pwd_members: 0,
    four_ps_beneficiaries: 0,
    household_heads: 0
  });

  // Fetch residents data
  useEffect(() => {
    fetchResidents();
    fetchStatistics();
  }, [currentPage, searchTerm]);

  const fetchStatistics = async () => {
    try {
      const data = await apiService.getResidentStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error fetching resident statistics:', err);
      // Keep default values on error
    }
  };

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getResidents({
        page: currentPage,
        per_page: 15,
        search: searchTerm
      });
      setResidents(response.data);
      setTotalPages(response.last_page);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching residents:', err);
      setError('Failed to load residents');      // Fallback to static data for demo
      setResidents([
        {
          id: 1,
          first_name: 'Maria',
          last_name: 'Santos',
          age: 34,
          gender: 'Female',
          mobile_number: '+63-945-890-9999',
          email_address: 'maria.santos@gmail.com',
          complete_address: 'Purok 1, San Miguel',
          category: 'Senior Citizen',
          status: 'Active',
          photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResident = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await apiService.deleteResident(id);
        fetchResidents(); // Refresh the list
      } catch (err) {
        console.error('Error deleting resident:', err);
        alert('Failed to delete resident');
      }
    }
  };  const statsCards = [
    { title: 'Total Residents', value: (stats.total_residents || 0).toString(), icon: FiUsers },
    { title: 'PWD', value: (stats.pwd_members || 0).toString(), icon: FiUsers },
    { title: 'Senior Citizens', value: (stats.senior_citizens || 0).toString(), icon: FiUsers },
    { title: '4Ps Beneficiaries', value: (stats.four_ps_beneficiaries || 0).toString(), icon: FiUsers }
  ];

  const handleAddResident = async (residentData: any) => {
    try {
      await apiService.createResident(residentData);
      setShowAddForm(false);
      fetchResidents(); // Refresh the list
    } catch (err) {
      console.error('Error creating resident:', err);
      alert('Failed to create resident');
    }
  };

  if (showAddForm) {
    return (
      <AddNewResident 
        onClose={() => setShowAddForm(false)} 
        onSave={handleAddResident}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Resident Management</h1>
      </div>      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-blue-600">
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Residents Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Residents</h2>
          
          {/* Search and Add Button */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Residents by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Resident</span>
            </button>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading residents...</div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Information</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {residents.map((resident) => (
                  <tr key={resident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={resident.photo || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'}
                          alt={resident.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{resident.name || `${resident.first_name} ${resident.last_name}`}</div>
                          <div className="text-sm text-gray-500">{resident.age} years old, {resident.gender}</div>
                        </div>
                      </div>
                    </td>                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{resident.mobile_number || resident.telephone_number}</div>
                      <div className="text-sm text-gray-500">{resident.email_address}</div>
                    </td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resident.complete_address || `${resident.house_number ? resident.house_number + ' ' : ''}${resident.street ? resident.street + ', ' : ''}${resident.purok || ''}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {resident.category || 'Regular'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ 
                        (resident.status === 'Active' || resident.status === 'active')
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {resident.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900"
                          title="View resident details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900"
                          title="Edit resident"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          title="Delete resident"
                          onClick={() => handleDeleteResident(resident.id)}
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
        {!loading && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * 15 + 1, totalCount)} to {Math.min(currentPage * 15, totalCount)} of {totalCount} results
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
    </div>
  );
};

export default ResidentManagement;