import React from "react";
import { Button } from "../../../../components/Services_ui/button";

export const HeaderSection = (): JSX.Element => {
  return (
    <header className="w-full h-[72px] bg-white shadow-sm flex items-center justify-center">
      <div className="w-full max-w-[1248px] flex justify-between items-center px-4">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/" className="font-bold text-2xl text-indigo-600 font-['Poppins',Helvetica]">
            SmartCuts
          </a>
        </div>

        {/* Navigation and Sign In */}
        <div className="flex items-center space-x-8">
          <nav className="flex items-center space-x-6">
            <a
              href="salon"
              className="font-['Poppins',Helvetica] font-normal text-base text-indigo-600"
            >
              Salons
            </a>
            <a
              href="about"
              className="font-['Poppins',Helvetica] font-normal text-base text-gray-600"
            >
              About us
            </a>
            <a
              href="contact"
              className="font-['Poppins',Helvetica] font-normal text-base text-gray-600"
            >
              Contact us
            </a>
          </nav>

          <Button className="rounded-full bg-indigo-600 text-white font-['Poppins',Helvetica] font-normal px-6 h-10">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};
