import { BellIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/AdminDashboard_ui/avatar.tsx";
import { Badge } from "../../components/AdminDashboard_ui/badge.tsx";
import { Button } from "../../components/AdminDashboard_ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../Components/AdminDashboard_ui/card.tsx";
import { Link } from "react-router-dom";

// Data for stats cards
const statsCards = [
  {
    title: "Today's Appointments",
    value: "24",
    change: "12% from yesterday",
    positive: true,
    icon: "/frame-30.svg",
  },
  {
    title: "Revenue Today",
    value: "$1,284",
    change: "8% from yesterday",
    positive: true,
    icon: "/frame-31.svg",
  },
  {
    title: "New Customers",
    value: "12",
    change: "4% from yesterday",
    positive: true,
    icon: "/frame-3.svg",
  },
  {
    title: "Average Rating",
    value: "4.8",
    subtitle: "Based on 156 reviews",
    icon: "/frame-6.svg",
  },
];

// Data for upcoming appointments
const appointments = [
  {
    name: "Emma Wilson",
    service: "Haircut & Styling",
    time: "10:30 AM",
    duration: "30 min",
    avatar: "..//img-1.png",
  },
  {
    name: "Sophie Chen",
    service: "Color & Treatment",
    time: "11:15 AM",
    duration: "90 min",
    avatar: "..//img-2.png",
  },
  {
    name: "James Brown",
    service: "Beard Trim",
    time: "1:00 PM",
    duration: "20 min",
    avatar: "..//img-3.png",
  },
];

// Data for recent reviews
const reviews = [
  {
    name: "Lisa Zhang",
    rating: 5,
    comment:
      "Amazing service! My stylist was very professional and I love my new look.",
    avatar: "..//img-4.png",
  },
  {
    name: "Mike Johnson",
    rating: 4,
    comment: "Great atmosphere and friendly staff. Will definitely come back!",
    avatar: "..//img-5.png",
  },
];

// Navigation items
const navItems = [
  { name: "Dashboard", icon: "/frame-21.svg",path : "/admindashboard", active: true },
  { name: "Staff", icon: "/frame-33.svg",path : "/adminstaff", active: false },
  { name: "Schedule", icon: "/frame-15.svg",path : "/adminschedule", active: false },
  { name: "Services", icon: "/frame-32.svg",path : "/", active: false },
  { name: "Reports", icon: "/frame-9.svg",path : "/", active: false },
];

export const AdminDashboard = (): JSX.Element => {
  return (
    <div className="flex h-[769px] bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-white border-r">
        <div className="p-4">
          <h1 className="font-bold text-indigo-600 text-2xl leading-6 ">
            SmartCuts
          </h1>

          <nav className="mt-16">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        item.active ? "bg-blue-50 text-blue-600" : "text-gray-700"
                      }`}
                    >
                      <img src={item.icon} alt="" className="w-4 h-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="font-bold text-gray-800 text-2xl leading-6 font-['Poppins']">
                Dashboard Overview
              </h1>
              <p className="text-gray-500 text-base mt-2 font-['Poppins']">
                Welcome back, Sarah!
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <Badge className="absolute left-2 rounded-full font-normal -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  <span className="text-xs">3</span>
                </Badge>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src="..//img.png" alt="User" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {statsCards.map((card, index) => (
              <Card key={index} className="shadow-[0px_1px_2px_#0000000d]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-normal text-gray-500 font-['Poppins']">
                      {card.title}
                    </CardTitle>
                    <img src={card.icon} alt="" className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-800 font-['Poppins']">
                    {card.value}
                  </p>
                  {card.change && (
                    <p className="text-sm text-emerald-600 mt-4 flex items-center font-['Poppins']">
                      <img
                        src="/frame-29.svg"
                        alt=""
                        className="h-3.5 w-2.5 mr-1.5"
                      />
                      {card.change}
                    </p>
                  )}
                  {card.subtitle && (
                    <p className="text-sm text-gray-500 mt-4 font-['Poppins']">
                      {card.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Appointments and Reviews */}
          <div className="grid grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <Card className="col-span-2 shadow-[0px_1px_2px_#0000000d]">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-lg font-bold text-gray-800 font-['Poppins']">
                  Upcoming Appointments
                </CardTitle>
                <Button
                  variant="link"
                  className="text-blue-600 font-['Poppins']"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {appointments.map((appointment, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage
                            src={appointment.avatar}
                            alt={appointment.name}
                          />
                          <AvatarFallback>{appointment.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800 text-base font-['Poppins']">
                            {appointment.name}
                          </p>
                          <p className="text-sm text-gray-500 font-['Poppins']">
                            {appointment.service}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800 text-base font-['Poppins']">
                          {appointment.time}
                        </p>
                        <p className="text-sm text-gray-500 font-['Poppins']">
                          {appointment.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="shadow-[0px_1px_2px_#0000000d]">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-lg font-bold text-gray-800 font-['Poppins']">
                  Recent Reviews
                </CardTitle>
                <Button
                  variant="link"
                  className="text-blue-600 font-['Poppins']"
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-0">
                  {reviews.map((review, index) => (
                    <div key={index} className="py-4 border-b border-gray-100">
                      <div className="flex items-center mb-3">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={review.avatar} alt={review.name} />
                          <AvatarFallback>{review.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-800 text-base font-['Poppins']">
                          {review.name}
                        </span>
                        <div className="flex ml-4">
                          {[...Array(5)].map((_, i) => (
                            <img
                              key={i}
                              src={
                                i < review.rating
                                  ? "/frame-6.svg"
                                  : "/frame-18.svg"
                              }
                              alt="star"
                              className="h-4 w-4"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-['Poppins']">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
