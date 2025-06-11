import React, { useState } from 'react';
import { FiSearch, FiPlus, FiFolder, FiCheckCircle, FiClock, FiDollarSign, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import AddNewProject from './AddNewProject';

const ProjectsAndPrograms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = [
    { title: 'Total Projects', value: '24', icon: FiFolder, bgColor: 'bg-green-50' },
    { title: 'Completed Projects', value: '12', icon: FiCheckCircle, bgColor: 'bg-green-50' },
    { title: 'Active Projects', value: '8', icon: FiClock, bgColor: 'bg-green-50' },
    { title: 'Total Budget', value: '₱2.4 M', icon: FiDollarSign, bgColor: 'bg-green-50' }
  ];

  const categories = ['All Projects', 'Infrastructure', 'Community', 'Health', 'Education'];

  const projects = [
    {
      id: 1,
      title: 'Street Lighting Enhancement Program',
      category: 'Infrastructure',
      description: 'Installation of LED street lights across major roads and pathways to improve safety and security for residents during night time.',
      budget: '₱450,000',
      progress: 65,
      status: 'Active',
      startDate: null,
      completedDate: null
    },
    {
      id: 2,
      title: 'Community Health Center Renovation',
      category: 'Health',
      description: 'Comprehensive renovation of the barangay health center including new medical equipment and facility upgrades.',
      budget: '₱850,000',
      progress: null,
      status: 'Pending',
      startDate: 'July 2025',
      completedDate: null
    },
    {
      id: 3,
      title: 'Youth Skills Development Program',
      category: 'Education',
      description: 'Technical and vocational training program for young residents to develop employable skills and entrepreneurship capabilities.',
      budget: '₱320,000',
      progress: 40,
      status: 'Active',
      startDate: null,
      completedDate: null
    },
    {
      id: 4,
      title: 'Solid Waste Management System',
      category: 'Environment',
      description: 'Implementation of segregated waste collection and recycling program with community education component.',
      budget: '₱850,000',
      progress: null,
      status: 'Completed',
      startDate: null,
      completedDate: 'May 2025'
    }
  ];

  const recentActivities = [
    { id: 1, activity: 'Street Lighting project milestone completed.', time: '2 hours ago' },
    { id: 2, activity: 'New Project Proposal Submitted', time: '1 day ago' },
    { id: 3, activity: 'Health Center renovation approved', time: '3 days ago' },
    { id: 4, activity: 'Waste Management project completed', time: '1 week ago' },
    { id: 5, activity: 'Youth Education training started', time: '2 weeks ago' }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Projects' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calendar data for June 2025
  const currentMonth = 'June 2025';
  const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const startingDay = 0; // Sunday (0-6)

  const handleAddProject = (projectData: any) => {
    console.log('New project data:', projectData);
    // Here you would typically save to a database
  };

  if (showAddForm) {
    return (
      <AddNewProject 
        onClose={() => setShowAddForm(false)} 
        onSave={handleAddProject}
      />
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Projects & Programs</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-lg p-6 border border-gray-100`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-blue-600">
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Portfolio */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Project Portfolio</h2>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Add New Project</span>
                </button>
              </div>
              
              {/* Search Bar */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search Residents by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Category Filters */}
              <div className="flex space-x-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects List */}
            <div className="p-6 space-y-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-blue-600 mb-2">{project.category}</p>
                      <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold text-green-600">{project.budget}</span>
                        {project.progress && (
                          <span className="text-sm text-gray-600">Progress: {project.progress}%</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeColor(project.status)}`}>
                        {project.status}
                      </span>
                      {project.startDate && (
                        <p className="text-sm text-gray-600 mt-2">Start Date: {project.startDate}</p>
                      )}
                      {project.completedDate && (
                        <p className="text-sm text-gray-600 mt-2">Completed {project.completedDate}</p>
                      )}
                    </div>
                  </div>
                  
                  {project.progress && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Expand to view all records */}
              <div className="text-center pt-4 border-t border-gray-200">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 mx-auto">
                  <span>⌄ Expand to view all records ⌄</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Project Calendar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Project Calendar</h3>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <button className="p-1 hover:bg-gray-100 rounded">
                <FiChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h4 className="font-medium text-gray-900">{currentMonth}</h4>
              <button className="p-1 hover:bg-gray-100 rounded">
                <FiChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startingDay }, (_, i) => (
                <div key={`empty-${i}`} className="p-2"></div>
              ))}
              {calendarDays.map((day) => (
                <button
                  key={day}
                  className={`p-2 text-sm text-center hover:bg-blue-50 rounded ${
                    day === 10 ? 'bg-blue-600 text-white' : 'text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-l-4 border-blue-600 pl-4">Recent Activity</h3>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsAndPrograms; 