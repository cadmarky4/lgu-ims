import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FiChevronRight,
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

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

  // Auto-expand parent menu if a submenu item is active
  useEffect(() => {
    const parentMenus = menuItems.filter(
      (item) =>
        item.hasSubmenu &&
        item.submenu?.some((subItem) => subItem.id === activeItem)
    );

    if (parentMenus.length > 0) {
      const parentIds = parentMenus.map((menu) => menu.id);
      setExpandedMenus((prev) => [...new Set([...prev, ...parentIds])]);
    }
  }, [activeItem]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (e: React.MouseEvent, item: any) => {
    // Allow right-click and middle-click to work naturally for links
    if (e.button === 1 || e.button === 2) return;

    if (item.hasSubmenu) {
      e.preventDefault();
      toggleSubmenu(item.id);
      // Don't navigate for parent menu items, just toggle submenu
      return;
    }

    // For regular left clicks, prevent default and use programmatic navigation
    e.preventDefault();
    onItemClick(item.id);
  };

  const handleSubmenuClick = (e: React.MouseEvent, subItemId: string) => {
    // Allow right-click and middle-click to work naturally for links
    if (e.button === 1 || e.button === 2) return;

    // For regular left clicks, prevent default and use programmatic navigation
    e.preventDefault();
    onItemClick(subItemId);
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some((subItem) => subItem.id === activeItem);
  };

  return (
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
            <Link
              to={item.hasSubmenu ? "#" : `/${item.id}`}
              onClick={(e) => handleMenuClick(e, item)}
              className={`sidebar-link md:w-64 w-screen overflow-x-hidden cursor-pointer ${
                activeItem === item.id ||
                (item.hasSubmenu && isSubmenuActive(item.submenu || []))
                  ? "active"
                  : ""
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.hasSubmenu &&
                (expandedMenus.includes(item.id) ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                ))}
            </Link>

            {/* Submenu */}
            {item.hasSubmenu && expandedMenus.includes(item.id) && (
              <div className="ml-8 mt-1 space-y-0 relative">
                {/* Continuous vertical line */}
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-300"></div>

                {item.submenu?.map((subItem, index) => (
                  <div key={subItem.id} className="relative">
                    <Link
                      to={`/${subItem.id}`}
                      onClick={(e) => handleSubmenuClick(e, subItem.id)}
                      className={`flex items-center pl-6 pr-4 py-2 text-sm w-full text-left rounded-md transition-colors cursor-pointer relative ${
                        activeItem === subItem.id
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  </div>
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
