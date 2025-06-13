import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { FaUsers, FaWheelchair, FaUserFriends, FaChild } from 'react-icons/fa';
import AddNewResident from './AddNewResident';
import EditResident from './EditResident';
import ViewResident from './ViewResident';
import StatCard from './StatCard';

const ResidentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [selectedResident, setSelectedResident] = useState<any>(null);

  const [residents, setResidents] = useState([
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
      name: 'Juan Dela Cruz',
      age: 42,
      gender: 'Male',
      phone: '+63-917-123-4567',
      email: 'juan.delacruz@yahoo.com',
      address: 'Purok 2, Poblacion',
      category: 'Regular',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Ana Reyes',
      age: 28,
      gender: 'Female',
      phone: '+63-922-987-6543',
      email: 'ana.reyes@outlook.com',
      address: 'Purok 3, Santo Domingo',
      category: '4Ps Beneficiary',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 4,
      name: 'Roberto Garcia',
      age: 55,
      gender: 'Male',
      phone: '+63-939-555-7890',
      email: 'roberto.garcia@gmail.com',
      address: 'Purok 1, Block 3, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 5,
      name: 'Carmen Lopez',
      age: 31,
      gender: 'Female',
      phone: '+63-956-111-2222',
      email: 'carmen.lopez@gmail.com',
      address: 'Purok 4, Sitio Maligaya, Poblacion',
      category: 'PWD',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 6,
      name: 'Pedro Villanueva',
      age: 39,
      gender: 'Male',
      phone: '+63-915-333-4444',
      email: 'pedro.v@yahoo.com',
      address: 'Purok 2, Block 1, Santo Domingo',
      category: 'Regular',
      status: 'Inactive',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 7,
      name: 'Luz Mendoza',
      age: 67,
      gender: 'Female',
      phone: '+63-928-777-8888',
      email: 'luz.mendoza@hotmail.com',
      address: 'Purok 3, Block 2, San Miguel',
      category: 'Senior Citizen',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 8,
      name: 'Miguel Torres',
      age: 26,
      gender: 'Male',
      phone: '+63-943-999-0000',
      email: 'miguel.torres@gmail.com',
      address: 'Purok 1, Sitio Bagong Silang, Poblacion',
      category: '4Ps Beneficiary',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    }
  ]);

  const handleAddResident = (residentData: any) => {
    console.log('New resident data:', residentData);
    
    // Create new resident object with proper structure
    const newResident = {
      id: residents.length + 1, // Simple ID generation
      name: `${residentData.firstName} ${residentData.lastName}`,
      age: parseInt(residentData.age) || 0,
      gender: residentData.gender,
      phone: residentData.mobileNumber,
      email: residentData.emailAddress,
      address: residentData.completeAddress,
      category: residentData.specialClassifications?.seniorCitizen ? 'Senior Citizen' : 'Regular',
      status: 'Active',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    };
    
    // Add to residents array
    setResidents(prev => [...prev, newResident]);
    
    // Here you would typically save to a database
  };

  const handleEditResident = (residentData: any) => {
    console.log('Updated resident data:', residentData);
    
    // Update resident in the array
    const updatedResident = {
      id: residentData.id,
      name: `${residentData.firstName} ${residentData.lastName}`,
      age: parseInt(residentData.age) || 0,
      gender: residentData.gender,
      phone: residentData.mobileNumber,
      email: residentData.emailAddress,
      address: residentData.completeAddress,
      category: residentData.specialClassifications?.seniorCitizen ? 'Senior Citizen' : 'Regular',
      status: 'Active',
      photo: selectedResident?.photo || 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    };
    
    // Update the residents array
    setResidents(prev => prev.map(resident => 
      resident.id === residentData.id ? updatedResident : resident
    ));
    
    // Here you would typically update the database
    setShowEditForm(false);
    setSelectedResident(null);
  };

  const openEditForm = (resident: any) => {
    setSelectedResident(resident);
    setShowEditForm(true);
  };

  const openViewForm = (resident: any) => {
    setSelectedResident(resident);
    setShowViewForm(true);
  };

  const handleDeleteResident = (residentId: number) => {
    if (window.confirm('Are you sure you want to delete this resident? This action cannot be undone.')) {
      setResidents(prev => prev.filter(resident => resident.id !== residentId));
      console.log('Deleted resident with ID:', residentId);
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

  if (showEditForm && selectedResident) {
    return (
      <EditResident 
        resident={selectedResident}
        onClose={() => {
          setShowEditForm(false);
          setSelectedResident(null);
        }} 
        onSave={handleEditResident}
      />
    );
  }

  if (showViewForm && selectedResident) {
    return (
      <ViewResident 
        resident={selectedResident}
        onClose={() => {
          setShowViewForm(false);
          setSelectedResident(null);
        }} 
      />
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Resident Management</h1>
      </div>

      {/* Statistics Overview */}
      <section className="w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            title="Total Residents" 
            value={40199} 
            icon={FaUsers}
          />
          <StatCard 
            title="PWD" 
            value={2345} 
            icon={FaWheelchair}
          />
          <StatCard 
            title="Senior Citizens" 
            value={3239} 
            icon={FaUserFriends}
          />
          <StatCard 
            title="Children" 
            value={7199} 
            icon={FaChild}
          />
        </div>
      </section>

      {/* Residents Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Residents</h3>
          
          {/* Search and Add Button */}
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Residents by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              className="ml-4 bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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
                        className="text-smblue-400 hover:text-smblue-300"
                        title="View resident details"
                        onClick={() => openViewForm(resident)}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-smblue-400 hover:text-smblue-300"
                        title="Edit resident"
                        onClick={() => openEditForm(resident)}
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
                      ? 'bg-smblue-400 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button 
                className="px-3 py-1 text-sm bg-smblue-400 text-white rounded hover:bg-smblue-300"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResidentManagement; 