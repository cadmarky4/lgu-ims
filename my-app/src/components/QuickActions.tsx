import React from 'react';
import { FiUserPlus, FiHome, FiFileText, FiAlertTriangle } from 'react-icons/fi';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 1,
      title: 'Add New Resident',
      icon: FiUserPlus,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 2,
      title: 'Add New Household',
      icon: FiHome,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 3,
      title: 'Issue Barangay Certificate',
      icon: FiFileText,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 4,
      title: 'Add Blotter Case',
      icon: FiAlertTriangle,
      color: 'bg-blue-600 hover:bg-blue-700'
    }
  ];

  return (
    <div className="bg-blue-600 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-white border-opacity-30 pl-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex items-center space-x-3 bg-blue-500 hover:bg-blue-400 text-white p-4 rounded-lg transition-all duration-200 text-left shadow-md"
          >
            <action.icon className="w-5 h-5 flex-shrink-0 text-white" />
            <span className="text-sm font-medium text-white">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions; 