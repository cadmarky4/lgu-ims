import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import ResidentsChart from './ResidentsChart';
import QuickActions from './QuickActions';
import Notifications from './Notifications';
import BarangayOfficials from './BarangayOfficials';
import { FiUsers, FiHome, FiUserCheck, FiFileText, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';
import { apiService } from '../services/api';

interface DashboardStats {
  residents: number;
  households: number;
  documents: number;
  pending_documents: number;
  projects: number;
  active_projects: number;
  complaints: number;
  pending_complaints: number;
  total_budget: number;
  utilized_budget: number;
  active_officials?: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getDashboardStatistics();
        setStats(data);
        setError(null);
      } catch (error: any) {
        console.error('Failed to fetch dashboard statistics:', error);
        setError(error.message || 'Failed to load dashboard data');
        // Set default values in case of error
        setStats({
          residents: 0,
          households: 0,
          documents: 0,
          pending_documents: 0,
          projects: 0,
          active_projects: 0,
          complaints: 0,
          pending_complaints: 0,
          total_budget: 0,
          utilized_budget: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error loading dashboard: {error}</p>
        </div>
        {/* Still show the layout with default values */}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">Statistics Overview</h2>
        <div className="grid grid-cols-3 gap-6">
          <StatCard 
            title="Total Residents:" 
            value={stats?.residents?.toLocaleString() || "0"} 
            icon={FiUsers}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Total Household" 
            value={stats?.households?.toLocaleString() || "0"} 
            icon={FiHome}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />          <StatCard 
            title="Active Barangay Officials" 
            value={stats?.active_officials?.toString() || "0"} 
            icon={FiUserCheck}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Total Blotter Cases" 
            value={stats?.complaints?.toString() || "0"} 
            icon={FiAlertTriangle}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Total Issued Clearance" 
            value={stats?.documents?.toString() || "0"} 
            icon={FiFileText}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Ongoing Projects" 
            value={stats?.active_projects?.toString() || "0"} 
            icon={FiTrendingUp}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Residents Chart */}
          <ResidentsChart />
          
          {/* Quick Actions */}
          <QuickActions />
          
          {/* Notifications */}
          <Notifications />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <BarangayOfficials />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 