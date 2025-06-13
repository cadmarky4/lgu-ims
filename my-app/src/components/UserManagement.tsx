import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiUserCheck, FiShield, FiUserPlus, FiLock, FiPower } from 'react-icons/fi';
import AddNewUser from './AddNewUser';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const users = [
    {
      id: 1,
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'juan.delacruz@barangay.gov.ph',
      username: 'jdelacruz',
      role: 'ADMIN',
      department: 'Administration',
      status: 'Active',
      lastLogin: '2024-01-15 09:30 AM',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'maria.santos@barangay.gov.ph',
      username: 'msantos',
      role: 'BARANGAY_SECRETARY',
      department: 'Secretary Office',
      status: 'Active',
      lastLogin: '2024-01-15 08:45 AM',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      firstName: 'Roberto',
      lastName: 'Garcia',
      email: 'roberto.garcia@barangay.gov.ph',
      username: 'rgarcia',
      role: 'BARANGAY_CAPTAIN',
      department: 'Executive Office',
      status: 'Active',
      lastLogin: '2024-01-14 04:20 PM',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 4,
      firstName: 'Ana',
      lastName: 'Rodriguez',
      email: 'ana.rodriguez@barangay.gov.ph',
      username: 'arodriguez',
      role: 'STAFF',
      department: 'Records Office',
      status: 'Active',
      lastLogin: '2024-01-15 07:15 AM',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 5,
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@barangay.gov.ph',
      username: 'cmendoza',
      role: 'KAGAWAD',
      department: 'Council',
      status: 'Inactive',
      lastLogin: '2024-01-10 11:30 AM',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 6,
      firstName: 'Sofia',
      lastName: 'Reyes',
      email: 'sofia.reyes@barangay.gov.ph',
      username: 'sreyes',
      role: 'BARANGAY_TREASURER',
      department: 'Treasury Office',
      status: 'Active',
      lastLogin: '2024-01-15 10:00 AM',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 7,
      firstName: 'Miguel',
      lastName: 'Torres',
      email: 'miguel.torres@barangay.gov.ph',
      username: 'mtorres',
      role: 'USER',
      department: 'General Staff',
      status: 'Pending',
      lastLogin: 'Never logged in',
      photo: 'https://images.unsplash.com/photo-1522075469751-3847ee75b94e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 8,
      firstName: 'Isabella',
      lastName: 'Cruz',
      email: 'isabella.cruz@barangay.gov.ph',
      username: 'icruz',
      role: 'SK_CHAIRPERSON',
      department: 'SK Office',
      status: 'Active',
      lastLogin: '2024-01-15 06:45 AM',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const stats = [
    { title: 'Total Users', value: '156', icon: FiUsers },
    { title: 'Active Users', value: '142', icon: FiUserCheck },
    { title: 'Administrators', value: '8', icon: FiShield },
    { title: 'New This Month', value: '12', icon: FiUserPlus }
  ];

  const getRoleBadgeColor = (role: string) => {
    const colors: { [key: string]: string } = {
      'SUPER_ADMIN': 'bg-red-100 text-red-800',
      'ADMIN': 'bg-purple-100 text-purple-800',
      'BARANGAY_CAPTAIN': 'bg-blue-100 text-blue-800',
      'BARANGAY_SECRETARY': 'bg-green-100 text-green-800',
      'BARANGAY_TREASURER': 'bg-yellow-100 text-yellow-800',
      'KAGAWAD': 'bg-indigo-100 text-indigo-800',
      'SK_CHAIRPERSON': 'bg-pink-100 text-pink-800',
      'SK_KAGAWAD': 'bg-cyan-100 text-cyan-800',
      'STAFF': 'bg-gray-100 text-gray-800',
      'USER': 'bg-slate-100 text-slate-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatRoleName = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleAddUser = (userData: any) => {
    console.log('New user data:', userData);
    // Here you would typically save to a database
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    const matchesStatus = statusFilter === '' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (showAddForm) {
    return (
      <AddNewUser 
        onClose={() => setShowAddForm(false)} 
        onSave={handleAddUser}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 pl-0">User Management</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {stats.map((stat, index) => (
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

      {/* Users Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">System Users</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-label="Filter by role"
              >
                <option value="">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="BARANGAY_CAPTAIN">Barangay Captain</option>
                <option value="BARANGAY_SECRETARY">Barangay Secretary</option>
                <option value="BARANGAY_TREASURER">Barangay Treasurer</option>
                <option value="KAGAWAD">Kagawad</option>
                <option value="SK_CHAIRPERSON">SK Chairperson</option>
                <option value="SK_KAGAWAD">SK Kagawad</option>
                <option value="STAFF">Staff</option>
                <option value="USER">User</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                aria-label="Filter by status"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>

              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New User</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role & Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.photo}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {formatRoleName(user.role)}
                      </span>
                      <div className="text-sm text-gray-500">{user.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50" title="View user details">
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50" title="Edit user">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900 p-1 rounded-md hover:bg-orange-50" title="Reset password">
                        <FiLock className="w-4 h-4" />
                      </button>
                      <button className={`p-1 rounded-md ${user.status === 'Active' ? 'text-red-600 hover:text-red-900 hover:bg-red-50' : 'text-green-600 hover:text-green-900 hover:bg-green-50'}`} title={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}>
                        <FiPower className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50" title="Delete user">
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
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredUsers.length}</span> of{' '}
              <span className="font-medium">{filteredUsers.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md">
                1
              </button>
              <button
                disabled={true}
                className="px-3 py-1 text-sm text-gray-500 border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default UserManagement; 