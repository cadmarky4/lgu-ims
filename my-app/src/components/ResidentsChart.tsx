import React, { useState, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import { apiService } from '../services/api';

const ResidentsChart: React.FC = () => {
  const [chartData, setChartData] = useState([
    { label: 'Children', percentage: 0, color: '#60a5fa', bgColor: 'bg-blue-400' },
    { label: 'Teens', percentage: 0, color: '#1e40af', bgColor: 'bg-blue-800' },
    { label: 'Adults', percentage: 0, color: '#93c5fd', bgColor: 'bg-blue-300' },
    { label: 'Seniors', percentage: 0, color: '#3b82f6', bgColor: 'bg-blue-500' }
  ]);

  useEffect(() => {
    fetchResidentStatistics();
  }, []);

  const fetchResidentStatistics = async () => {
    try {
      const stats = await apiService.getResidentStatistics();
      const total = stats.total_residents || 1; // Avoid division by zero
      
      // Calculate percentages based on real data
      const children = Math.round(((stats.children || 0) / total) * 100);
      const teens = Math.round(((stats.teens || 0) / total) * 100);
      const adults = Math.round(((stats.adults || 0) / total) * 100);
      const seniors = Math.round(((stats.senior_citizens || 0) / total) * 100);
      
      setChartData([
        { label: 'Children', percentage: children, color: '#60a5fa', bgColor: 'bg-blue-400' },
        { label: 'Teens', percentage: teens, color: '#1e40af', bgColor: 'bg-blue-800' },
        { label: 'Adults', percentage: adults, color: '#93c5fd', bgColor: 'bg-blue-300' },
        { label: 'Seniors', percentage: seniors, color: '#3b82f6', bgColor: 'bg-blue-500' }
      ]);
    } catch (err) {
      console.error('Error fetching resident statistics for chart:', err);
      // Keep default values on error
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 border-l-4 border-blue-600 pl-4">
        Residents Classification:
      </h3>
      
      <div className="flex items-center justify-between">
        {/* Pie Chart */}
        <div className="relative w-52 h-52">
          <div className="w-full h-full rounded-full relative overflow-hidden">            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
                  #60a5fa 0% ${chartData[0].percentage}%,
                  #1e40af ${chartData[0].percentage}% ${chartData[0].percentage + chartData[1].percentage}%,
                  #93c5fd ${chartData[0].percentage + chartData[1].percentage}% ${chartData[0].percentage + chartData[1].percentage + chartData[2].percentage}%,
                  #3b82f6 ${chartData[0].percentage + chartData[1].percentage + chartData[2].percentage}% 100%
                )`
              }}
            ></div>
            {/* Center hole */}
            <div className="absolute inset-12 bg-white rounded-full shadow-inner"></div>
            
            {/* Percentage labels on chart */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-8 text-white font-semibold text-sm">
                <div className="text-center">{chartData[0].percentage}%</div>
                <div className="text-center">{chartData[1].percentage}%</div>
                <div className="text-center">{chartData[2].percentage}%</div>
                <div className="text-center">{chartData[3].percentage}%</div>
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