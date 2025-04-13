import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../../../../components/HomePage_ui/button";
import { Input } from "../../../../components/HomePage_ui/input";

export const FooterSection = (): JSX.Element => {
  // Company links data
  const companyLinks = [
    { title: "About", href: "#" },
    { title: "Careers", href: "#" },
    { title: "Press", href: "#" },
    { title: "Blog", href: "#" },
  ];

  // Support links data
  const supportLinks = [
    { title: "Help Center", href: "#" },
    { title: "Contact Us", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ];

  // Social media icons data
  const socialIcons = [
    { icon: <FacebookIcon size={20} />, href: "#" },
    { icon: <TwitterIcon size={20} />, href: "#" },
    { icon: <InstagramIcon size={20} />, href: "#" },
    { icon: <YoutubeIcon size={20} />, href: "#" },
  ];

  return (
    <footer className="w-full bg-gray-900 py-20">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-bold text-2xl text-white font-['Poppins',Helvetica]">
              SmartCuts
            </h2>
            <p className="text-gray-400 font-['Poppins',Helvetica] text-base">
              Making salon management smarter and more efficient.
            </p>
            <div className="flex space-x-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="flex items-center justify-center w-5 h-5 text-gray-400 hover:text-white transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Company
            </h3>
            <div className="flex flex-col space-y-4">
              {companyLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors font-['Poppins',Helvetica] text-base"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Support Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Support
            </h3>
            <div className="flex flex-col space-y-4">
              {supportLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors font-['Poppins',Helvetica] text-base"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>

          {/* Subscribe Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-base text-white font-['Poppins',Helvetica]">
              Subscribe
            </h3>
            <p className="text-gray-400 font-['Poppins',Helvetica] text-base">
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

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 font-['Poppins',Helvetica] text-base">
            © 2025 SmartCuts. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
