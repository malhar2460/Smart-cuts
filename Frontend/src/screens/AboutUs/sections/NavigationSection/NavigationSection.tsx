import React from "react";
import { Button } from "../../../../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/AboutUs_ui/navigation-menu";

export const NavigationSection = (): JSX.Element => {
  // Navigation links data
  const navLinks = [
    { text: "Salons", href: "salon", active: false },
    { text: "About us", href: "about", active: true },
    { text: "Contact us", href: "contact", active: false },
  ];

  return (
    <header className="w-full h-[72px] flex items-center justify-center border-0 border-none">
      <div className="w-full max-w-[1248px] h-10 flex justify-between items-center px-4">
        {/* Logo */}
        <div className="h-8">
          <a href="/" className="font-['Poppins',Helvetica] font-bold text-indigo-600 text-2xl leading-6">
            SmartCuts
          </a>
        </div>

        {/* Navigation and Sign In */}
        <div className="flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={link.href}
                    className={`px-3 py-2 font-['Poppins',Helvetica] font-normal text-base leading-4 ${
                      link.active ? "text-indigo-600" : "text-gray-600"
                    }`}
                  >
                    {link.text}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button className="w-[102px] h-10 bg-indigo-600 rounded-full font-['Poppins',Helvetica] font-normal text-white text-base">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
};
