import {
  BarChart3Icon,
  BellIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  ScissorsIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import { Avatar, AvatarImage } from "../../components/AdminSchedule_ui/avatar";
import { Badge } from "../../components/AdminSchedule_ui/badge";
import { Card, CardContent } from "../../components/AdminSchedule_ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/AdminSchedule_ui/table";
import { Link } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "../../components/AdminSchedule_ui/toggle-group";

import { Button } from "../../components/AdminDashboard_ui/button.tsx";


export const AdminSchedule = (): JSX.Element => {
  // Data for statistics cards
  const statsData = [
    { title: "Total Appointments", value: "24" },
    { title: "Pending Confirmation", value: "3" },
    { title: "Available Slots", value: "12" },
    { title: "Revenue Today", value: "$1,280" },
  ];

  // Data for stylists
  const stylists = [
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Emma Wilson",
    "David Brown",
    "Lisa Anderson",
    "Rachel Taylor",
  ];

  // Data for appointments
  const appointments = [
    {
      time: "9:00 AM",
      appointments: [
        {
          stylistIndex: 0,
          service: "Haircut",
          client: "John Doe",
          color: "bg-blue-100",
        },
        {
          stylistIndex: 2,
          service: "Color",
          client: "Jane Smith",
          color: "bg-emerald-100",
        },
        {
          stylistIndex: 5,
          service: "Styling",
          client: "Alice Brown",
          color: "bg-violet-100",
        },
      ],
    },
    {
      time: "10:00 AM",
      appointments: [
        {
          stylistIndex: 1,
          service: "Manicure",
          client: "Sarah Lee",
          color: "bg-amber-100",
        },
        {
          stylistIndex: 3,
          service: "Haircut",
          client: "Tom Wilson",
          color: "bg-blue-100",
        },
      ],
    },
  ];

  return (
    <div className="flex h-[670px] bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full bg-white border-r">
        <div className="p-4">
          <h1 className="font-bold text-indigo-600 text-2xl leading-6 mb-16">
            SmartCuts
          </h1>

          <nav className="space-y-2">
          <Link to="/admindashboard">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-10 text-gray-700"
            >
              <img src="/frame-34.svg" alt="" className="w-4 h-4 mr-3" style={{ color: "#374151" }} />
              Dashboard
            </Button>
            </Link>
          <Link to="/adminstaff">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-10  text-grey-700"
            >
              <img src="/frame-33.svg" alt="" className="w-4 h-4 mr-3"></img>
              Staff
            </Button>
          </Link>

            <Button
              variant="secondary"
              className="w-full justify-start px-4 py-2.5 h-10 bg-indigo-50 text-indigo-600"
            >
              <img src="/frame-30.svg" alt="" className="w-4 h-4 mr-3"></img>
              Schedule
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-10 text-gray-700"
            >
              <img src="/frame-32.svg" alt="" className="w-4 h-4 mr-3"></img>
              Services
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-10 text-gray-700"
            >
              <img src="/frame-9.svg" alt="" className="w-4 h-4 mr-3"></img>
              Reports
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-5">
          {/* Header with notifications and profile */}
          <div className="flex justify-end mb-5">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <BellIcon className="w-[17.5px] h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white rounded-full">
                  <span className="text-xs">3</span>
                </Badge>
              </div>
              <Avatar className="w-10 h-10">
                <AvatarImage src="..//img.png" alt="Profile" />
              </Avatar>
            </div>
          </div>

          {/* Schedule section */}
          <div className="max-w-[1184px] mx-auto">
            {/* Schedule header card */}
            <Card className="mb-6 shadow-[0px_1px_2px_#0000000d]">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center">
                    <h2 className="font-bold text-2xl leading-6 mr-4">
                      Schedule
                    </h2>
                    <ToggleGroup type="single" defaultValue="day">
                      <ToggleGroupItem
                        value="day"
                        className="bg-blue-600 text-white"
                      >
                        Day
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="week"
                        className="bg-gray-100 text-gray-600"
                      >
                        Week
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="month"
                        className="bg-gray-100 text-gray-600"
                      >
                        Month
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>

                  <div className="flex items-center">
                    <button className="p-2 rounded-lg">
                      <ChevronLeftIcon className="w-2.5 h-4" />
                    </button>
                    <span className="mx-4 text-lg">March 15, 2025</span>
                    <button className="p-2 rounded-lg">
                      <ChevronRightIcon className="w-2.5 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-4 gap-4">
                  {statsData.map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="font-bold text-2xl">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Schedule table */}
            <Card className="shadow-[0px_1px_2px_#0000000d]">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[142px] border-r py-5">
                        Time
                      </TableHead>
                      {stylists.map((stylist, index) => (
                        <TableHead
                          key={index}
                          className={`w-[142px] ${index < stylists.length - 1 ? "border-r" : ""}`}
                        >
                          {stylist.includes(" ") ? (
                            <>
                              {stylist.split(" ")[0]}
                              <br />
                              {stylist.split(" ")[1]}
                            </>
                          ) : (
                            stylist
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((timeSlot, timeIndex) => (
                      <TableRow
                        key={timeIndex}
                        className={timeIndex > 0 ? "border-t" : ""}
                      >
                        <TableCell className="border-r h-[100px]">
                          {timeSlot.time}
                        </TableCell>
                        {stylists.map((_, stylistIndex) => {
                          const appointment = timeSlot.appointments.find(
                            (app) => app.stylistIndex === stylistIndex,
                          );

                          return (
                            <TableCell
                              key={stylistIndex}
                              className={`h-[100px] ${stylistIndex < stylists.length - 1 ? "border-r" : ""}`}
                            >
                              {appointment && (
                                <div
                                  className={`${appointment.color} rounded-lg p-2 h-[84px]`}
                                >
                                  <p className="text-sm text-black mb-1">
                                    {appointment.service}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {appointment.client}
                                  </p>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
