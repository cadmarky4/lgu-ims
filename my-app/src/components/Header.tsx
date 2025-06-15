import { FiUser, FiLogOut } from "react-icons/fi";
import { BiSidebar } from "react-icons/bi";
import { useContainerWidth } from "../custom-hooks/useContainerWidth";
import { useEffect, useState } from "react";

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
  const [containerRef, width] = useContainerWidth();
  const isDateShortened = width < 576;
  const isDateShortenedEvenMore = width < 440;

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
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <button
            className="cursor-pointer hover:bg-gray-200 p-3 rounded-2xl"
            onClick={onToggleSidebar}
          >
            <BiSidebar fontSize={24} />
          </button>
        </div>

        {/* Welcome Section and User Profile */}
        <div className="flex items-center space-x-6">
          <div className="max-w-[330px] text-right">
            <h2 className="truncate text-lg font-semibold text-gray-900">
              Welcome, Juan
            </h2>
            <p className="truncate text-sm text-gray-500">
              {currentDate.toUpperCase()} | {currentTime.toUpperCase()}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="max-w-56 flex justify-center items-center space-x-2 bg-smblue-400 text-white px-4 py-2 rounded-lg">
              <FiUser className="header-pre-mobile:mr-0 mr-0 @2xl/header:mr-2 w-5 h-5 flex justify-center" />
              <span className="truncate font-medium hidden @2xl/header:inline">
                Ayevinna Hao
              </span>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <FiLogOut className="w-5 h-5 mr-0 @3xl/header:mr-2" />
                <span className="font-medium hidden @3xl/header:inline">
                  Logout
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
