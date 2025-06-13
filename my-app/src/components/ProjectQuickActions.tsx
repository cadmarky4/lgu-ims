import React, { useState } from 'react';
import { FiEdit3, FiDownload, FiPlus, FiBarChart } from 'react-icons/fi';

interface ProjectQuickActionsProps {
  onUpdateProject: () => void;
  onAddProject: () => void;
}

const ProjectQuickActions: React.FC<ProjectQuickActionsProps> = ({ onUpdateProject, onAddProject }) => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleExportReport = () => {
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const actions = [
    {
      id: 1,
      title: 'Update Projects',
      icon: FiEdit3,
      onClick: onUpdateProject
    },
    {
      id: 2,
      title: 'Add New Project',
      icon: FiPlus,
      onClick: onAddProject
    },
    {
      id: 3,
      title: 'Export Report',
      icon: FiDownload,
      onClick: handleExportReport
    },
    {
      id: 4,
      title: 'View Analytics',
      icon: FiBarChart,
      onClick: () => console.log('View Analytics clicked')
    }
  ];

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-slide-in-up { animation: slideInUp 0.4s ease-out; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
      `}</style>

      <div className="bg-smblue-400 rounded-2xl p-6 shadow-sm border border-gray-100 animate-slide-in-up">
        <h3 className="text-lg font-semibold text-white mb-6 border-l-4 border-white pl-4 animate-fade-in">
          Project Quick Actions
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex items-center space-x-3 bg-white hover:bg-blue-100 text-white p-4 rounded-lg transition-all cursor-pointer duration-200 text-left shadow-sm animate-slide-in-right"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <action.icon className="w-5 h-5 flex-shrink-0 text-smblue-400" />
              <span className="text-sm font-medium text-smblue-400">{action.title}</span>
            </button>
          ))}
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg animate-fade-in">
            <div className="flex items-center space-x-2">
              <FiDownload className="w-4 h-4" />
              <span className="text-sm font-medium">Report exported successfully!</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectQuickActions;