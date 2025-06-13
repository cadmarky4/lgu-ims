import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiCalendar, FiClock, FiUser, FiEye, FiEdit, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { apiService } from '../services/api';
import AddNewAppointment from './AddNewAppointment';

interface Appointment {
  id: number;
  appointment_number: string;
  resident_name: string;
  contact_number: string;
  email?: string;
  appointment_type: string;
  purpose: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high';
  assigned_officer?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  confirmed_date?: string;
  confirmed_time?: string;
}

const AppointmentsManagement: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState({
    total_appointments: 0,
    scheduled_appointments: 0,
    confirmed_appointments: 0,
    completed_appointments: 0,
    cancelled_appointments: 0
  });

  // Fetch appointments data
  useEffect(() => {
    fetchAppointments();
    fetchStatistics();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);
  const fetchStatistics = async () => {
    try {
      const data = await apiService.getAppointmentStatistics();
      setStats(data);
    } catch (err) {
      console.error('Error fetching appointment statistics:', err);
      // Keep default values on error
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAppointments({
        page: currentPage,
        per_page: 10,
        search: searchTerm,
        status: statusFilter === 'all' ? undefined : statusFilter,
        appointment_type: typeFilter === 'all' ? undefined : typeFilter
      });
      setAppointments(response.data);
      setTotalPages(response.last_page || 1);
      setTotalCount(response.total || response.data.length);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
      // Fallback to static data for demo
      setAppointments([
        {
          id: 1,
          appointment_number: 'APT-2024-001',
          resident_name: 'Maria Santos',
          contact_number: '09123456789',
          email: 'maria.santos@email.com',
          appointment_type: 'Document Request',
          purpose: 'Request for Barangay Clearance for employment purposes',
          preferred_date: '2024-01-20',
          preferred_time: '10:00',
          status: 'pending',
          priority: 'medium',
          assigned_officer: 'Officer Rodriguez',
          created_at: '2024-01-16T08:30:00Z',
          updated_at: '2024-01-16T08:30:00Z'
        },
        {
          id: 2,
          appointment_number: 'APT-2024-002',
          resident_name: 'Juan Dela Cruz',
          contact_number: '09987654321',
          email: 'juan.delacruz@email.com',
          appointment_type: 'Consultation',
          purpose: 'Consultation regarding property boundary dispute with neighbor',
          preferred_date: '2024-01-19',
          preferred_time: '14:00',
          status: 'confirmed',
          priority: 'high',
          assigned_officer: 'Barangay Captain',
          confirmed_date: '2024-01-19',
          confirmed_time: '14:30',
          created_at: '2024-01-15T10:20:00Z',
          updated_at: '2024-01-17T09:15:00Z'
        },
        {
          id: 3,
          appointment_number: 'APT-2024-003',
          resident_name: 'Ana Lopez',
          contact_number: '09111222333',
          appointment_type: 'Business Permit',
          purpose: 'Application for new business permit - sari-sari store',
          preferred_date: '2024-01-18',
          preferred_time: '09:00',
          status: 'completed',
          priority: 'medium',
          assigned_officer: 'Officer Mendoza',
          confirmed_date: '2024-01-18',
          confirmed_time: '09:00',
          notes: 'Business permit approved and issued',
          created_at: '2024-01-14T13:45:00Z',
          updated_at: '2024-01-18T10:30:00Z'
        }
      ]);
      setTotalCount(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await apiService.deleteAppointment(id);
        fetchAppointments(); // Refresh the list
      } catch (err) {
        console.error('Error deleting appointment:', err);
        alert('Failed to delete appointment');
      }
    }
  };

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      await apiService.updateAppointment(appointmentId, { status: newStatus });
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Failed to update appointment status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'confirmed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'completed':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FiXCircle className="w-4 h-4" />;
      case 'rescheduled':
        return <FiCalendar className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };
  // Statistics cards using real API data
  const statsCards = [    { 
      title: 'Total Appointments', 
      value: (stats.total_appointments || 0).toString(), 
      icon: FiCalendar,
      color: 'text-blue-600'
    },
    { 
      title: 'Scheduled', 
      value: (stats.scheduled_appointments || 0).toString(), 
      icon: FiClock,
      color: 'text-yellow-600'
    },
    { 
      title: 'Confirmed', 
      value: (stats.confirmed_appointments || 0).toString(), 
      icon: FiCheckCircle,
      color: 'text-blue-600'
    },
    { 
      title: 'Completed', 
      value: (stats.completed_appointments || 0).toString(), 
      icon: FiCheckCircle,
      color: 'text-green-600'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'Document Request', label: 'Document Request' },
    { value: 'Consultation', label: 'Consultation' },
    { value: 'Business Permit', label: 'Business Permit' },
    { value: 'Complaint Filing', label: 'Complaint Filing' },
    { value: 'Other', label: 'Other' }
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {showAddForm ? (
        <AddNewAppointment
          onClose={() => setShowAddForm(false)}
          onSave={(newAppointment) => {
            setAppointments(prev => [newAppointment, ...prev]);
            setShowAddForm(false);
            // Refresh the list to get the latest data
            fetchAppointments();
          }}
        />
      ) : (
      <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
          Appointments Management
        </h1>
        <p className="text-gray-600 mt-1 ml-6">Manage resident appointments and scheduling</p>
      </div>      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={stat.color}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">
              Appointments
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {typeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Add New Appointment Button */}
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4" />
                <span>New Appointment</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading appointments...</div>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <div className="text-sm text-gray-500">Showing fallback data</div>
          </div>
        )}

        {/* Appointments List */}
        {!loading && (
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.appointment_number}
                      </h3>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-700 font-medium">
                        {appointment.appointment_type}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        {appointment.status.toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(appointment.priority)}`}>
                        {appointment.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">
                      <strong>Purpose:</strong> {appointment.purpose}
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <FiUser className="w-4 h-4" />
                        <span>{appointment.resident_name}</span>
                      </div>
                      <div>
                        <strong>Contact:</strong> {appointment.contact_number}
                      </div>
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-4 h-4" />
                        <span>{new Date(appointment.preferred_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{formatTime(appointment.preferred_time)}</span>
                      </div>
                    </div>

                    {appointment.confirmed_date && appointment.confirmed_time && (
                      <div className="text-sm text-green-600 mb-3 bg-green-50 p-2 rounded">
                        <strong>Confirmed:</strong> {new Date(appointment.confirmed_date).toLocaleDateString()} at {formatTime(appointment.confirmed_time)}
                      </div>
                    )}

                    {appointment.assigned_officer && (
                      <div className="text-sm text-gray-500 mb-3">
                        <strong>Assigned Officer:</strong> {appointment.assigned_officer}
                      </div>
                    )}

                    {appointment.notes && (
                      <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}

                    {/* Status Change Dropdown */}
                    <div className="flex items-center gap-4">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        className="text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rescheduled">Rescheduled</option>
                      </select>
                      
                      <span className="text-sm text-gray-500">
                        Requested: {new Date(appointment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button 
                      className="text-blue-600 hover:text-blue-900 p-2"
                      title="View details"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-green-600 hover:text-green-900 p-2"
                      title="Edit appointment"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 p-2"
                      title="Delete appointment"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No appointments found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * 10 + 1, totalCount)} to {Math.min(currentPage * 10, totalCount)} of {totalCount} results
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

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Appointment Details - {selectedAppointment.appointment_number}
              </h3>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Number</label>
                  <p className="text-gray-900 font-semibold">{selectedAppointment.appointment_number}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <p className="text-gray-900">{selectedAppointment.appointment_type}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    {selectedAppointment.status.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(selectedAppointment.priority)}`}>
                    {selectedAppointment.priority.toUpperCase()}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resident Name</label>
                  <p className="text-gray-900">{selectedAppointment.resident_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <p className="text-gray-900">{selectedAppointment.contact_number}</p>
                </div>
                
                {selectedAppointment.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedAppointment.email}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                  <p className="text-gray-900">{new Date(selectedAppointment.preferred_date).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                  <p className="text-gray-900">{formatTime(selectedAppointment.preferred_time)}</p>
                </div>
                
                {selectedAppointment.confirmed_date && selectedAppointment.confirmed_time && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Date</label>
                      <p className="text-green-700 font-semibold">{new Date(selectedAppointment.confirmed_date).toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirmed Time</label>
                      <p className="text-green-700 font-semibold">{formatTime(selectedAppointment.confirmed_time)}</p>
                    </div>
                  </>
                )}
                
                {selectedAppointment.assigned_officer && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Officer</label>
                    <p className="text-gray-900">{selectedAppointment.assigned_officer}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested Date</label>
                  <p className="text-gray-900">{new Date(selectedAppointment.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(selectedAppointment.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedAppointment.purpose}</p>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <p className="text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">{selectedAppointment.notes}</p>
                </div>
              )}            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};

export default AppointmentsManagement;
