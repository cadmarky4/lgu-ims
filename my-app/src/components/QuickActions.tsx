import React from 'react';
import { FiUserPlus, FiHome, FiFileText, FiAlertTriangle } from 'react-icons/fi';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 1,
      title: 'Add New Resident',
      icon: FiUserPlus,
    },
    {
      id: 2,
      title: 'Add New Household',
      icon: FiHome,
    },
    {
      id: 3,
      title: 'Issue Barangay Certificate',
      icon: FiFileText,
    },
    {
      id: 4,
      title: 'Add Blotter Case',
      icon: FiAlertTriangle,
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex items-center space-x-3 bg-smblue-400 hover:bg-smblue-300 text-white p-4 rounded-lg transition-all duration-200 text-left shadow-sm"
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