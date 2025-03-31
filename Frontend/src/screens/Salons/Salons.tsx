import {
  ChevronDownIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  TwitterIcon,
} from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

export const Salons = (): JSX.Element => {
  // Data for service categories
  const serviceCategories = [
    { id: 1, name: "Haircut", selected: true },
    { id: 2, name: "Coloring", selected: false },
    { id: 3, name: "Styling", selected: false },
    { id: 4, name: "Treatment", selected: false },
  ];

  // Data for filter options
  const filterOptions = [
    { id: 1, name: "Price Range" },
    { id: 2, name: "Duration" },
    { id: 3, name: "Rating" },
  ];

  // Data for salon cards
  const salonCards = [
    {
      id: 1,
      name: "Style & Grace Salon",
      image: "..//img.png",
      badge: "Featured",
      rating: 4.5,
      reviews: 128,
      description:
        "Luxury salon offering premium cuts, coloring, and styling services in a modern setting.",
      stars: 4.5,
    },
    {
      id: 2,
      name: "Chic Cuts Studio",
      image: "..//img-1.png",
      badge: "Popular",
      rating: 4,
      reviews: 96,
      description:
        "Trendy salon specializing in modern cuts and creative coloring techniques.",
      stars: 4,
    },
    {
      id: 3,
      name: "Elite Hair Lounge",
      image: "..//img-2.png",
      badge: "",
      rating: 5,
      reviews: 156,
      description:
        "Premium salon experience with expert stylists and luxury hair treatments.",
      stars: 5,
    },
  ];

  // Data for footer links
  const companyLinks = [
    { id: 1, name: "About" },
    { id: 2, name: "Careers" },
    { id: 3, name: "Press" },
    { id: 4, name: "Blog" },
  ];

  const supportLinks = [
    { id: 1, name: "Help Center" },
    { id: 2, name: "Contact Us" },
    { id: 3, name: "Privacy Policy" },
    { id: 4, name: "Terms of Service" },
  ];

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon
          key={`full-${i}`}
          className="w-[18px] h-4 text-yellow-400 fill-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarIcon
          key="half"
          className="w-[18px] h-4 text-yellow-400 fill-yellow-400"
        />,
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <StarIcon
          key={`empty-${i}`}
          className="w-[18px] h-4 text-yellow-400"
        />,
      );
    }

    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white border-2 border-solid border-[#ced4da]">
      {/* Header */}
      <header className="w-full py-6 px-20 bg-white">
        <div className="flex items-center justify-between">
          <a href="/" className="font-bold text-indigo-600 text-2xl font-['Poppins',Helvetica]">
            SmartCuts
          </a>
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-6">
              <a
                href="salon"
                className="font-['Poppins',Helvetica] text-indigo-600 text-base"
              >
                Salons
              </a>
              <a
                href="about"
                className="font-['Poppins',Helvetica] text-gray-600 text-base"
              >
                About us
              </a>
              <a
                href="contact"
                className="font-['Poppins',Helvetica] text-gray-600 text-base"
              >
                Contact us
              </a>
            </nav>
            <Button className="bg-indigo-600 rounded-full font-['Poppins',Helvetica] text-base">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 px-12 py-6">
        {/* SearchIcon Section */}
        <div className="max-w-7xl mx-auto mt-6 mb-10">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-4 top-3.5 w-4 h-4 text-[#adaebc]" />
              <Input
                className="pl-12 h-[50px] rounded-xl text-base font-['Inter',Helvetica] text-[#adaebc]"
                placeholder="SearchIcon salons..."
              />
            </div>
            <div className="relative w-64">
              <MapPinIcon className="absolute left-4 top-3.5 w-3 h-4 text-[#adaebc]" />
              <Input
                className="pl-12 h-[50px] rounded-xl text-base font-['Inter',Helvetica] text-[#adaebc]"
                placeholder="Location"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex space-x-4 mb-6">
            {serviceCategories.map((category) => (
              <Button
                key={category.id}
                variant={category.selected ? "default" : "outline"}
                className={`rounded-full px-6 py-2.5 h-10 ${
                  category.selected
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 border-0"
                } font-['Inter',Helvetica] text-base`}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="flex space-x-4">
            {filterOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className="flex justify-between items-center h-10 bg-white rounded-lg font-['Inter',Helvetica] text-base"
              >
                {option.name}
                <ChevronDownIcon className="ml-2 h-6 w-6" />
              </Button>
            ))}
          </div>
        </div>

        {/* Salon Cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {salonCards.map((salon) => (
            <Card
              key={salon.id}
              className="rounded-xl shadow-sm overflow-hidden"
            >
              <div
                className="relative h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${salon.image})` }}
              >
                {salon.badge && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white text-black font-medium text-sm px-3 py-1 rounded-full">
                      {salon.badge}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-['Inter',Helvetica] text-xl font-normal text-black mb-4">
                  {salon.name}
                </h3>
                <div className="flex items-center mb-4">
                  <div className="flex">{renderStars(salon.stars)}</div>
                  <span className="ml-2 font-['Inter',Helvetica] text-gray-600 text-base">
                    ({salon.reviews} reviews)
                  </span>
                </div>
                <p className="font-['Inter',Helvetica] text-gray-600 text-base mb-6">
                  {salon.description}
                </p>
                <a href="service">
                  <Button className="w-full bg-blue-600 text-white font-['Inter',Helvetica] text-base py-3.5">
                    Book Appointment
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-20 px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-16">
            {/* Company Info */}
            <div>
              <h2 className="font-['Poppins',Helvetica] font-bold text-2xl mb-[60px]">
                SmartCuts
              </h2>
              <p className="font-['Poppins',Helvetica] text-gray-400 text-base mb-8">
                Making salon management smarter and more efficient.
              </p>
              <div className="flex space-x-4">
                <FacebookIcon className="w-5 h-5 text-gray-400" />
                <TwitterIcon className="w-5 h-5 text-gray-400" />
                <InstagramIcon className="w-5 h-5 text-gray-400" />
                <LinkedinIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-['Poppins',Helvetica] font-bold text-base mb-12">
                Company
              </h3>
              <ul className="space-y-10">
                {companyLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href="#"
                      className="font-['Poppins',Helvetica] text-gray-300 text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="font-['Poppins',Helvetica] font-bold text-base mb-12">
                Support
              </h3>
              <ul className="space-y-10">
                {supportLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href="#"
                      className="font-['Poppins',Helvetica] text-gray-300 text-base"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe */}
            <div>
              <h3 className="font-['Poppins',Helvetica] font-bold text-base mb-12">
                Subscribe
              </h3>
              <p className="font-['Poppins',Helvetica] text-gray-400 text-base mb-6">
                Get the latest news and updates
              </p>
              <div className="flex">
                <Input
                  className="h-10 bg-gray-800 border-0 rounded-l-full text-[#adaebc] px-4 font-['Poppins',Helvetica]"
                  placeholder="Enter your email"
                />
                <Button className="h-10 bg-indigo-600 rounded-r-full font-['Poppins',Helvetica] text-base">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800 mb-8" />

          <div className="text-center">
            <p className="font-['Poppins',Helvetica] text-gray-400 text-base">
              © 2025 SmartCuts. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
