import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiUsers } from 'react-icons/fi';
import AddNewResident from './AddNewResident';

const ResidentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const residents = [
    {
      id: 1,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 4,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 5,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 6,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Inactive',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 7,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 8,
      name: 'Maria Santos',
      age: 34,
      gender: 'Female',
      phone: '+63-945-890-9999',
      email: 'maria.santos@gmail.com',
      address: 'Purok 1, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const stats = [
    { title: 'Total Residents', value: '40,199', icon: FiUsers, bgColor: 'bg-green-50' },
    { title: 'PWD', value: '2,345', icon: FiUsers, bgColor: 'bg-green-50' },
    { title: 'Senior Citizens', value: '3,239', icon: FiUsers, bgColor: 'bg-green-50' },
    { title: 'Children', value: '7,199', icon: FiUsers, bgColor: 'bg-green-50' }
  ];

  const handleAddResident = (residentData: any) => {
    console.log('New resident data:', residentData);
    // Here you would typically save to a database
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
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-100`}>
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

        {/* Table */}
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
                        src={resident.photo}
                        alt={resident.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{resident.name}</div>
                        <div className="text-sm text-gray-500">{resident.age} years old, {resident.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{resident.phone}</div>
                    <div className="text-sm text-gray-500">{resident.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {resident.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      resident.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resident.status}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to 15 of 257 results
            </div>
            <div className="flex items-center space-x-2">
              <button 
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[1, 2, 3, 4].map((page) => (
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
              ))}
              <button 
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentManagement; 