import { FiUser, FiLogOut } from "react-icons/fi";
import { BiSidebar } from "react-icons/bi";

interface HeaderProps {
  onToggleSidebar: () => void;
  onLogout?: () => void;
  isSidebarExpanded: boolean;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onLogout,
  onToggleSidebar,
  isSidebarExpanded,
  isMobile,
}) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header
      className={`fixed transition-all duration-200 ${
        !isSidebarExpanded && !isMobile
          ? "w-[calc(100vw-64px)] left-16"
          : isSidebarExpanded && isMobile
          ? "w-0 left-[100vw]"
          : isSidebarExpanded
          ? "w-[calc(100vw-288px)] left-72"
          : "w-screen left-0"
      } top-0 z-50 bg-white shadow-sm border-b border-gray-200 px-6 py-4`}
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <button
            className="cursor-pointer hover:bg-gray-200 p-3 rounded-2xl"
            onClick={onToggleSidebar}
          >
            <BiSidebar fontSize={24} />
          </button>
          {/* <div className="hidden md:flex w-12 h-12 rounded-full items-center justify-center overflow-hidden">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-900">
              Barangay San Miguel
            </h1>
            <p className="text-sm text-gray-500">
              Information Management System
            </p>
          </div> */}
        </div>

        {/* Welcome Section and User Profile */}
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-900">
              Welcome, Juan
            </h2>
            <p className="text-sm text-gray-500">
              {currentDate.toUpperCase()} | {currentTime.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
              <FiUser className="header-pre-mobile:mr-0 mr-2 w-5 h-5 flex justify-center" />
              <span className="font-medium header-pre-mobile:hidden">
                Ayevinna Hao
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
