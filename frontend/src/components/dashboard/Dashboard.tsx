import React from 'react';
import StatCard from '../global/StatCard';
import ResidentsChart from './ResidentsChart';
import QuickActions from './QuickActions';
import Notifications from './Notifications';
import BarangayOfficials from './BarangayOfficials';
import { FaUsers, FaHouseUser, FaStamp, FaPen, FaClipboardList, FaUserCheck } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Dashboard</h1>
      </div>

      {/* Statistics Overview */}
      <section className="w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <StatCard 
            title="Total Residents" 
            value={40199} 
            icon={FaUsers}
          />
          <StatCard 
            title="Total Household" 
            value={20148} 
            icon={FaHouseUser}
          />
          <StatCard 
            title="Active Barangay Officials" 
            value={20} 
            icon={FaUserCheck}
          />
          <StatCard 
            title="Total Blotter Cases" 
            value={5} 
            icon={FaPen}
          />
          <StatCard 
            title="Total Issued Clearance" 
            value={3} 
            icon={FaStamp}
          />
          <StatCard 
            title="Ongoing Projects" 
            value={1} 
            icon={FaClipboardList}
          />
        </div>
      </section>

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
    </main>
  );
};

export default Dashboard; 

