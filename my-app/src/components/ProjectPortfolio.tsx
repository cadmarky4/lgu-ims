import React, { useState } from 'react';
import { FiSearch, FiPlus, FiCalendar, FiDollarSign, FiTrendingUp, FiChevronDown, FiChevronUp, FiEye, FiEdit3 } from 'react-icons/fi';

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

interface ProjectPortfolioProps {
  onAddProject: () => void;
  onEditProject: (project: Project) => void;
  onViewProject: (project: Project) => void;
}

const ProjectPortfolio: React.FC<ProjectPortfolioProps> = ({ onAddProject, onEditProject, onViewProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'budget' | 'progress'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAll, setShowAll] = useState(false);

  const categories = ['All Projects', 'Infrastructure', 'Community', 'Health', 'Education', 'Environment'];

  const projects: Project[] = [
    {
      id: 1,
      title: 'Street Lighting Enhancement Program',
      category: 'Infrastructure',
      description: 'Installation of LED street lights across major roads and pathways to improve safety and security for residents during night time.',
      budget: '₱450,000',
      progress: 65,
      status: 'Active',
      startDate: 'March 2025',
      completedDate: null,
      priority: 'high',
      teamSize: 8,
      lastUpdated: '2 days ago'
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
      completedDate: null,
      priority: 'high',
      teamSize: 12,
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      title: 'Youth Skills Development Program',
      category: 'Education',
      description: 'Technical and vocational training program for young residents to develop employable skills and entrepreneurship capabilities.',
      budget: '₱320,000',
      progress: 40,
      status: 'Active',
      startDate: 'January 2025',
      completedDate: null,
      priority: 'medium',
      teamSize: 5,
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      title: 'Solid Waste Management System',
      category: 'Environment',
      description: 'Implementation of segregated waste collection and recycling program with community education component.',
      budget: '₱850,000',
      progress: null,
      status: 'Completed',
      startDate: 'November 2024',
      completedDate: 'May 2025',
      priority: 'medium',
      teamSize: 10,
      lastUpdated: '2 weeks ago'
    },
    {
      id: 5,
      title: 'Digital Library Initiative',
      category: 'Education',
      description: 'Establishing computer labs and digital resources for community learning and development.',
      budget: '₱680,000',
      progress: 25,
      status: 'Active',
      startDate: 'April 2025',
      completedDate: null,
      priority: 'low',
      teamSize: 6,
      lastUpdated: '5 days ago'
    },
    {
      id: 6,
      title: 'Senior Citizens Wellness Program',
      category: 'Community',
      description: 'Health and wellness activities for senior citizens including regular check-ups and recreational programs.',
      budget: '₱200,000',
      progress: 80,
      status: 'Active',
      startDate: 'February 2025',
      completedDate: null,
      priority: 'medium',
      teamSize: 4,
      lastUpdated: '1 day ago'
    }
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-100';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-200 bg-red-50/30';
      case 'medium':
        return 'border-l-yellow-200 bg-yellow-50/30';
      case 'low':
        return 'border-l-green-200 bg-green-50/30';
      default:
        return 'border-l-gray-200 bg-gray-50/30';
    }
  };

  const handleSort = (field: 'title' | 'status' | 'budget' | 'progress') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        project.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Projects' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'budget':
        const budgetA = parseInt(a.budget.replace(/[^\d]/g, ''));
        const budgetB = parseInt(b.budget.replace(/[^\d]/g, ''));
        comparison = budgetA - budgetB;
        break;
      case 'progress':
        const progressA = a.progress || 0;
        const progressB = b.progress || 0;
        comparison = progressA - progressB;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const displayedProjects = showAll ? sortedProjects : sortedProjects.slice(0, 4);

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInLeft {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes progressBar {
          from { width: 0%; }
          to { width: var(--progress-width); }
        }
        
        .animate-slide-in-up { animation: slideInUp 0.4s ease-out; }
        .animate-fade-in-left { animation: fadeInLeft 0.3s ease-out; }
        .animate-progress-bar { animation: progressBar 1s ease-out 0.5s both; }
      `}</style>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 animate-slide-in-up">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-smblue-400 pl-4 animate-fade-in-left">
              Project Portfolio
            </h2>
            <button 
              onClick={onAddProject}
              className="bg-smblue-400 cursor-pointer hover:bg-smblue-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
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
              placeholder="Search projects by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
            />
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-smblue-400/80 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              {['title', 'status', 'budget', 'progress'].map((field) => (
                <button
                  key={field}
                  onClick={() => handleSort(field as any)}
                  className={`px-3 py-1 text-sm rounded-md cursor-pointer transition-all duration-200 flex items-center space-x-1 ${
                    sortBy === field
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="capitalize">{field}</span>
                  {sortBy === field && (
                    sortOrder === 'asc' ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600 mb-4">
            Showing {displayedProjects.length} of {filteredProjects.length} projects
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All Projects' && ` in ${selectedCategory}`}
          </div>
        </div>

        {/* Projects List */}
        <div className="p-6 space-y-6">
          {displayedProjects.map((project, index) => (
            <div
              key={project.id}
              className={`rounded-lg p-6 transition-all duration-200 shadow-md animate-slide-in-up border-l-4 ${getPriorityColor(project.priority)}`}
              style={{animationDelay: `${index * 100}ms`}}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm text-smblue-400 bg-blue-50 px-2 py-1 rounded-md">
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <FiCalendar className="w-3 h-3 mr-1" />
                      Updated {project.lastUpdated}
                    </span>
                    <span className="text-sm text-gray-500">
                      Team: {project.teamSize} members
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-green-600 flex items-center">
                        {project.budget}
                      </span>
                      {project.progress !== null && (
                        <span className="text-sm text-gray-600 flex items-center">
                          <FiTrendingUp className="w-3 h-3 mr-1" />
                          Progress: {project.progress}%
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => onViewProject(project)}
                        className="p-2 text-gray-400 hover:text-smblue-400 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="View project details"
                      >
                        <FiEye className=" cursor-pointer w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEditProject(project)}
                        className="p-2 cursor-pointer text-gray-400 hover:text-smblue-400 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit project"
                      >
                        <FiEdit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Date Information */}
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                {project.startDate && (
                  <span>Started: {project.startDate}</span>
                )}
                {project.completedDate && (
                  <span>Completed: {project.completedDate}</span>
                )}
              </div>
              
              {/* Progress Bar */}
              {project.progress !== null && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-smblue-400 h-2 rounded-full transition-all duration-1000 ease-out animate-progress-bar"
                    style={{'--progress-width': `${project.progress}%`} as React.CSSProperties}
                  ></div>
                </div>
              )}
            </div>
          ))}
          
          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 animate-slide-in-up">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? `No projects match "${searchTerm}" in ${selectedCategory}`
                  : `No projects found in ${selectedCategory}`
                }
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All Projects');
                }}
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                Clear filters
              </button>
            </div>
          )}
          
          {/* Show More/Less Button */}
          {filteredProjects.length > 4 && (
            <div className="text-center pt-4 border-t border-gray-200">
              <button 
                onClick={() => setShowAll(!showAll)}
                className="cursor-pointer text-smblue-400 hover:text-white text-sm font-medium flex items-center space-x-2 mx-auto transition-all duration-200 transform hover:scale-105 active:scale-95 px-4 py-2 rounded-2xl hover:bg-smblue-400"
              >
                <span>
                  {showAll 
                    ? 'Show Less' 
                    : `Show ${filteredProjects.length - 4} More Projects`
                  }
                </span>
                <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAll ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectPortfolio;

