import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFolder, FiCheckCircle, FiClock, FiDollarSign, FiChevronRight } from 'react-icons/fi';
import { FaFolder, FaCheckCircle, FaDollarSign, FaHourglassHalf } from 'react-icons/fa';
import ViewProject from './ViewProject';
import ProjectQuickActions from './ProjectQuickActions';
import SelectProject from './SelectProject';
import StatCard from '../StatCard';
import Calendar from './Calendar';
import RecentActivity from './RecentActivity';
import ProjectPortfolio from './ProjectPortfolio';
import { FaCircleCheck } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  budget: string;
  progress: number | null;
  status: 'Active' | 'Pending' | 'Completed';
  startDate: string | null;
  completedDate: string | null;
  priority: 'high' | 'medium' | 'low';
  teamSize: number;
  lastUpdated: string;
}

interface StatItem {
  title: string;
  value: number;
  icon: IconType;
}

const ProjectsAndPrograms: React.FC = () => {
  const navigate = useNavigate();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSelectProjectModal, setShowSelectProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAddProject = () => {
    navigate('/projects/add');
  };

  const handleEditProject = (project: Project) => {
    navigate(`/projects/edit/${project.id}`);
  };

  const handleViewProject = (project: Project) => {
    console.log('Viewing project:', project);
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleUpdateProjectClick = () => {
    setShowSelectProjectModal(true);
  };

  const handleSelectProjectForEdit = (project: Project) => {
    setSelectedProject(project);
    setShowSelectProjectModal(false);
    navigate(`/projects/edit/${project.id}`);
  };

  return (
    <main className="p-4 lg:p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Breadcrumbs */}
      <div className={`flex items-center space-x-2 text-sm text-gray-600 mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-smblue-400 hover:text-smblue-600 transition-colors duration-200 cursor-pointer"
        >
          Dashboard
        </button>
        <FiChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-gray-900 font-medium">Projects and Programs</span>
      </div>

      {/* Page Header */}
      <div className={`mb-2 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-xl lg:text-2xl font-bold text-darktext pl-0">Projects and Programs</h1>
      </div>

      {/* Statistics Overview */}
      <section className={`w-full bg-white flex flex-col gap-3 border p-4 lg:p-6 rounded-2xl border-gray-100 shadow-sm transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '150ms' }}>
        <h3 className="text-base lg:text-lg font-semibold text-darktext mb-4 lg:mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {([
            { title: "Total Projects", value: 24, icon: FaFolder },
            { title: "Completed Projects", value: 12, icon: FaCircleCheck },
            { title: "Active Projects", value: 8, icon: FaHourglassHalf },
            { title: "Total Budget", value: 2420100, icon: FaDollarSign }
          ] as StatItem[]).map((stat, index) => {
            // Format value for display
            const formatValue = (value: number): string => {
              if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
              }
              return value.toString();
            };

            return (
              <div
                key={stat.title}
                className={`transition-all duration-700 ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}
                style={{ 
                  transitionDelay: `${300 + (index * 150)}ms`,
                  transformOrigin: 'center bottom'
                }}
              >
                <StatCard 
                  title={stat.title}
                  value={formatValue(stat.value)}
                  icon={stat.icon}
                />
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Portfolio */}
          <ProjectPortfolio 
            onAddProject={handleAddProject} 
            onEditProject={handleEditProject}
            onViewProject={handleViewProject}
          />
        </div>

        {/* Right Sidebar */} 
        <div className="lg:col-span-1 space-y-4 lg:space-y-6">
          {/* Project Quick Actions */}
          <ProjectQuickActions 
            onUpdateProject={handleUpdateProjectClick}
            onAddProject={handleAddProject}
          />

          {/* Project Calendar */}
          <Calendar />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>

      {/* SelectProject Modal */}
      <SelectProject 
        isOpen={showSelectProjectModal}
        onClose={() => setShowSelectProjectModal(false)}
        onSelectProject={handleSelectProjectForEdit}
      />

      {/* ViewProject Modal */}
      {selectedProject && (
        <ViewProject 
          project={selectedProject}
          isOpen={showViewModal}
          onClose={() => {
            console.log('Closing modal');
            setShowViewModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </main>
  );
};

export default ProjectsAndPrograms;

