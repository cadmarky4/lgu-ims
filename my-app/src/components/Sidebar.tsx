import React, { useState, useEffect, useRef } from "react";
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
import sanMiguelLogo from "@/assets/sanMiguelLogo.jpg";

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  isExpanded: boolean;
  isMobile: boolean;
}

interface SubmenuPosition {
  top: number;
  left: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeItem,
  onItemClick,
  isExpanded,
  isMobile,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [submenuPositions, setSubmenuPositions] = useState<
    Record<string, SubmenuPosition>
  >({});
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuItemRefs = useRef<Record<string, HTMLAnchorElement>>({});
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Calculate submenu position
  const calculateSubmenuPosition = (menuId: string): SubmenuPosition => {
    const menuElement = menuItemRefs.current[menuId];
    if (!menuElement) return { top: 0, left: 64 };

    const rect = menuElement.getBoundingClientRect();
    const headerHeight = 81;

    // Calculate position
    let top = rect.top;
    let left = rect.right + 8; // Add small gap

    // Ensure submenu doesn't go above header
    if (top < headerHeight) {
      top = headerHeight;
    }

    // Ensure submenu doesn't go below viewport
    const maxTop = window.innerHeight - 200; // Assuming submenu height ~200px
    if (top > maxTop) {
      top = maxTop;
    }

    return { top, left };
  };

  // Update submenu positions
  const updateSubmenuPositions = () => {
    if (isMobile || isExpanded) return;

    const newPositions: Record<string, SubmenuPosition> = {};
    expandedMenus.forEach((menuId) => {
      newPositions[menuId] = calculateSubmenuPosition(menuId);
    });
    setSubmenuPositions(newPositions);
  };

  // Auto-expand parent menu if a submenu item is active (only when sidebar is expanded)
  useEffect(() => {
    if (!isExpanded && !isMobile) return;

    const parentMenus = menuItems.filter(
      (item) =>
        item.hasSubmenu &&
        item.submenu?.some((subItem) => subItem.id === activeItem)
    );

    if (parentMenus.length > 0) {
      const parentIds = parentMenus.map((menu) => menu.id);
      setExpandedMenus(parentIds); // Only keep the active parent expanded
    }
  }, [activeItem, isExpanded, isMobile]);

  // Close all submenus when sidebar collapses
  useEffect(() => {
    if (!isExpanded && !isMobile) {
      setExpandedMenus([]);
    }
  }, [isExpanded, isMobile]);

  // Update positions when menus expand/collapse or sidebar state changes
  useEffect(() => {
    if (!isMobile && !isExpanded) {
      // Calculate positions immediately for collapsed sidebar
      updateSubmenuPositions();
    }
  }, [expandedMenus, isExpanded, isMobile]);

  // Listen for scroll events on sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    const handleScroll = () => {
      updateSubmenuPositions();
    };

    const handleResize = () => {
      updateSubmenuPositions();
    };

    sidebar.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      sidebar.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [expandedMenus, isExpanded, isMobile]);

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!sidebarRef.current?.contains(event.target as Node)) {
        setExpandedMenus([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubmenu = (menuId: string) => {
    if (!isMobile && !isExpanded) {
      // For collapsed sidebar, calculate position immediately before showing
      const position = calculateSubmenuPosition(menuId);
      setSubmenuPositions((prev) => ({ ...prev, [menuId]: position }));
    }

    setExpandedMenus((prev) => {
      // Only allow one submenu open at a time
      if (prev.includes(menuId)) {
        return []; // Close if already open
      } else {
        return [menuId]; // Open only this one, close others
      }
    });
  };

  const handleMenuClick = (e: React.MouseEvent, item: any) => {
    // Allow right-click and middle-click to work naturally for links
    if (e.button === 1 || e.button === 2) return;

    if (item.hasSubmenu) {
      // Check if this is a double-click or if the menu is already expanded
      if (e.detail === 2 || (expandedMenus.includes(item.id) && (isExpanded || isMobile))) {
        // Navigate to the main page on double-click or if submenu is already open and clicked again
        e.preventDefault();
        onItemClick(item.id);
        return;
      }

      e.preventDefault();

      if (isExpanded || isMobile) {
        // Normal toggle behavior when expanded
        toggleSubmenu(item.id);
      } else {
        // For collapsed sidebar, use hover behavior
        setExpandedMenus([item.id]);
      }
      return;
    }

    // For regular left clicks, prevent default and use programmatic navigation
    e.preventDefault();
    onItemClick(item.id);
  };

  const handleMenuHover = (menuId: string) => {
    if (!isExpanded && !isMobile) {
      // Clear any existing timeout
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current);
      }

      // Calculate position immediately before showing
      const position = calculateSubmenuPosition(menuId);
      setSubmenuPositions((prev) => ({ ...prev, [menuId]: position }));

      setHoveredMenu(menuId);
      setExpandedMenus([menuId]);
    }
  };

  const handleMenuLeave = () => {
    if (!isExpanded && !isMobile) {
      setHoveredMenu(null);
      // Delay closing to allow moving to submenu
      submenuTimeoutRef.current = setTimeout(() => {
        setExpandedMenus([]);
      }, 300);
    }
  };

  const handleSubmenuEnter = () => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current);
    }
  };

  const handleSubmenuLeave = () => {
    if (!isExpanded && !isMobile) {
      submenuTimeoutRef.current = setTimeout(() => {
        setExpandedMenus([]);
      }, 300);
    }
  };

  const handleSubmenuClick = (e: React.MouseEvent, subItemId: string) => {
    // Allow right-click and middle-click to work naturally for links
    if (e.button === 1 || e.button === 2) return;

    // For regular left clicks, prevent default and use programmatic navigation
    e.preventDefault();

    // Navigate first
    onItemClick(subItemId);

    // Only close submenu if sidebar is collapsed, keep it open when expanded
    if (!isExpanded && !isMobile) {
      setExpandedMenus([]);
    }
    // When expanded, let the auto-expand logic in useEffect handle the state
  };

  const isSubmenuActive = (submenu: any[]) => {
    return submenu.some((subItem) => subItem.id === activeItem);
  };

  return (
    <aside
      ref={sidebarRef}
      className={`transition-all duration-200 ${
        isExpanded ? "md:w-72 md:min-w-72" : "md:min-w-16 md:w-16"
      } overflow-x-hidden overflow-y-auto ${
        isExpanded ? "min-w-screen w-screen" : "min-w-0 w-0"
      } bg-gray-50 border-r border-gray-200 min-h-screen`}
    >
      <nav className="py-4">
        {/* Logo and Title */}
        <div
          className={`transition-all duration-200 ${
            !isMobile && !isExpanded ? "w-16" : "w-72"
          } flex gap-3 space-x-3 px-3 py-4 overflow-x-hidden`}
        >
          <img
            src={sanMiguelLogo}
            className={`transition-all duration-200 ${
              !isMobile && !isExpanded ? "w-10 h-10" : "w-16 h-16"
            } rounded-full m-0`}
            alt="San Miguel Logo"
          />
          <div className={`${!isMobile && !isExpanded ? "max-w-0" : ""}`}>
            <h1 className="whitespace-nowrap text-md font-bold text-gray-900">
              Barangay San Miguel
            </h1>
            <p
              className={`${
                !isMobile && !isExpanded
                  ? "whitespace-nowrap"
                  : "whitespace-normal"
              } text-sm text-gray-500`}
            >
              Information Management System
            </p>
          </div>
        </div>

        {menuItems.map((item) => (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => item.hasSubmenu && handleMenuHover(item.id)}
            onMouseLeave={() => item.hasSubmenu && handleMenuLeave()}
          >
            <Link
              ref={(el) => {
                if (el) menuItemRefs.current[item.id] = el;
              }}
              to={item.hasSubmenu ? "#" : `/${item.id}`}
              onClick={(e) => handleMenuClick(e, item)}
              className={`sidebar-link flex items-center px-[22px] min-h-12 transition-colors duration-200 cursor-pointer no-underline ${
                isExpanded ? "md:w-72" : "md:w-full"
              } w-screen overflow-x-hidden ${
                activeItem === item.id ||
                (item.hasSubmenu && isSubmenuActive(item.submenu || []))
                  ? `active font-medium ${
                      isExpanded ? "border-r-4" : "border-r-3"
                    } border-smblue-400`
                  : ""
              }`}
              title={!isMobile && !isExpanded ? item.label : ""}
            >
              <item.icon
                className={`transition-all duration-200 w-5 h-5 ${
                  isExpanded || isMobile ? "mr-3" : "mr-0"
                }`}
              />
              <span
                className={`flex-1 text-left transition-all duration-200 ${
                  !isMobile && !isExpanded
                    ? "opacity-0 max-w-0 overflow-hidden whitespace-nowrap"
                    : "opacity-100"
                }`}
              >
                {item.label}
              </span>
              {item.hasSubmenu && (
                <div
                  className={`transition-all duration-200 ${
                    !isMobile && !isExpanded
                      ? "opacity-0 max-w-0 overflow-hidden"
                      : "opacity-100"
                  }`}
                >
                  {expandedMenus.includes(item.id) ? (
                    <FiChevronDown className="w-4 h-4" />
                  ) : (
                    <FiChevronRight className="w-4 h-4" />
                  )}
                </div>
              )}
            </Link>

            {/* Submenu */}
            {item.hasSubmenu && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  !isMobile && !isExpanded
                    ? "fixed bg-white p-3 rounded-2xl border border-gray-200 shadow-lg min-w-52 z-50"
                    : expandedMenus.includes(item.id)
                    ? "ml-8 mt-1 relative max-h-96 opacity-100"
                    : "ml-8 mt-1 relative max-h-0 opacity-0"
                }`}
                style={
                  !isMobile &&
                  !isExpanded &&
                  submenuPositions[item.id] &&
                  expandedMenus.includes(item.id)
                    ? {
                        top: `${submenuPositions[item.id].top}px`,
                        left: `${submenuPositions[item.id].left}px`,
                      }
                    : !isMobile && !isExpanded
                    ? { display: "none" }
                    : {}
                }
                onMouseEnter={handleSubmenuEnter}
                onMouseLeave={handleSubmenuLeave}
              >
                {/* Continuous vertical line */}
                <div
                  className={`${
                    !isMobile && !isExpanded ? "hidden" : "block"
                  } absolute left-2 top-0 bottom-0 w-px bg-gray-300`}
                ></div>

                <div className="space-y-0">
                  {item.submenu?.map((subItem) => (
                    <div key={subItem.id} className="relative">
                      <Link
                        to={`/${subItem.id}`}
                        onClick={(e) => handleSubmenuClick(e, subItem.id)}
                        className={`flex items-center ${
                          !isMobile && !isExpanded ? "px-3" : "pl-6 pr-4"
                        } py-2 text-sm w-full text-left rounded-md transition-colors cursor-pointer relative ${
                          activeItem === subItem.id
                            ? "bg-[#D2DEE7] text-smblue-400 font-medium"
                            : "hover:bg-[#E6EBF0] hover:text-smblue-400"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
