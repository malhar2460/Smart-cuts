import React from "react";
import { Button } from "../../components/ContactUs_ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ContactUs_ui/card";
import { Input } from "../../components/ContactUs_ui/input";
import { Separator } from "../../components/ContactUs_ui/separator";
import { Textarea } from "../../components/ContactUs_ui/textarea";

export const ContactUs = (): JSX.Element => {
  // Contact information data
  const contactInfo = [
    {
      icon: "/frame-4.svg",
      title: "Address",
      content: "123 Business Street, Suite 100 New York, NY 10001",
    },
    {
      icon: "/frame-6.svg",
      title: "Phone",
      content: "+1 (555) 123-4567",
    },
    {
      icon: "/frame.svg",
      title: "Email",
      content: "contact@smartcuts.com",
    },
  ];

  // Business hours data
  const businessHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  // Footer company links
  const companyLinks = ["About", "Careers", "Press", "Blog"];

  // Footer support links
  const supportLinks = [
    "Help Center",
    "Contact Us",
    "Privacy Policy",
    "Terms of Service",
  ];

  // Social media icons
  const socialIcons = [
    "/frame-1.svg",
    "/frame-3.svg",
    "/frame-2.svg",
    "/frame-5.svg",
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b">
        <div className="container flex justify-between items-center h-[87px] px-4">
          <a href="/" className="font-bold text-indigo-600 text-2xl">SmartCuts</a>
          <nav className="flex items-center gap-6">
            <a href="salon" className="text-gray-600">
              Salons
            </a>
            <a href="about" className="text-gray-600">
              About us
            </a>
            <a href="contact" className="text-indigo-600">
              Contact us
            </a>
            <Button className="rounded-full bg-indigo-600 text-white">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Contact Form */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Send us a message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="font-medium text-sm text-gray-700"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    className="h-[42px]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="font-medium text-sm text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="h-[42px]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="font-medium text-sm text-gray-700"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="Enter subject"
                    className="h-[42px]"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="font-medium text-sm text-gray-700"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here"
                    className="h-32 resize-none"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information and Business Hours */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex items-center justify-center">
                      <img
                        src={item.icon}
                        alt={item.title}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-black">{item.title}</h3>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {businessHours.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{item.day}</span>
                      <span className="font-medium">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <h2 className="font-bold text-2xl text-white">SmartCuts</h2>
              <p className="text-gray-400">
                Making salon management smarter and more efficient.
              </p>
              <div className="flex space-x-4">
                {socialIcons.map((icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="flex items-center justify-center"
                  >
                    <img src={icon} alt="Social media" className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-base mb-6">Company</h3>
              <ul className="space-y-4">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-bold text-base mb-6">Support</h3>
              <ul className="space-y-4">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="font-bold text-base mb-6">Subscribe</h3>
              <p className="text-gray-400 mb-6">
                Get the latest news and updates
              </p>
              <div className="flex">
                <Input
                  placeholder="Enter your email"
                  className="bg-gray-800 border-0 rounded-r-none text-gray-400 h-10"
                />
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-l-none h-10">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="text-center text-gray-400">
            © 2025 SmartCuts. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
