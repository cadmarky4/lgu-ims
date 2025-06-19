import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { BiSidebar } from "react-icons/bi";
import { useContainerWidth } from "../../custom-hooks/useContainerWidth";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarExpanded: boolean;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isSidebarExpanded,
  isMobile,
}) => {
  const [containerRef, width] = useContainerWidth();
  const isDateShortened = width < 576;
  const isDateShortenedEvenMore = width < 440;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { user, logout } = useAuth();

  const [now, setNow] = useState(new Date());

  const currentDate = now.toLocaleDateString("en-US", {
    weekday: isDateShortenedEvenMore
      ? "narrow"
      : isDateShortened
      ? "short"
      : "long",
    year: isDateShortenedEvenMore ? "2-digit" : "numeric",
    month: isDateShortenedEvenMore
      ? "2-digit"
      : isDateShortened
      ? "short"
      : "long",
    day: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: isDateShortenedEvenMore ? undefined : "2-digit",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header
      ref={containerRef}
      className={`@container/header fixed transition-all duration-200 max-h-[81px] ${
        !isSidebarExpanded && !isMobile
          ? "w-[calc(100vw-64px)] left-16"
          : isSidebarExpanded && isMobile
          ? "w-0 left-[100vw]"
          : isSidebarExpanded
          ? "w-[calc(100vw-288px)] left-72"
          : "w-screen left-0"
      } top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-4 py-4`}
    >
      <div className="flex items-center justify-between">
        {/* Left Side: Sidebar Toggle + Welcome Section */}
        <div className="flex items-center space-x-6">
          <button
            className="cursor-pointer hover:bg-gray-200 p-3 rounded-2xl"
            onClick={onToggleSidebar}
          >
            <BiSidebar fontSize={24} />
          </button>
          
          {/* Welcome Section moved to left */}
          <div className="max-w-[330px] text-left">
            <h2 className="truncate text-lg font-semibold text-gray-900">
              Welcome, {user?.first_name || 'User'}
            </h2>
            <p className="truncate text-sm text-gray-500">
              {currentDate.toUpperCase()} | {currentTime.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Right Side: User Profile Dropdown */}
        <div className="relative" id="user-dropdown">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex justify-center items-center space-x-2 bg-smblue-400 hover:bg-smblue-500 text-white px-4 py-2 rounded-lg transition-colors min-w-fit"
          >
            <FiUser className="header-pre-mobile:mr-0 mr-0 @2xl/header:mr-2 w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden @2xl/header:inline whitespace-nowrap">
              {user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}
            </span>
            <FiChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-900">{user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <p className="text-xs text-gray-400">{user?.role} • {user?.department}</p>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

