import React from 'react';
import type { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  iconColor?: string;
  bgColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-50'
}) => {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard; 