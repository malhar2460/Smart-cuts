import React from "react";
import { Button } from "../../../../components/HomePage_ui/button";

export const HeaderSection = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { title: "Salons", href: "salon" },
    { title: "About us", href: "about" },
    { title: "Contact us", href: "contact" },
  ];

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

          {/* Navigation and Sign In */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="flex items-center space-x-5">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="font-['Poppins',Helvetica] font-normal text-gray-600 text-base leading-4"
                >
                  {link.title}
                </a>
              ))}
            </nav>

            {/* Sign In Button */}
            <a href="/login">
              <Button className="bg-indigo-600 text-white rounded-full h-10 px-6 font-['Poppins',Helvetica] font-normal text-base">
                Sign In
              </Button>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
