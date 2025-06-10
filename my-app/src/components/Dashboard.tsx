import React from 'react';
import StatCard from './StatCard';
import ResidentsChart from './ResidentsChart';
import QuickActions from './QuickActions';
import Notifications from './Notifications';
import BarangayOfficials from './BarangayOfficials';
import { FiUsers, FiHome, FiUserCheck, FiFileText, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Statistics Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">Statistics Overview</h2>
        <div className="grid grid-cols-3 gap-6">
          <StatCard 
            title="Total Residents:" 
            value="40,199" 
            icon={FiUsers}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Total Household" 
            value="20,148" 
            icon={FiHome}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Active Barangay Officials" 
            value="20" 
            icon={FiUserCheck}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Total Blotter Cases" 
            value="5" 
            icon={FiAlertTriangle}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Total Issued Clearance" 
            value="3" 
            icon={FiFileText}
            iconColor="text-blue-600"
            bgColor="bg-green-50"
          />
          <StatCard 
            title="Ongoing Projects" 
            value="1" 
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