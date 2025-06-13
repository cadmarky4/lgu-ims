import React, { useState } from 'react';
import { FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiFileText, FiFilter } from 'react-icons/fi';
import EditBarangayOfficial from './EditBarangayOfficial';

const BarangayOfficialsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Active Officials');
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  const officials = [
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
    },
    {
      id: 6,
      name: 'Orebio, David',
      position: 'Kagawad',
      contact: '+639123456789',
      term: '2022 - 2025',
      status: 'Inactive',
      committee: 'Education',
      nationality: 'Filipino',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 7,
      name: 'Fulvidar, Emerson',
      position: 'Kagawad',
      contact: '+639123456789',
      term: '2022 - 2025',
      status: 'On-Leave',
      committee: 'Education',
      nationality: 'Filipino',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 8,
      name: 'Kiniliatis, Bebe',
      position: 'Kagawad',
      contact: '+639123456789',
      term: '2022 - 2025',
      status: 'Active',
      committee: 'Education',
      nationality: 'Filipino',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 9,
      name: 'Karaniwan, Pepe',
      position: 'Kagawad',
      contact: '+639123456789',
      term: '2022 - 2025',
      status: 'Active',
      committee: 'Education',
      nationality: 'Filipino',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 10,
      name: 'Vicente, Biboy',
      position: 'Tanod',
      contact: '+639123456789',
      term: '2022 - 2025',
      status: 'Active',
      committee: 'Education',
      nationality: 'Filipino',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 11,
      name: 'Manaloto, Toribio',
      position: 'Tanod',
      contact: '+639123456789',
      term: '2022 - 2025',
      status: 'Inactive',
      committee: 'Education',
      nationality: 'Filipino',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

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

  const handleEditOfficial = (officialData: any) => {
    console.log('Updated official data:', officialData);
    // Here you would typically save to a database
  };

  if (showEditForm) {
    return (
      <EditBarangayOfficial 
        onClose={() => setShowEditForm(false)} 
        onSave={handleEditOfficial}
        official={selectedOfficial}
      />
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Barangay Officials</h1>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Officials Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">Officials Overview</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Officials</p>
                  <p className="text-2xl font-bold text-gray-900">9 officials</p>
                </div>
                <div className="text-smblue-400">
                  <FiUsers className="w-8 h-8" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
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
        <div className="bg-smblue-400 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-white border-opacity-30 pl-4">Quick Actions</h3>
          <div className="space-y-4">
            <button 
              onClick={() => {
                console.log('Update Officers button clicked');
                setShowEditForm(true);
              }}
              className="w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm"
            >
              <FiUsers className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Update Officers</span>
            </button>
            <button className="w-full bg-smblue-300 hover:bg-smblue-200 text-white p-4 rounded-lg transition-all duration-200 flex items-center space-x-3 shadow-sm">
              <FiFileText className="w-5 h-5 text-white" />
              <span className="font-medium text-white">File Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Officials List */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                title="Filter officials"
              >
                <option value="All Active Officials">All Active Officials</option>
                <option value="Active Only">Active Only</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors">
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
              {filteredOfficials.map((official) => (
                <tr key={official.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                    <img
                      src={official.photo}
                      alt={official.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{official.name}</div>
                        <div className="text-sm text-gray-500">{official.nationality}</div>
                      </div>
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-smblue-400 hover:text-smblue-300"
                        title="View official details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-smblue-400 hover:text-smblue-300"
                        title="Edit official"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Delete official"
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
      </section>

      {/* Organizational Chart */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext border-l-4 border-smblue-400 pl-4">Organizational Chart</h3>
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
      </section>
    </main>
  );
};

export default BarangayOfficialsPage; 