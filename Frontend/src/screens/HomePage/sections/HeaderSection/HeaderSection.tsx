import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../../../components/HomePage_ui/button";
import { useNavigate } from "react-router-dom";

export const HeaderSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; photoUrl?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isCustomer, setIsCustomer] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setIsCustomer(!!parsed.customer_id); // Check if customer_id exists
      
      const photoFilename = parsed.photo_url;
      const finalPhotoUrl = photoFilename && !photoFilename.startsWith("http")
        ? `http://localhost/Backend/${photoFilename}`
        : photoFilename || '/default-avatar.png';
      
      setUser({ username: parsed.username, photoUrl: finalPhotoUrl });
    }
  }, []);

  // Load user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const photoFilename = parsed.photoUrl;
  
      const finalPhotoUrl = photoFilename && !photoFilename.startsWith("http")
        ? `http://localhost/Backend/${photoFilename}`
        : photoFilename || '/default-avatar.png';
  
      console.log("Final photo URL:", finalPhotoUrl); // ✅ DEBUG HERE
      setUser({ username: parsed.username, photoUrl: finalPhotoUrl });
    }
  }, []);
  

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="w-full h-[72px] bg-white shadow-[0px_1px_2px_#0000000d]">
      <div className="max-w-[1280px] h-full mx-auto px-4">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="font-['Poppins',Helvetica] font-bold text-indigo-600 text-2xl leading-6">
              SmartCuts
            </a>
          </div>

          {/* Navigation and Profile */}
          <div className="flex items-center space-x-6 relative">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-5">
            {isCustomer && (
                <a href="/salon" className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base leading-4">
                  Salons
                </a>
              )}
              {/* <a href="/salon" className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base leading-4">
                Salons
              </a> */}
              <a href="/about" className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base leading-4">
                About us
              </a>
              <a href="/contact" className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base leading-4">
                Contact us
              </a>
            </nav>

            {user ? (
              <div ref={dropdownRef} className="relative">
                <img
                  src={user.photoUrl || '/default-avatar.png'}
                  alt="Profile"
                  onClick={handleAvatarClick}
                  className="w-10 h-10 rounded-full cursor-pointer object-cover"
                />

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                    <p className="font-semibold text-gray-700 mb-2">Hello, {user.username}</p>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full text-left mb-2 px-2 py-1 hover:bg-gray-100 rounded"
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
            ) : (
              <a href="/login">
                <Button className="bg-indigo-600 text-white rounded-full h-10 px-6 font-['Poppins',Helvetica] font-normal text-base">
                  Sign In
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
