import React from "react";
import { NavLink } from "react-router-dom";
import { Avatar } from "../../../../components/AdminDashboard_ui/avatar";
import { Button } from "../../../../components/AdminDashboard_ui/button";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  iconActive?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admindashboard", icon: "/frame-34.svg", iconActive: "/frame-21.svg" },
  { name: "Staff", path: "/adminstaff", icon: "/frame-33.svg", iconActive: "/frame-3.svg" },
  { name: "Schedule", path: "/adminschedule", icon: "/frame-15.svg", iconActive: "/frame-30.svg" },
  { name: "Services", path: "/adminservices", icon: "/frame-32.svg", iconActive: "/frame-32.svg" },
  // { name: "Reports", path: "/adminreports", icon: "/frame-9.svg", iconActive: "/frame-9.svg" },
];

export const HeaderSection: React.FC = () => {
  const admin_id = localStorage.getItem("admin_id");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <aside className="relative w-64 h-full bg-white border-r">
      <div className="p-4">
        <h1 className="font-bold text-indigo-600 text-2xl leading-6">SmartCuts</h1>
        <nav className="mt-16">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
               <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <img
                          src={isActive && item.iconActive ? item.iconActive : item.icon}
                          alt={`${item.name} icon`}
                          className="w-4 h-4 mr-3"
                        />
                        {item.name}
                      </>
                    )}
                  </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Profile link */}
      <div className="absolute bottom-14 left-0 w-full px-4">
        <NavLink
          to={`/adminprofile?admin_id=${admin_id}`}
          className="flex items-center w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <img
            src={user.photoUrl || "default-profile.png"}
            alt="Profile"
            className="w-6 h-6 rounded-full mr-3 object-cover"
          />
          Profile
        </NavLink>
      </div>
    </aside>
  );
};
