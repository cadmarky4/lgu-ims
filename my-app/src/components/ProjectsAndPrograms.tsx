import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiFolder, FiCheckCircle, FiClock, FiDollarSign, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import AddNewProject from './AddNewProject';
import { apiService } from '../services/api';

const ProjectsAndPrograms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [showAddForm, setShowAddForm] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch projects data
  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProjects({
        page: currentPage,
        per_page: 15,
        search: searchTerm,
        status: selectedCategory === 'All Projects' ? undefined : selectedCategory
      });
      setProjects(response.data);
      setTotalPages(response.last_page);
      setTotalCount(response.total);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
      // Fallback to static data for demo
      setProjects([
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
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (projectData: any) => {
    try {
      await apiService.createProject(projectData);
      setShowAddForm(false);
      fetchProjects(); // Refresh the list
    } catch (err) {
      console.error('Error creating project:', err);
      alert('Failed to create project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await apiService.deleteProject(id);
        fetchProjects(); // Refresh the list
      } catch (err) {
        console.error('Error deleting project:', err);
        alert('Failed to delete project');
      }
    }
  };

  const stats = [
    { title: 'Total Projects', value: totalCount.toString(), icon: FiFolder },
    { title: 'Completed Projects', value: '12', icon: FiCheckCircle },
    { title: 'Active Projects', value: '8', icon: FiClock },
    { title: 'Total Budget', value: '₱2.4 M', icon: FiDollarSign }
  ];

  const categories = ['All Projects', 'Infrastructure', 'Community', 'Health', 'Education'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = (project.title || project.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Projects' || 
                           (project.category || project.type) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'active':
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'Pending':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <div key={index} className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
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

      {/* Projects Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 border-l-4 border-blue-600 pl-4">Projects</h2>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Add Button */}
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors whitespace-nowrap"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading projects...</div>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <div className="text-sm text-gray-500">Showing fallback data</div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {project.title || project.name}
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {project.category || project.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900"
                        title="View project details"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        title="Edit project"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        title="Delete project"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Budget:</span>
                      <span className="font-semibold text-gray-900">
                        {project.budget || `₱${(project.total_budget || 0).toLocaleString()}`}
                      </span>
                    </div>

                    {(project.progress !== null && project.progress !== undefined) && (
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Progress:</span>
                          <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    {(project.startDate || project.start_date) && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Start Date:</span>
                        <span className="text-sm text-gray-900">
                          {project.startDate || new Date(project.start_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No projects found matching your criteria.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {Math.min((currentPage - 1) * 15 + 1, totalCount)} to {Math.min(currentPage * 15, totalCount)} of {totalCount} results
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`px-3 py-1 text-sm rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button 
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsAndPrograms;