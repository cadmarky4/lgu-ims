import React from 'react';
import { FiUser } from 'react-icons/fi';

const ResidentsChart: React.FC = () => {
  const chartData = [
    { label: 'Children', percentage: 45, color: '#60a5fa', bgColor: 'bg-blue-400' },
    { label: 'Teens', percentage: 10, color: '#1e40af', bgColor: 'bg-blue-800' },
    { label: 'Adults', percentage: 25, color: '#93c5fd', bgColor: 'bg-blue-300' },
    { label: 'Seniors', percentage: 20, color: '#3b82f6', bgColor: 'bg-blue-500' }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
        Residents Classification:
      </h3>
      
      <div className="flex items-center justify-between">
        {/* Pie Chart */}
        <div className="relative w-52 h-52">
          <div className="w-full h-full rounded-full relative overflow-hidden">
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #60a5fa 0% 45%,
                  #1e40af 45% 55%,
                  #93c5fd 55% 80%,
                  #3b82f6 80% 100%
                )`
              }}
            ></div>
            {/* Center hole */}
            <div className="absolute inset-12 bg-white rounded-full shadow-inner"></div>
            
            {/* Percentage labels on chart */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-8 text-white font-semibold text-sm">
                <div className="text-center">45%</div>
                <div className="text-center">10%</div>
                <div className="text-center">25%</div>
                <div className="text-center">20%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 ml-8">
          <h4 className="font-medium text-gray-900 mb-4">Legend:</h4>
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <FiUser className="w-5 h-5 text-white" />
              <span className={`text-sm font-medium text-white px-4 py-2 rounded ${item.bgColor} min-w-[100px] text-center`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResidentsChart; 