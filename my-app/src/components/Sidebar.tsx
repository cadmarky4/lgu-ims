import React from 'react';
import { 
  FiHome, 
  FiUsers, 
  FiFile, 
  FiHelpCircle, 
  FiBriefcase, 
  FiUserCheck, 
  FiBarChart, 
  FiSettings,
  FiChevronDown
} from 'react-icons/fi';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'residents', label: 'Resident Management', icon: FiUsers },
    { id: 'household', label: 'Household Management', icon: FiUsers },
    { 
      id: 'process-document', 
      label: 'Process Document', 
      icon: FiFile,
      hasSubmenu: true,
      submenu: [
        { id: 'barangay-clearance', label: 'Barangay Clearance' },
        { id: 'business-permit', label: 'Business Permit' },
        { id: 'certificate-indigency', label: 'Certificate of Indigency' },
        { id: 'certificate-residency', label: 'Certificate of Residency' }
      ]
    },
    { 
      id: 'helpdesk', 
      label: 'Help desk', 
      icon: FiHelpCircle,
      hasSubmenu: true,
      submenu: [
        { id: 'appointments', label: 'Appointments' },
        { id: 'blotter', label: 'Blotter' },
        { id: 'complaints', label: 'Complaints' },
        { id: 'suggestions', label: 'Suggestions' }
      ]
    },
    { id: 'projects', label: 'Projects & Programs', icon: FiBriefcase },
    { id: 'officials', label: 'Barangay Officials', icon: FiUserCheck },
    { id: 'reports', label: 'Reports', icon: FiBarChart },
    { id: 'users', label: 'Manage Users', icon: FiUsers },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <nav className="py-4">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => onItemClick(item.id)}
              className={`sidebar-link w-full ${
                activeItem === item.id ? 'active' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.hasSubmenu && (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {/* Submenu for Process Document */}
            {item.hasSubmenu && activeItem === item.id && (
              <div className="ml-8 mt-1 space-y-1">
                {item.submenu?.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onItemClick(subItem.id)}
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 w-full text-left rounded-md"
                  >
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                    {subItem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 