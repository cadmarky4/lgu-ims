import React from 'react';
import { FiUser } from 'react-icons/fi';

const Header: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Barangay San Miguel</h1>
            <p className="text-sm text-gray-500">Information Management System</p>
          </div>
        </div>

        {/* Welcome Section and User Profile */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-900">Welcome, Juan</h2>
            <p className="text-sm text-gray-500">
              {currentDate.toUpperCase()} | {currentTime.toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
            <FiUser className="w-5 h-5" />
            <span className="font-medium">Ayevinna Hao</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 