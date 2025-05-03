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
} from "../../components/AdminDashboard_ui/card.tsx";
import axios from "axios";
import { HeaderSection } from "./sections/HeaderSection/HeaderSection.tsx";

interface Stats {
  todays_appointments: number;
  yesterdays_appointments: number;
  revenue_today: number;
  revenue_yesterday: number;
  new_customers: number;
  new_customers_yesterday: number;
  average_rating: number;
  average_rating_previous: number;
  total_reviews: number;
}

interface Appointment {
  appointment_date: string;
  status: string;
  customer_name: string;
  service_name: string;
}

interface Review {
  customer_name: string;
  rating: number;
  review_text: string;
}

export const AdminDashboard = (): JSX.Element => {
  const admin_id = localStorage.getItem("admin_id")!;
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [statsData, setStatsData] = useState<Stats>({
    todays_appointments: 0,
    yesterdays_appointments: 0,
    revenue_today: 0,
    revenue_yesterday: 0,
    new_customers: 0,
    new_customers_yesterday: 0,
    average_rating: 0,
    average_rating_previous: 0,
    total_reviews: 0,
  });

  const pctChange = (current: number, previous: number): string => {
    if (previous === 0) return "—";
    const delta = ((current - previous) / previous) * 100;
    return `${delta.toFixed(1)}% from yesterday`;
  };

  useEffect(() => {
    if (!admin_id) return;

    axios
      .get(`http://localhost/Backend/admin_dashboard_summary.php?admin_id=${admin_id}`, {
        transformResponse: [(data: string) => {
          const i = data.indexOf("{");
          return i >= 0 ? JSON.parse(data.slice(i)) : {};
        }],
      })
      .then((res) => {
        if (res.data?.status && res.data.data) {
          setStatsData(res.data.data as Stats);
        } else {
          console.error("Stats format error", res.data);
        }
      })
      .catch(console.error);

    axios
      .get(`http://localhost/Backend/admin_dashboard_upcoming_app.php?admin_id=${admin_id}`, {
        transformResponse: [(data: string) => {
          const i = data.indexOf("{");
          return i >= 0 ? JSON.parse(data.slice(i)) : {};
        }],
      })
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.data)) {
          setAppointments(res.data.data);
        } else {
          console.error("Appointments format error", res.data);
        }
      })
      .catch(console.error);

    axios
      .get(`http://localhost/Backend/admin_dashboard_recent_rev.php?salon_id=${admin_id}`, {
        transformResponse: [(data: string) => {
          const i = data.indexOf("{");
          return i >= 0 ? JSON.parse(data.slice(i)) : {};
        }],
      })
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        } else {
          console.error("Reviews format error", res.data);
        }
      })
      .catch(console.error);

  }, [admin_id]);

  const statCards = [
    {
      title: "Today's Appointments",
      value: statsData.todays_appointments,
      icon: "/frame-30.svg",
      change: pctChange(statsData.todays_appointments, statsData.yesterdays_appointments),
    },
    {
      title: "Revenue Today",
      value: `$${statsData.revenue_today.toLocaleString()}`,
      icon: "/frame-31.svg",
      change: pctChange(statsData.revenue_today, statsData.revenue_yesterday),
    },
    {
      title: "New Customers",
      value: statsData.new_customers,
      icon: "/frame-3.svg",
      change: pctChange(statsData.new_customers, statsData.new_customers_yesterday),
    },
    {
      title: "Average Rating",
      value: statsData.average_rating.toFixed(1),
      subtitle: `Based on ${statsData.total_reviews} reviews`,
      icon: "/frame-6.svg",
      change: pctChange(statsData.average_rating, statsData.average_rating_previous),
    },
  ];

  // If not showing all, only take first 3
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const [showAllAppointments, setShowAllAppointments] = useState(false);

  return (
    <div className="flex min-h-screen bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      <HeaderSection />

      <main className="flex-1 bg-gray-50 overflow-scroll ml-64">
        <div className="p-8">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="font-bold text-gray-800 text-2xl">Dashboard Overview</h1>
              <p className="text-gray-500 mt-2">Welcome back!</p>
            </div>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {statCards.map((card, idx) => (
              <Card key={idx} className="shadow-[0px_1px_2px_#0000000d]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-normal text-gray-500">
                      {card.title}
                    </CardTitle>
                    <img src={card.icon} alt="" className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                  {card.change && (
                    <p className="text-sm text-emerald-600 mt-4 flex items-center">
                      <img src="/frame-29.svg" alt="" className="h-3.5 w-2.5 mr-1.5" />
                      {card.change}
                    </p>
                  )}
                  {card.subtitle && (
                    <p className="text-sm text-gray-500 mt-4">{card.subtitle}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Appointments & Reviews */}
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2 shadow-[0px_1px_2px_#0000000d]">
              <CardHeader className="flex justify-between pb-0">
                <CardTitle className="text-lg font-bold text-gray-800">
                  Upcoming Appointments
                </CardTitle>
                <Button
                  variant="link"
                  className="text-blue-600"
                  onClick={() => setShowAllAppointments(!showAllAppointments)}
                >
                  {showAllAppointments ? "Show Less" : "View All"}
                </Button>

              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {appointments.length > 0 ? (
                  (showAllAppointments ? appointments : appointments.slice(0, 3)).map((app, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback>{app.customer_name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{app.customer_name}</p>
                          <p className="text-sm text-gray-500">{app.service_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{app.appointment_date}</p>
                        <p className="text-sm text-gray-500">{app.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No appointments found</p>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-[0px_1px_2px_#0000000d]">
              <CardHeader className="flex justify-between pb-0">
                <CardTitle className="text-lg font-bold text-gray-800">Recent Reviews</CardTitle>
                <Button
                  variant="link"
                  className="text-blue-600"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                >
                  {showAllReviews ? "Show Less" : "View All"}
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {displayedReviews.map((r, i) => (
                  <div key={i} className="py-4 border-b border-gray-100">
                    <div className="flex items-center mb-3">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback>{r.customer_name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{r.customer_name}</span>
                      <div className="flex ml-4">
                        {[...Array(5)].map((_, star) => (
                          <img
                            key={star}
                            src={star < r.rating ? "/frame-6.svg" : "/frame-18.svg"}
                            alt=""
                            className="h-4 w-4"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{r.review_text}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p>No reviews found</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
