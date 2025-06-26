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
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../_global/NotificationSystem';
import { useDebounce } from '@/hooks/useDebounce';
import type { BarangayOfficial, BarangayOfficialParams } from '@/services/officials/barangayOfficials.types';
import { useBarangayOfficials, useDeleteBarangayOfficial } from '@/services/officials/useBarangayOfficials';
import { BarangayOfficialsStatistics } from './_components/BarangayOfficialsStatistics';
import { BarangayOfficialsQuickActions } from './_components/BarangayOfficialsQuickActions';
import { BarangayOfficialsSearch } from './_components/BarangayOfficialsSearch';
import { BarangayOfficialsTable } from './_components/BarangayOfficialsTable';
import { OrganizationalChart } from './_components/OrganizationalChart';

const BarangayOfficialsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Notification
  const { showNotification } = useNotifications();
  
  // Local state
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // QUery parameters
  const queryParams: BarangayOfficialParams = {
    page: currentPage,
    per_page: 15,
    search: debouncedSearchTerm
  }

  // Queries and mutations
  const {
    data: barangayOfficialsData,
    isLoading,
    error,
    refetch
  } = useBarangayOfficials(queryParams)

  const deleteBarangayOfficial = useDeleteBarangayOfficial();
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddNew = () => {
    navigate('/officials/add');
  };

  const handleView = (official: BarangayOfficial) => {
    navigate(`/officials/view/${official.id}`);
  };
  
  const handleEditOfficialsList = () => {
    navigate(`/officials/edit`);
  };

  const handleEdit = (official: BarangayOfficial) => {
    navigate(`/officials/edit/${official.id}`)
  };

  const handleDelete = async (official: BarangayOfficial) => {
    if (window.confirm(t('barangayOfficials.messages.deleteConfirm'))) {
      try {
        await deleteBarangayOfficial.mutateAsync(official.id);
        showNotification({
          type: 'success',
          title: t('barangayOfficials.messages.deleteSuccess'),
          message: t('barangayOfficials.messages.deleteSuccess'),
          duration: 3000,
          persistent: false
        });
        refetch(); // Refresh the data
      } catch (error) {
        console.error('Delete error:', error);

        showNotification({
          type: 'error',
          title: t('barangayOfficials.messages.deleteError'),
          message: t('barangayOfficials.messages.deleteError'),
          duration: 3000,
          persistent: false
        });
      }
    }
  };

  // Prepare data
  const barangayOfficials = barangayOfficialsData?.data || [];
  const pagination = barangayOfficialsData ? {
    current_page: barangayOfficialsData.current_page,
    last_page: barangayOfficialsData.last_page,
    per_page: barangayOfficialsData.per_page,
    total: barangayOfficialsData.total,
  } : {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  }

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset to first page when search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm, searchTerm]);

  // const [searchTerm, setSearchTerm] = useState('');
  // const [selectedFilter, setSelectedFilter] = useState('All Active Officials');
  // // const [showEditForm, setShowEditForm] = useState(false);
  // const [showViewModal, setShowViewModal] = useState(false);
  // // const [showOfficerSelection, setShowOfficerSelection] = useState(false);
  // const [selectedOfficial, setSelectedOfficial] = useState<any | null>(null);
  // // API state - using any for component data format
  // const [officials, setOfficials] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // const [showFileLeave, setShowFileLeave] = useState(false);
  // const navigate = useNavigate();
  // const [isLoaded, setIsLoaded] = useState(false);

  // // Animation trigger on component mount
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoaded(true);
  //   }, 100);
  //   return () => clearTimeout(timer);
  // }, []);

  // // Load officials data
  // useEffect(() => {
  //   loadOfficials();
  // }, []); 
  // const loadOfficials = async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
  //     const response = await barangayOfficialsService.getBarangayOfficials({
  //       is_active: true,
  //       per_page: 100 // Get all active officials
  //     });

  //     // The response.data should be an array from requestAll method
  //     const officialsArray = Array.isArray(response.data) ? response.data : [];
  //     const transformedOfficials = officialsArray.map(transformApiToComponent);
  //     setOfficials(transformedOfficials);
  //   } catch (err) {
  //     console.error('Error loading officials:', err);
  //     setError('Failed to load barangay officials. Please try again.');
  //     setOfficials([]); // Set empty array instead of fallback
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const filteredOfficials = officials.filter(official => {
  //   const matchesSearch = official?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     official?.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     official.committee.toLowerCase().includes(searchTerm.toLowerCase());

  //   const matchesFilter = selectedFilter === 'All Active Officials' ||
  //     (selectedFilter === 'Active Only' && official?.status === 'Active') ||
  //     (selectedFilter === 'On Leave' && official?.status === 'On-Leave') ||
  //     (selectedFilter === 'Inactive' && official?.status === 'Inactive');

  //   return matchesSearch && matchesFilter;
  // });
  // // Organizational chart data
  // const captain = officials.find(official => official?.position === 'Barangay Captain');
  // const secretary = officials.find(official => official?.position === 'Secretary');
  // const councilors = officials.filter(official => official?.position === 'Kagawad').slice(0, 8);

  // const handleFileLeave = (leaveData: any) => {
  //   console.log('Leave application filed:', leaveData);
  //   // Handle the leave data submission here
  // };
  
  // const handleViewOfficial = (official: any) => {
  //   setSelectedOfficial(official);
  //   setShowViewModal(true);
  // };

  // const handleDeleteOfficial = async (official: any) => {
  //   if (!confirm(`Are you sure you want to delete ${official?.name}? This action cannot be undone.`)) {
  //     return;
  //   }

  //   try {
  //     await barangayOfficialsService.deleteBarangayOfficial(official.id);
  //     // Reload officials data to reflect changes
  //     await loadOfficials();
  //     console.log('Official deleted successfully');
  //   } catch (err) {
  //     console.error('Error deleting official:', err);
  //     alert('Failed to delete official. Please try again.');
  //   }
  // };

  // // Show File Leave component
  // if (showFileLeave) {
  //   return (
  //     <div className={`transition-all duration-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
  //       <FileLeave
  //         onClose={() => setShowFileLeave(false)}
  //         onSave={handleFileLeave}
  //       />
  //     </div>
  //   );
  // }

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
          <p className="text-red-800 text-sm">{t('barangayOfficials.messages.loadError')}</p>
          {/* <button
            onClick={loadOfficials}
            className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Try again
          </button> */}
        </div>
      )}

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Officials Overview */}
        <BarangayOfficialsStatistics isLoaded={isLoaded} />

        {/* Quick Actions */}
        <BarangayOfficialsQuickActions onAddOfficersClick={handleAddNew} onEditOfficersClick={handleEditOfficialsList} isLoaded={isLoaded}/> 
      </div>

      {/* Officials List */}
      <section className={`bg-white rounded-2xl shadow-sm border border-gray-100 transform transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ animationDelay: '400ms' }}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-darktext mb-4 border-l-4 border-smblue-400 pl-4">Officials List</h3>

          {/* Search and Filters */}
          <BarangayOfficialsSearch searchTerm={searchTerm} onSearchChange={handleSearchChange}/>
        </div>

        {/* Table */}
        <BarangayOfficialsTable 
          filteredOfficials={barangayOfficials}
          isLoading={isLoading}
          searchTerm={debouncedSearchTerm}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deletingId={deleteBarangayOfficial.isPending ? deleteBarangayOfficial.variables : null}
        />
      </section>

      {/* Organizational Chart */}
      <OrganizationalChart />
    </main>
  );
};

export default BarangayOfficialsPage;

