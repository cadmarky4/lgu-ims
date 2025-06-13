import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const ResidentsChart: React.FC = () => {
  // Age group distribution data for pie chart
  const ageGroupData = [
    { label: "Children (0-17)", value: 15280 },
    { label: "Adults (18-59)", value: 18120 },
    { label: "Senior Citizens (60+)", value: 6799 },
  ];

  const colors = [
    "#8fdbc5",
    "#64adc4", 
    "#4887b7",
    "#367096",
    "#f3fff0",
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
        Residents Age Group Distribution
      </h3>
      
      <div className="flex items-center gap-8">
        {/* Pie Chart */}
        <div className="flex-shrink-0" style={{ width: '300px', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ageGroupData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#367096"
                label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                animationDuration={1000}
              >
                {ageGroupData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: "16px",
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex-1 flex flex-col gap-4">
          <h4 className="font-medium text-gray-900 mb-2">Legend:</h4>
          {ageGroupData.map((item, index) => (
            <div key={index} className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                ></div>
                <span className="text-sm">{item.label}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold">
                  {(
                    (item.value / ageGroupData.reduce((acc, curr) => acc + curr.value, 0)) *
                    100
                  ).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">
                  {item.value.toLocaleString()} residents
              </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResidentsChart; 