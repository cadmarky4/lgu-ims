import React, { useState, useEffect } from 'react';
import StatCard from '../global/StatCard';
import ResidentsChart from './ResidentsChart';
import QuickActions from './QuickActions';
import Notifications from './Notifications';
import BarangayOfficials from './BarangayOfficials';
import { FaUsers, FaHouseUser, FaStamp, FaPen, FaClipboardList, FaUserCheck } from 'react-icons/fa';
import { DashboardService, type DashboardStatistics } from '../../services/dashboard.service';

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalResidents: 0,
    totalHouseholds: 0,
    activeBarangayOfficials: 0,
    totalBlotterCases: 0,
    totalIssuedClearance: 0,
    ongoingProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dashboardService] = useState(new DashboardService());

  // Fetch dashboard statistics on component mount
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getStatistics();
        if (response.data) {
          setStatistics(response.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [dashboardService]);

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Dashboard</h1>
      </div>

      {/* Statistics Overview */}
      <section className="w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm">        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-smblue-400"></div>
            <span className="ml-2 text-gray-600">Loading statistics...</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <StatCard 
              title="Total Residents" 
              value={statistics.totalResidents} 
              icon={FaUsers}
            />
            <StatCard 
              title="Total Household" 
              value={statistics.totalHouseholds} 
              icon={FaHouseUser}
            />
            <StatCard 
              title="Active Barangay Officials" 
              value={statistics.activeBarangayOfficials} 
              icon={FaUserCheck}
            />
            <StatCard 
              title="Total Blotter Cases" 
              value={statistics.totalBlotterCases} 
              icon={FaPen}
            />
            <StatCard 
              title="Total Issued Clearance" 
              value={statistics.totalIssuedClearance} 
              icon={FaStamp}
            />
            <StatCard 
              title="Ongoing Projects" 
              value={statistics.ongoingProjects} 
              icon={FaClipboardList}
            />
          </div>
        )}
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

