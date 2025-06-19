import React, { useState, useEffect } from 'react';
import StatCard from '../global/StatCard';
import ResidentsChart from './ResidentsChart';
import QuickActions from './QuickActions';
import Notifications from './Notifications';
import BarangayOfficials from './BarangayOfficials';
import Calendar from './Calendar';
import Breadcrumb from '../global/Breadcrumb';
import { FaUsers, FaHouseUser, FaStamp, FaPen, FaClipboardList, FaUserCheck } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Automatic Breadcrumbs */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Page Header */}
      <div className={`mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-2xl font-bold text-darktext pl-0">Dashboard</h1>
      </div>

      {/* Statistics Overview */}
      <section className={`w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '150ms' }}>
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "Total Residents", value: 40199, icon: FaUsers },
            { title: "Total Household", value: 20148, icon: FaHouseUser },
            { title: "Active Barangay Officials", value: 20, icon: FaUserCheck },
            { title: "Total Blotter Cases", value: 5, icon: FaPen },
            { title: "Total Issued Clearance", value: 3, icon: FaStamp },
            { title: "Ongoing Projects", value: 1, icon: FaClipboardList }
          ].map((stat, index) => (
            <div
              key={stat.title}
              className={`transition-all duration-700 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
              }`}
              style={{ 
                transitionDelay: `${300 + (index * 100)}ms`,
                transformOrigin: 'center bottom'
              }}
            >
              <StatCard 
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '900ms' }}>
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
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar */}
          <Calendar />
          
          {/* Barangay Officials */}
          <BarangayOfficials />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;