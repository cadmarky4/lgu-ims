import React, { useState } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiUsers, FiHome, FiFilter } from 'react-icons/fi';
import AddNewHousehold from './AddNewHousehold';

const HouseholdManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All Households');
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const households = [
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps', 'Senior Citizen Assistance']
    },
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps', 'Educational Assistance']
    },
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps']
    },
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps', 'Senior Citizen Assistance']
    },
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps']
    },
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps', 'Senior Citizen Assistance']
    },
    {
      id: 'HSH-001',
      headName: 'John Doe',
      address: 'Purok 1, Block 2, San Miguel',
      ownership: 'Owned',
      members: 5,
      income: 25000,
      programs: ['4Ps', 'Senior Citizen Assistance']
    }
  ];

  const stats = [
    { title: 'Total Households', value: '40,199', icon: FiUsers },
    { title: '4Ps Households', value: '2,345', icon: FiUsers },
    { title: 'Average Household Members', value: '3,239', icon: FiUsers },
    { title: 'Low Income', value: '7,199', icon: FiUsers }
  ];

  const filterOptions = [
    'All Households',
    '4Ps Households',
    'Senior Citizen Households',
    'Low Income Households',
    'Educational Assistance',
    'Owned Properties',
    'Rented Properties'
  ];

  const filteredHouseholds = households.filter(household => {
    const matchesSearch = household.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         household.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'All Households' || 
                         (selectedFilter === '4Ps Households' && household.programs.includes('4Ps')) ||
                         (selectedFilter === 'Owned Properties' && household.ownership === 'Owned');
    
    return matchesSearch && matchesFilter;
  });

  const handleAddHousehold = (householdData: any) => {
    console.log('New household data:', householdData);
    // Here you would typically save to a database or state management system
  };

  const getProgramBadgeColor = (program: string) => {
    switch (program) {
      case '4Ps':
        return 'bg-green-100 text-green-800';
      case 'Senior Citizen Assistance':
        return 'bg-blue-100 text-blue-800';
      case 'Educational Assistance':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showAddForm) {
    return (
      <AddNewHousehold 
        onClose={() => setShowAddForm(false)} 
        onSave={handleAddHousehold}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Household Management</h1>
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

      {/* Households Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Households</h2>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search Households..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Add Button */}
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
            >
              <FiPlus className="w-4 h-4" />
              <span>Add New Household</span>
            </button>
          </div>

          {/* Filter Row */}
          <div className="flex gap-4">
            {/* Household Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              title="Filter households"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Advance Filter */}
            <button 
              onClick={() => setShowAdvanceFilter(!showAdvanceFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Advance Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Household Information</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Programs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHouseholds.map((household, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiHome className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{household.id}</div>
                        <div className="text-sm text-gray-500">{household.headName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{household.address}</div>
                    <div className="text-sm text-gray-500">{household.ownership}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {household.members} members
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {household.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {household.programs.map((program, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getProgramBadgeColor(program)}`}
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View household details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        title="Edit household"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Delete household"
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
              Showing 1 to 8 of 78 results
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

export default HouseholdManagement; 