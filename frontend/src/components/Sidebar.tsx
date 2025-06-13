import React from "react";
import {
  FiHome,
  FiUsers,
  FiFile,
  FiHelpCircle,
  FiBriefcase,
  FiUserCheck,
  FiBarChart,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isExpanded: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  isExpanded,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "residents", label: "Resident Management", icon: FiUsers },
    { id: "household", label: "Household Management", icon: FiUsers },
    {
      id: "process-document",
      label: "Process Document",
      icon: FiFile,
      hasSubmenu: true,
      submenu: [
        { id: "barangay-clearance", label: "Barangay Clearance" },
        { id: "business-permit", label: "Business Permit" },
        { id: "certificate-indigency", label: "Certificate of Indigency" },
        { id: "certificate-residency", label: "Certificate of Residency" },
      ],
    },
    {
      id: "helpdesk",
      label: "Help desk",
      icon: FiHelpCircle,
      hasSubmenu: true,
      submenu: [
        { id: "appointments", label: "Appointments" },
        { id: "blotter", label: "Blotter" },
        { id: "complaints", label: "Complaints" },
        { id: "suggestions", label: "Suggestions" },
      ],
    },
    { id: "projects", label: "Projects & Programs", icon: FiBriefcase },
    { id: "officials", label: "Barangay Officials", icon: FiUserCheck },
    { id: "reports", label: "Reports", icon: FiBarChart },
    { id: "users", label: "Manage Users", icon: FiUsers },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  return (
    // <aside className="transition-all duration-500 md:w-64 md:min-w-64 overflow-x-hidden overflow-y-auto min-w-0 w-0 bg-gray-50 border-r border-gray-200 min-h-screen">
    <aside
      className={`transition-all duration-500 ${
        isExpanded ? "md:w-64 md:min-w-64" : "md:min-w-0 md:w-0"
      } overflow-x-hidden overflow-y-auto ${
        isExpanded ? "min-w-screen w-screen" : "min-w-0 w-0"
      } bg-gray-50 border-r border-gray-200 min-h-screen`}
    >
      <nav className="py-4 mb-20">
        {/* Logo and Title */}
        <div className="flex md:hidden items-center space-x-3 px-3 py-4 w-screen overflow-x-hidden">
          <div className="w-12 h-12 rounded-full items-center justify-center overflow-hidden">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Barangay San Miguel
            </h1>
            <p className="text-sm text-gray-500">
              Information Management System
            </p>
          </div>
        </div>

        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => onItemClick(item.id)}
              className={`sidebar-link md:w-64 w-screen overflow-x-hidden${
                activeItem === item.id ? "active" : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.hasSubmenu && <FiChevronDown className="w-4 h-4" />}
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
