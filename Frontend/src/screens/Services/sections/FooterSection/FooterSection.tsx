import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../../../../components/Services_ui/button";
import { Input } from "../../../../components/Services_ui/input";

export const FooterSection = (): JSX.Element => {
  // Social media links data
  const socialLinks = [
    { icon: <FacebookIcon size={20} />, alt: "Facebook" },
    { icon: <TwitterIcon size={20} />, alt: "Twitter" },
    { icon: <InstagramIcon size={20} />, alt: "Instagram" },
    { icon: <LinkedinIcon size={20} />, alt: "LinkedIn" },
  ];

  // Company links data
  const companyLinks = ["About", "Careers", "Press", "Blog"];

  // Support links data
  const supportLinks = [
    "Help Center",
    "Contact Us",
    "Privacy Policy",
    "Terms of Service",
  ];

  return (
    <footer className="w-full bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <h2 className="font-bold text-2xl text-white font-['Poppins',Helvetica]">
              SmartCuts
            </h2>
            <p className="text-gray-400 font-['Poppins',Helvetica]">
              Making salon management smarter and more efficient.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 text-gray-400 hover:text-white"
                >
                  {link.icon}
                </Button>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white font-['Poppins',Helvetica]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white font-['Poppins',Helvetica]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Subscribe
            </h3>
            <p className="text-gray-400 font-['Poppins',Helvetica]">
              Get the latest news and updates
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-l-full rounded-r-none bg-gray-800 border-0 text-[#adaebc] font-['Poppins',Helvetica]"
              />
              <Button className="rounded-l-none rounded-r-full bg-indigo-600 hover:bg-indigo-700 font-['Poppins',Helvetica]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 font-['Poppins',Helvetica]">
            © 2025 SmartCuts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
