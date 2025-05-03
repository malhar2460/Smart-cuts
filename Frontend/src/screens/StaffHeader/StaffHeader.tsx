// src/components/StaffHeader/StaffHeader.tsx
import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../Components/AdminDashboard_ui/avatar";

interface NavItem {
  name: string;
  path: string;
  icon: string;
  iconActive: string;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    path: "/staff/dashboard",
    icon: "/frame-34.svg",
    iconActive: "/frame-21.svg",
  },
  {
    name: "Schedule",
    path: "/staff/schedule",
    icon: "/frame-15.svg",
    iconActive: "/frame-30.svg",
  },
  {
    name: "Profile",
    path: "/staff/profile",
    icon: "/frame-33.svg",
    iconActive: "/frame-3.svg",
  },
];

export const StaffHeader: React.FC = () => {
  const [searchParams] = useSearchParams();
  const staff_id = searchParams.get("staff_id") || localStorage.getItem("staff_id") || "";
  const [profilePic, setProfilePic] = useState<string>("default-profile.png");

  useEffect(() => {
    if (!staff_id) return;
    axios
      .get(
        `http://localhost/Backend/staff_profile.php?staff_id=${encodeURIComponent(
          staff_id
        )}`,
        {
          transformResponse: [(data: string) => {
            const idx = data.indexOf("{");
            return idx >= 0 ? JSON.parse(data.slice(idx)) : {};
          }],
        }
      )
      .then((res) => {
        if (res.data?.status && res.data.data?.profile_pic) {
          setProfilePic(`http://localhost/Backend/${res.data.data.profile_pic}`);
        }
      })
      .catch(console.error);
  }, [staff_id]);

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen flex flex-col justify-between bg-white border-r">
      {/* ─── Top nav ─── */}
      <div className="p-4">
        <h1 className="font-bold text-indigo-600 text-2xl">Staff Panel</h1>
        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={`${item.path}?staff_id=${encodeURIComponent(staff_id)}`}
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
                        src={isActive ? item.iconActive : item.icon}
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

      {/* ─── Bottom profile link ─── */}
      {/* <div className="px-4 pb-4">
        <NavLink
          to={`/staff/profile?staff_id=${encodeURIComponent(staff_id)}`}
          className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <Avatar className="w-6 h-6 mr-3">
            <AvatarImage src={profilePic} alt="Profile" />
            <AvatarFallback>
              {JSON.parse(localStorage.getItem("user") || "{}").name?.[0] || "S"}
            </AvatarFallback>
          </Avatar>
          My Profile
        </NavLink>
      </div> */}
    </aside>
  );
};
