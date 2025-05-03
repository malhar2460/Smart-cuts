import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/AdminDashboard_ui/avatar";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  iconActive?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/admindashboard", icon: "/frame-34.svg", iconActive: "/frame-21.svg" },
  { name: "Staff",     path: "/adminstaff",   icon: "/frame-33.svg", iconActive: "/frame-3.svg"  },
  { name: "Schedule",  path: "/adminschedule",icon: "/frame-15.svg", iconActive: "/frame-30.svg" },
  { name: "Services",  path: "/adminservices",icon: "/frame-32.svg", iconActive: "/frame-32.svg" },
];

export const HeaderSection: React.FC = () => {
  const admin_id = localStorage.getItem("admin_id") || "";
  const [profilePic, setProfilePic] = useState<string>("default-profile.png");

  useEffect(() => {
    if (!admin_id) return;
    axios
      .get(
        `http://localhost/Backend/admin_profile.php?admin_id=${encodeURIComponent(admin_id)}`,
        {
          transformResponse: [
            (data: string) => {
              const idx = data.indexOf("{");
              if (idx !== -1) {
                try {
                  return JSON.parse(data.slice(idx));
                } catch {
                  return {};
                }
              }
              return {};
            },
          ],
        }
      )
      .then((res) => {
        if (res.data?.status && res.data.data?.profile_pic) {
          setProfilePic(`http://localhost/Backend/${res.data.data.profile_pic}`);
        }
      })
      .catch(console.error);
  }, [admin_id]);

  return (
<aside className="fixed top-0 left-0 w-64 h-screen flex flex-col justify-between bg-white border-r">
  {/* ─── TOP SECTION ─── */}
  <div className="p-4">
    <h1 className="font-bold text-indigo-600 text-2xl leading-6">SmartCuts</h1>
    <nav className="mt-16">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={isActive && item.iconActive ? item.iconActive : item.icon}
                    alt=""
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

  {/* ─── BOTTOM SECTION ─── */}
  <div className="px-4 pb-4">
    <NavLink
      to={`/adminprofile?admin_id=${encodeURIComponent(admin_id)}`}
      className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
    >
      <Avatar className="w-6 h-6 mr-3">
        <AvatarImage src={profilePic} alt="Profile" />
        <AvatarFallback>
          {JSON.parse(localStorage.getItem("user") || "{}").name?.[0] || "A"}
        </AvatarFallback>
      </Avatar>
      Profile
    </NavLink>
  </div>
</aside>


  );
};
