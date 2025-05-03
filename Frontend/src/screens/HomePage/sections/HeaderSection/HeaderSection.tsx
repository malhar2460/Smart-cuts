// src/screens/HomePage/sections/HeaderSection/HeaderSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../../components/HomePage_ui/button";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  username: string;
  photo_url?: string;
}

export const HeaderSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch the logged-in user’s profile (with photo_url) from the backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // not logged in → nothing to show
      return;
    }

    fetch("http://localhost/Backend/profile.php", {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.user) {
          setUser(data.user);
        } else {
          console.error("Failed to load profile:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => setDropdownOpen((o) => !o);
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Build the image URL (backend returns either a full URL or a relative path)
  const avatarSrc = user?.photo_url
    ? (user.photo_url.startsWith("http")
        ? user.photo_url
        : `http://localhost/Backend/${user.photo_url}`)
    : "/default-avatar.png";

  return (
    <header className="w-full h-[72px] bg-white shadow-[0px_1px_2px_#0000000d]">
      <div className="max-w-[1280px] h-full mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <a href="/" className="font-['Poppins',Helvetica] font-bold text-indigo-600 text-2xl leading-6">
            SmartCuts
          </a>

          {/* Nav + Profile */}
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-5">
              <a href="/salon" className="font-['Poppins',Helvetica] text-gray-600 text-base">Salons</a>
              <a href="/about" className="font-['Poppins',Helvetica] text-gray-600 text-base">About us</a>
              <a href="/contact" className="font-['Poppins',Helvetica] text-gray-600 text-base">Contact us</a>
            </nav>

            <div ref={dropdownRef} className="relative">
              {user ? (
                <img
                  src={avatarSrc}
                  alt="Profile"
                  onClick={handleAvatarClick}
                  className="w-10 h-10 rounded-full cursor-pointer object-cover"
                />
              ) : (
                <a href="/login">
                  <Button className="bg-indigo-600 text-white rounded-full h-10 px-6">
                    Sign In
                  </Button>
                </a>
              )}

              {dropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <p className="font-semibold text-gray-700 mb-2">Hello, {user.username}</p>
                  <button
                    onClick={() => navigate("/profile")}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded mb-2"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
