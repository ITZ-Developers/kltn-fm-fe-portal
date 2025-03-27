import {
  ChevronDownIcon,
  ChevronUpIcon,
  MousePointer2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalContext } from "../GlobalProvider";
import { useEffect, useState } from "react";
import { LOCAL_STORAGE } from "../../services/constant";
import { getStorageData } from "../../services/storages";
import MainHeader from "./MainHeader";
import UnauthorizedDialog from "../../pages/auth/UnauthorizedDialog";
import { getMediaImage } from "../../services/utils";
import NotReadyDialog from "../../pages/auth/NotReadyDialog";
import { SESSION_KEY_PAGES } from "../PageConfig";
import InputSessionKey from "../../pages/auth/InputSessionKey";

const Sidebar = ({ activeItem, breadcrumbs, renderContent }: any) => {
  const {
    tenantInfo,
    collapsedGroups,
    setCollapsedGroups,
    getSidebarMenus,
    isSystemNotReady,
    setIsSystemNotReady,
    sessionKey,
  } = useGlobalContext();
  const navigate = useNavigate();
  const menuGroups = getSidebarMenus();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuItemClick = (itemName: string) => {
    const selectedItem = menuGroups
      .flatMap((group) => group.items)
      .find((item) => item.name === itemName);
    if (selectedItem) {
      navigate(selectedItem.path);
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    setCollapsedGroups(getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, {}));
  }, []);

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => {
      const updatedGroups = { ...prev, [groupName]: !prev[groupName] };
      getStorageData(LOCAL_STORAGE.COLLAPSED_GROUPS, updatedGroups);
      return updatedGroups;
    });
  };

  const isSessionKeyTimeout = () => {
    return (
      SESSION_KEY_PAGES.has(activeItem) && !sessionKey && !isSystemNotReady
    );
  };

  return (
    <>
      <UnauthorizedDialog />
      <div className="flex min-h-screen">
        <div
          className={`
          fixed top-0 left-0 h-screen w-64
          bg-gray-900 text-white
          transition-transform duration-300 ease-in-out
          z-40
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-80
          overflow-y-auto
        `}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center m-2 space-x-3">
              <div className="flex-shrink-0 w-12 h-12 md:w-16 md:h-16">
                {tenantInfo?.logoPath ? (
                  <img
                    src={getMediaImage(tenantInfo.logoPath)}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Logo"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                    <MousePointer2Icon size={20} className="text-white" />
                  </div>
                )}
              </div>
              <h1 className="text-lg md:text-xl font-semibold text-gray-100 truncate">
                {tenantInfo?.name || "App Name"}
              </h1>
            </div>
            <nav className="flex-grow overflow-y-auto">
              {menuGroups.map((group) => (
                <div key={group.name} className="mb-2">
                  <div
                    className="flex justify-between items-center p-3 mx-2 mb-2 bg-gray-800 cursor-pointer rounded-lg"
                    onClick={() => toggleGroupCollapse(group.name)}
                  >
                    {group.icon}
                    <span className="ml-2">{group.name}</span>
                    {collapsedGroups[group.name] ? (
                      <ChevronDownIcon size={20} />
                    ) : (
                      <ChevronUpIcon size={20} />
                    )}
                  </div>
                  <ul>
                    {!collapsedGroups[group.name] &&
                      group.items.map((item: any) => (
                        <li key={item.name} className="mb-2">
                          <div
                            className={`flex items-center p-3 mx-2 rounded-lg cursor-pointer transition-colors
                            ${
                              activeItem === item.name
                                ? "bg-blue-500"
                                : "hover:bg-blue-700"
                            }`}
                            onClick={() => handleMenuItemClick(item.name)}
                          >
                            <span className="ml-2">{item.label}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-screen">
          <div className="bg-gray-800 flex-1">
            {/* Mobile header */}
            <div className="md:hidden p-4 border-b-2 border-gray-700 flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 focus:outline-none mr-4"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              </button>
              <div className="flex-1">
                <MainHeader breadcrumbs={breadcrumbs} />
              </div>
            </div>

            {/* Desktop header */}
            <div className="hidden md:block p-4 border-b-2 border-gray-700 flex-1 md:ml-80">
              <MainHeader breadcrumbs={breadcrumbs} />
            </div>

            <div className={`p-4 flex-1 transition-all duration-300 md:ml-80`}>
              {isSystemNotReady ? (
                <NotReadyDialog
                  color="goldenrod"
                  message="Vui lòng liên hệ với quản trị viên để kích hoạt hệ thống"
                  title="Hệ thống chưa sẵn sàng"
                />
              ) : isSessionKeyTimeout() ? (
                <InputSessionKey />
              ) : (
                renderContent
              )}
            </div>
          </div>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
