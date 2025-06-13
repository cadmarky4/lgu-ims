import React, { useState } from 'react';
import { FiFolder, FiCheckCircle, FiClock, FiDollarSign } from 'react-icons/fi';
import { FaFolder, FaCheckCircle, FaDollarSign, FaHourglassHalf } from 'react-icons/fa';
import AddNewProject from './AddNewProject';
import EditProject from './EditProject';
import ViewProject from './ViewProject';
import ProjectQuickActions from './ProjectQuickActions';
import SelectProject from './SelectProject';
import StatCard from './StatCard';
import Calendar from './Calendar';
import RecentActivity from './RecentActivity';
import ProjectPortfolio from './ProjectPortfolio';
import { FaCircleCheck } from 'react-icons/fa6';

const ProjectsAndPrograms: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSelectProjectModal, setShowSelectProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const stats = [
    { title: 'Total Projects', value: '24', icon: FiFolder },
    { title: 'Completed Projects', value: '12', icon: FiCheckCircle },
    { title: 'Active Projects', value: '8', icon: FiClock },
    { title: 'Total Budget', value: '₱2.4 M', icon: FiDollarSign }
  ];

  const handleAddProject = (projectData: any) => {
    console.log('New project data:', projectData);
    // Here you would typically save to a database
  };

  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setShowEditForm(true);
  };

  const handleViewProject = (project: any) => {
    console.log('Viewing project:', project); // Debug log
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleUpdateProjectClick = () => {
    setShowSelectProjectModal(true);
  };

  const handleSelectProjectForEdit = (project: any) => {
    setSelectedProject(project);
    setShowSelectProjectModal(false);
    setShowEditForm(true);
  };

  const handleUpdateProject = (projectData: any) => {
    console.log('Updated project data:', projectData);
    // Here you would typically update the database
  };

  if (showEditForm && selectedProject) {
    return (
      <EditProject 
        onClose={() => {
          setShowEditForm(false);
          setSelectedProject(null);
        }} 
        onSave={handleUpdateProject}
        projectData={selectedProject}
      />
    );
  }

  if (showAddForm) {
    return (
      <AddNewProject 
        onClose={() => setShowAddForm(false)} 
        onSave={handleAddProject}
      />
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Projects and Programs</h1>
      </div>

      {/* Statistics Overview */}
      <section className="w-full bg-white flex flex-col gap-3 border p-6 rounded-2xl border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">
          Statistics Overview
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <StatCard 
            title="Total Projects" 
            value={24} 
            icon={FaFolder}
          />
          <StatCard 
            title="Completed Projects" 
            value={12} 
            icon={FaCircleCheck}
          />
          <StatCard 
            title="Active Projects" 
            value={8} 
            icon={FaHourglassHalf}
          />
          <StatCard 
            title="Total Budget" 
            value={2420100} 
            icon={FaDollarSign}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Portfolio */}
          <ProjectPortfolio 
            onAddProject={() => setShowAddForm(true)} 
            onEditProject={handleEditProject}
            onViewProject={handleViewProject}
          />
        </div>

        {/* Right Sidebar */} 
        <div className="lg:col-span-1 space-y-6">
          {/* Project Quick Actions */}
          <ProjectQuickActions 
            onUpdateProject={handleUpdateProjectClick}
            onAddProject={() => setShowAddForm(true)}
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
            console.log('Closing modal'); // Debug log
            setShowViewModal(false);
            setSelectedProject(null);
          }}
        />
      )}
    </main>
  );
};

export default ProjectsAndPrograms;