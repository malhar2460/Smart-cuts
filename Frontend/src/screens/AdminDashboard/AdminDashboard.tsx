import { BellIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useParams } from "react-router-dom";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection.tsx";

const navItems = [
  { name: "Dashboard", icon: "/frame-21.svg", path: "/admindashboard", active: true },
  { name: "Staff", icon: "/frame-33.svg", path: "/adminstaff", active: false },
  { name: "Schedule", icon: "/frame-15.svg", path: "/adminschedule", active: false },
  { name: "Services", icon: "/frame-32.svg", path: "/", active: false },
  { name: "Reports", icon: "/frame-9.svg", path: "/", active: false },
];

export const AdminDashboard = (): JSX.Element => {
  const queryParams = new URLSearchParams(window.location.search);
  const admin_id = localStorage.getItem('admin_id');

  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statsData, setStatsData] = useState({
    todays_appointments: 0,
    revenue_today: 0,
    new_customers: 0,
    average_rating: 0,
    total_reviews: 0,
  });

  useEffect(() => {
    if (admin_id) {
      // Fetch summary stats dynamically
      axios
        .get(`http://localhost/Backend/admin_dashboard_summary.php?admin_id=${admin_id}`, {
          transformResponse: [
            function (data) {
              const jsonStart = data.indexOf("{");
              if (jsonStart !== -1) {
                try {
                  return JSON.parse(data.slice(jsonStart));
                } catch (e) {
                  console.error("Error parsing JSON:", e);
                  return {};
                }
              }
              return {};
            },
          ],
        })
        .then((res) => {
          console.log("Transformed API response (stats):", res.data);
          if (res.data?.status && res.data.data) {
            setStatsData(res.data.data);
          } else {
            console.error("API error or unexpected format (stats):", res.data?.message);
          }
        })
        .catch((err) => console.error("Error fetching stats:", err));

      // Fetch upcoming appointments
      axios
        .get(
          `http://localhost/Backend/admin_dashboard_upcoming_app.php?admin_id=${admin_id}`,
          {
            transformResponse: [
              function (data) {
                const jsonStart = data.indexOf("{");
                if (jsonStart !== -1) {
                  try {
                    return JSON.parse(data.slice(jsonStart));
                  } catch (e) {
                    console.error("Error parsing JSON:", e);
                    return {};
                  }
                }
                return {};
              },
            ],
          }
        )
        .then((res) => {
          console.log("Transformed API response (appointments):", res.data);
          if (res.data?.status && Array.isArray(res.data.data)) {
            setAppointments(res.data.data);
          } else {
            setAppointments([]);
            console.error("API error or unexpected format (appointments):", res.data?.message);
          }
        })
        .catch((err) => console.error("Error fetching appointments:", err));

      // Fetch recent reviews
      axios
        .get(
          `http://localhost/Backend/admin_dashboard_recent_rev.php?salon_id=${admin_id}`,
          {
            transformResponse: [
              function (data) {
                const jsonStart = data.indexOf("{");
                if (jsonStart !== -1) {
                  try {
                    return JSON.parse(data.slice(jsonStart));
                  } catch (e) {
                    console.error("Error parsing JSON:", e);
                    return [];
                  }
                }
                return [];
              },
            ],
          }
        )
        .then((res) => {
          console.log("Transformed API response (reviews):", res.data);
          if (res.data?.status && Array.isArray(res.data.reviews)) {
            setReviews(res.data.reviews);
          } else {
            setReviews([]);
            console.error("API error or unexpected format (reviews):", res.data?.message);
          }
        })
        .catch((err) => console.error("Error fetching reviews:", err));
    }
  }, [admin_id]);

  // Convert statsData into an array for mapping
  const statCards = [
    {
      title: "Today's Appointments",
      value: statsData.todays_appointments,
      icon: "/frame-30.svg",
      change: "12% from yesterday",
    },
    {
      title: "Revenue Today",
      value: `$${Number(statsData.revenue_today).toLocaleString()}`,
      icon: "/frame-31.svg",
      change: "8% from yesterday",
    },
    {
      title: "New Customers",
      value: statsData.new_customers,
      icon: "/frame-3.svg",
      change: "4% from yesterday",
    },
    {
      title: "Average Rating",
      value: statsData.average_rating,
      subtitle: `Based on ${statsData.total_reviews} reviews`,
      icon: "/frame-6.svg",
    },
  ];

  return (
    <div className="flex h-[769px] bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      {/* Sidebar */}
      {/* <aside className="relative w-64 h-full bg-white border-r">
        <div className="p-4">
          <h1 className="font-bold text-indigo-600 text-2xl leading-6">
            SmartCuts
          </h1>
          <nav className="mt-16">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link to={item.path}>
                    <Button
                      variant={item.active ? "secondary" : "ghost"}
                      className={`w-full justify-start ${item.active ? "bg-blue-50 text-blue-600" : "text-gray-700"
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

        <div className="absolute bottom-14 left-0 w-full px-4">
          <Link to={`/adminprofile?admin_id=${admin_id}`}>
            <Button variant="ghost" className="w-full justify-start text-gray-700">
              <img
                src={`http://localhost/Backend/${JSON.parse(localStorage.getItem('user') || '{}').photoUrl || 'default-profile.png'}`}
                alt="Profile"
                className="w-6 h-6 rounded-full mr-3 object-cover"
              />
              Profile
            </Button>
          </Link>
        </div>
      </aside> */}
      <HeaderSection/>

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
              {/* <div className="relative">
                <BellIcon className="h-5 w-5 text-gray-600" />
                <Badge className="absolute left-2 rounded-full font-normal -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  <span className="text-xs">3</span>
                </Badge>
              </div> */}
              {/* <Avatar className="h-10 w-10">
                <AvatarImage src="..//img.png" alt="User" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar> */}
            </div>
          </header>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {statCards.map((card, index) => (
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
                <Button variant="link" className="text-blue-600 font-['Poppins']">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Array.isArray(appointments) && appointments.length > 0 ? (
                    appointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage
                              src="/default-avatar.png"
                              alt={appointment.customer_name}
                            />
                            <AvatarFallback>
                              {appointment.customer_name?.[0] || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-800 text-base font-['Poppins']">
                              {appointment.customer_name}
                            </p>
                            <p className="text-sm text-gray-500 font-['Poppins']">
                              {appointment.service_name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800 text-base font-['Poppins']">
                            {appointment.appointment_date}
                          </p>
                          <p className="text-sm text-gray-500 font-['Poppins']">
                            {appointment.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No appointments found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card className="shadow-[0px_1px_2px_#0000000d]">
              <CardHeader className="flex flex-row items-center justify-between pb-0">
                <CardTitle className="text-lg font-bold text-gray-800 font-['Poppins']">
                  Recent Reviews
                </CardTitle>
                <Button variant="link" className="text-blue-600 font-['Poppins']">
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
                              src={i < review.rating ? "/frame-6.svg" : "/frame-18.svg"}
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
