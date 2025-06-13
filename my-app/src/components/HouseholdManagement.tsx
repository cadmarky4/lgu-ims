import React, { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye, FiFilter } from 'react-icons/fi';
import { FaUsers, FaHome, FaUserFriends, FaDollarSign } from 'react-icons/fa';
import AddNewHousehold from './AddNewHousehold';
import EditHousehold from './EditHousehold';
import ViewHousehold from './ViewHousehold';
import StatCard from './StatCard';

const HouseholdManagement: React.FC = () => {
  // API integration states
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('All Households');
  const [showAdvanceFilter, setShowAdvanceFilter] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState<any>(null);

  const [households, setHouseholds] = useState<any[]>([]);

  // Fetch households on component mount
  useEffect(() => {
    const fetchHouseholds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Backend developer - replace with actual endpoint
        // const response = await fetch('/api/households');
        // const data = await response.json();
        // 
        // if (response.ok) {
        //   setHouseholds(data);
        // } else {
        //   throw new Error('Failed to fetch households');
        // }

        // For now, using mock data
        const mockHouseholds = [
          {
            id: 'HSH-001',
            headName: 'Juan Dela Cruz',
            address: 'Purok 1, Block 2, San Miguel',
            ownership: 'Owned',
            members: 5,
            income: 25000,
            programs: ['4Ps', 'Senior Citizen Assistance']
          },
          {
            id: 'HSH-002',
            headName: 'Maria Santos',
            address: 'Purok 3, Sitio Maligaya, Poblacion',
            ownership: 'Rented',
            members: 3,
            income: 18000,
            programs: ['4Ps', 'Educational Assistance']
          },
          {
            id: 'HSH-003',
            headName: 'Roberto Garcia',
            address: 'Purok 2, Block 1, Santo Domingo',
            ownership: 'Owned',
            members: 4,
            income: 32000,
            programs: ['Senior Citizen Assistance']
          },
          {
            id: 'HSH-004',
            headName: 'Ana Reyes',
            address: 'Purok 4, Sitio Bagong Silang, San Miguel',
            ownership: 'Shared',
            members: 6,
            income: 15000,
            programs: ['4Ps', 'Educational Assistance']
          },
          {
            id: 'HSH-005',
            headName: 'Pedro Villanueva',
            address: 'Purok 1, Block 3, Poblacion',
            ownership: 'Owned',
            members: 2,
            income: 45000,
            programs: []
          },
          {
            id: 'HSH-006',
            headName: 'Carmen Lopez',
            address: 'Purok 2, Sitio Riverside, Santo Domingo',
            ownership: 'Rented',
            members: 7,
            income: 22000,
            programs: ['4Ps', 'Senior Citizen Assistance']
          },
          {
            id: 'HSH-007',
            headName: 'Miguel Torres',
            address: 'Purok 3, Block 4, San Miguel',
            ownership: 'Owned',
            members: 4,
            income: 28000,
            programs: ['Educational Assistance']
          }
        ];

        setHouseholds(mockHouseholds);

      } catch (err) {
        setError('Failed to load households. Please try again.');
        console.error('Error fetching households:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHouseholds();
  }, []);

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
    const newHousehold = {
      id: `HSH-${String(households.length + 1).padStart(3, '0')}`,
      headName: householdData.householdHeadSearch || 'New Head',
      address: householdData.completeAddress || 'No address provided',
      ownership: householdData.ownershipStatus || 'Not specified',
      members: 1,
      income: parseInt(householdData.monthlyIncome) || 0,
      programs: [] as string[]
    };

    // Add programs based on classification
    if (householdData.householdClassification?.fourPsBeneficiary) {
      newHousehold.programs.push('4Ps');
    }
    if (householdData.householdClassification?.hasSeniorCitizen) {
      newHousehold.programs.push('Senior Citizen Assistance');
    }

    setHouseholds(prev => [...prev, newHousehold]);
    console.log('New household added:', newHousehold);
  };

  const handleEditHousehold = (householdData: any) => {
    setHouseholds(prev => prev.map(household => 
      household.id === householdData.id 
        ? {
            ...household,
            headName: householdData.householdHeadSearch || household.headName,
            address: householdData.completeAddress || household.address,
            ownership: householdData.ownershipStatus || household.ownership,
            income: parseInt(householdData.monthlyIncome) || household.income,
            programs: [
              ...(householdData.householdClassification?.fourPsBeneficiary ? ['4Ps'] : []),
              ...(householdData.householdClassification?.hasSeniorCitizen ? ['Senior Citizen Assistance'] : [])
            ]
          }
        : household
    ));
    console.log('Household updated:', householdData);
  };

  const handleDeleteHousehold = async (household: any) => {
    if (window.confirm(`Are you sure you want to delete household ${household.id}?`)) {
      setIsDeleting(household.id);
      setError(null);
      
      try {
        // TODO: Backend developer - replace with actual endpoint
        // const response = await fetch(`/api/households/${household.id}`, {
        //   method: 'DELETE'
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Failed to delete household');
        // }

        // For now, using client-side delete
        setHouseholds(prev => prev.filter(h => h.id !== household.id));
        console.log('Household deleted:', household.id);

      } catch (err) {
        setError('Failed to delete household. Please try again.');
        console.error('Error deleting household:', err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const openEditForm = (household: any) => {
    setSelectedHousehold(household);
    setShowEditForm(true);
  };

  const openViewForm = (household: any) => {
    setSelectedHousehold(household);
    setShowViewForm(true);
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

  if (showEditForm && selectedHousehold) {
    return (
      <EditHousehold 
        household={selectedHousehold}
        onClose={() => {
          setShowEditForm(false);
          setSelectedHousehold(null);
        }} 
        onSave={handleEditHousehold}
      />
    );
  }

  if (showViewForm && selectedHousehold) {
    return (
      <ViewHousehold 
        household={selectedHousehold}
        onClose={() => {
          setShowViewForm(false);
          setSelectedHousehold(null);
        }}
      />
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Household Management</h1>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800 text-sm">Loading households...</p>
        </div>
      )}

      {/* Statistics Overview */}
      <section className="w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            title="Total Households" 
            value={40199} 
            icon={FaHome}
          />
          <StatCard 
            title="4Ps Households" 
            value={2345} 
            icon={FaUsers}
          />
          <StatCard 
            title="Average Household Members" 
            value={4.2} 
            icon={FaUserFriends}
          />
          <StatCard 
            title="Low Income Households" 
            value={7199} 
            icon={FaDollarSign}
          />
              </div>
      </section>

      {/* Households Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Households</h3>
          
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
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              />
            </div>
            
            {/* Add Button */}
            <button 
              onClick={() => setShowAddForm(true)}
              className="bg-smblue-400 hover:bg-smblue-300 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
              title="Filter households"
            >
              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Advanced Filter Toggle */}
            <button 
              onClick={() => setShowAdvanceFilter(!showAdvanceFilter)}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <FiFilter className="w-4 h-4" />
              <span>Advanced Filter</span>
            </button>
          </div>
        </div>

        {/* Advanced Filter Panel */}
        {showAdvanceFilter && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Range</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  title="Filter by income range"
                >
                  <option>All Income Levels</option>
                  <option>Below ₱15,000</option>
                  <option>₱15,000 - ₱30,000</option>
                  <option>Above ₱30,000</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Household Size</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  title="Filter by household size"
                >
                  <option>All Sizes</option>
                  <option>1-2 members</option>
                  <option>3-5 members</option>
                  <option>6+ members</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Ownership</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200"
                  title="Filter by property ownership"
                >
                  <option>All Types</option>
                  <option>Owned</option>
                  <option>Rented</option>
                  <option>Shared</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Household ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head of Family</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {household.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {household.headName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {household.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {household.members} members
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{household.income.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {household.programs.map((program, programIndex) => (
                        <span
                          key={programIndex}
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
                        onClick={() => openViewForm(household)}
                        className="text-smblue-400 hover:text-smblue-300"
                        title="View household details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openEditForm(household)}
                        className="text-smblue-400 hover:text-smblue-300"
                        title="Edit household"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteHousehold(household)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        title="Delete household"
                        disabled={isDeleting === household.id}
                      >
                        {isDeleting === household.id ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
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
              Showing 1 to {filteredHouseholds.length} of {households.length} results
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

export default HouseholdManagement; 