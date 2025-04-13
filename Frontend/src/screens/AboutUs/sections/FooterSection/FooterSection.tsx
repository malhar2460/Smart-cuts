import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../../../../components/AboutUs_ui/button";
import { Input } from "../../../../components/AboutUs_ui/input";

export const FooterSection = (): JSX.Element => {
  // Footer navigation links data
  const companyLinks = [
    { title: "About", href: "#" },
    { title: "Careers", href: "#" },
    { title: "Press", href: "#" },
    { title: "Blog", href: "#" },
  ];

  const supportLinks = [
    { title: "Help Center", href: "#" },
    { title: "Contact Us", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ];

  // Social media icons
  const socialIcons = [
    { icon: <FacebookIcon size={20} />, href: "#" },
    { icon: <TwitterIcon size={20} />, href: "#" },
    { icon: <InstagramIcon size={20} />, href: "#" },
    { icon: <LinkedinIcon size={20} />, href: "#" },
  ];

  return (
    <footer className="w-full bg-gray-900 py-20">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-6">
            <h2 className="font-bold text-2xl text-white font-['Poppins',Helvetica]">
              SmartCuts
            </h2>
            <p className="text-gray-400 font-['Poppins',Helvetica]">
              Making salon management smarter and more efficient.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company links */}
          <div className="space-y-6">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Company
            </h3>
            <ul className="space-y-4">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors font-['Poppins',Helvetica]"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support links */}
          <div className="space-y-6">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Support
            </h3>
            <ul className="space-y-4">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors font-['Poppins',Helvetica]"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe section */}
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
                className="rounded-r-none bg-gray-800 border-0 text-[#adaebc] font-['Poppins',Helvetica]"
              />
              <Button className="rounded-l-none bg-indigo-600 hover:bg-indigo-700 font-['Poppins',Helvetica]">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 font-['Poppins',Helvetica]">
            © 2025 SmartCuts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
