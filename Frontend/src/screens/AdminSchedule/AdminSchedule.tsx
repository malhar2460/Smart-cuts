import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
} from "date-fns";
import axios from "axios";

import { BellIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/AdminSchedule_ui/avatar";
import { Badge } from "../../components/AdminSchedule_ui/badge";
import { Card, CardContent } from "../../components/AdminSchedule_ui/card";
import { ToggleGroup, ToggleGroupItem } from "../../components/AdminSchedule_ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/AdminSchedule_ui/table";
import { Button } from "../../components/AdminStaff_ui/button";

export const AdminSchedule = (): JSX.Element => {
  const navigate = useNavigate();

  // States for current date and view mode
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  // States for stylists and appointments
  const [stylists, setStylists] = useState<string[]>([]);
  /* 
    For day view, our backend returns appointments grouped by time slot.
    For week and month view, we expect appointments to be an array of appointment objects
    (each with at least appointment_id, date_time (or appointment_date), stylistIndex, service, client, color).
    Adjust your backend accordingly if needed.
  */
  const [appointments, setAppointments] = useState<any[]>([]);
  const [statsData, setStatsData] = useState([
    { title: "Total Appointments", value: "0" },
    { title: "Pending Confirmation", value: "0" },
    { title: "Available Slots", value: "0" },
    { title: "Revenue Today", value: "$0" },
  ]);

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate, viewMode]);

  const fetchScheduleData = async () => {
    try {
      const response = await axios.get("http://localhost/Backend/admin_schedule_appointment.php", {
        params: {
          date: format(currentDate, "yyyy-MM-dd"),
          viewMode, // will be "day", "week", or "month"
        },
      });
      if (response.data?.status) {
        setStylists(response.data.stylists || []);
        setAppointments(response.data.appointments || []);
        setStatsData(response.data.stats || statsData);
      } else {
        console.log("API error:", response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  const handleViewModeChange = (value: "day" | "week" | "month") => {
    setViewMode(value);
  };

  const handlePrevDate = () => {
    if (viewMode === "day") setCurrentDate(subDays(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextDate = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
    else if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addMonths(currentDate, 1));
  };

  // When an appointment is clicked, navigate to its detail page.
  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/adminschedule/appointment/${appointmentId}`);
  };

  // --- Render different layouts based on viewMode ---

  // Day View Layout: Use your existing table of time slots.
  const renderDayView = () => (
    <Card className="border border-gray-200 shadow-none">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] py-4 text-gray-600">Time</TableHead>
              {stylists.map((stylist, index) => (
                <TableHead key={index} className="py-4 text-gray-600">{stylist}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((timeSlot, timeIndex) => (
              <TableRow key={timeIndex} className="hover:bg-gray-50">
                <TableCell className="text-gray-700 font-semibold">{timeSlot.time}</TableCell>
                {stylists.map((_, stylistIndex) => {
                  const appointment = timeSlot.appointments.find((app: any) => app.stylistIndex === stylistIndex);
                  return (
                    <TableCell key={stylistIndex}>
                      {appointment && (
                        <div
                          className={`${appointment.color} rounded-md p-2 cursor-pointer`}
                          onClick={() => handleAppointmentClick(appointment.appointment_id)}
                        >
                          <p className="text-sm text-gray-900 mb-1">{appointment.service}</p>
                          <p className="text-xs text-gray-600">{appointment.client}</p>
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
  );

  // Week View Layout: Render a table with days of the week as columns.
  const renderWeekView = () => {
    // Calculate the start of the week (assuming Sunday start)
    const startOfWeek = subDays(currentDate, currentDate.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));

    return (
      <Card className="border border-gray-200 shadow-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-4 text-gray-600">Stylist</TableHead>
                {weekDays.map((day, index) => (
                  <TableHead key={index} className="py-4 text-gray-600">
                    {format(day, "EEE dd")}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {stylists.map((stylist, sIndex) => (
                <TableRow key={sIndex}>
                  <TableCell className="font-semibold">{stylist}</TableCell>
                  {weekDays.map((day, dIndex) => {
                    // Look for an appointment for this stylist on the given day.
                    // We assume each appointment object has a "date_time" or "appointment_date" field.
                    const app = appointments.find((appointment: any) => {
                      const appDate = new Date(appointment.date_time || appointment.appointment_date);
                      return (
                        appointment.stylistIndex === sIndex &&
                        format(appDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
                      );
                    });
                    return (
                      <TableCell key={dIndex} onClick={() => app && handleAppointmentClick(app.appointment_id)}>
                        {app && (
                          <div className={`${app.color} rounded-md p-2 cursor-pointer`}>
                            <p className="text-sm text-gray-900 mb-1">{app.service}</p>
                            <p className="text-xs text-gray-600">{app.client}</p>
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
    );
  };

  // Month View Layout: Render a simple calendar grid.
  const renderMonthView = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    // Find the start of the calendar grid (beginning of the week containing the 1st)
    const gridStart = subDays(startOfMonth, startOfMonth.getDay());
    // Find the end of the grid (end of the week containing the last day)
    const gridEnd = addDays(endOfMonth, 6 - endOfMonth.getDay());
    const dayCount = Math.ceil((gridEnd.getTime() - gridStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysArray = Array.from({ length: dayCount }, (_, i) => addDays(gridStart, i));

    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < daysArray.length; i += 7) {
      weeks.push(daysArray.slice(i, i + 7));
    }

    return (
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName, i) => (
            <div key={i} className="text-center font-bold">
              {dayName}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-2 mb-2">
            {week.map((day, di) => {
              // Find all appointments on this day
              const dayAppointments = appointments.filter((appointment: any) => {
                const appDate = new Date(appointment.date_time || appointment.appointment_date);
                return format(appDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
              });
              return (
                <div key={di} className="border p-2 h-24 relative">
                  <div className="absolute top-1 left-1 text-xs font-semibold">{format(day, "d")}</div>
                  {dayAppointments.map((app: any, index: number) => (
                    <div
                      key={index}
                      className={`${app.color} rounded-md p-1 mt-1 text-xs cursor-pointer`}
                      onClick={() => handleAppointmentClick(app.appointment_id)}
                    >
                      {app.service}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-4">
          <h1 className="font-bold text-indigo-600 text-2xl leading-6 mb-16">SmartCuts</h1>
          <nav className="space-y-2">
            <Link to="/admindashboard">
              <Button variant="ghost" className="w-full justify-start px-4 py-2.5 h-10 text-gray-700">
                <img src="/frame-34.svg" alt="Dashboard" className="w-4 h-4 mr-3" />
                Dashboard
              </Button>
            </Link>
            <Link to="/adminstaff">
              <Button variant="ghost" className="w-full justify-start px-4 py-2.5 h-10 text-gray-700">
                <img src="/frame-33.svg" alt="Staff" className="w-4 h-4 mr-3" />
                Staff
              </Button>
            </Link>
            <Button
              variant="secondary"
              className="w-full justify-start px-4 py-2.5 h-10 bg-indigo-50 text-indigo-600"
            >
              <img src="/frame-30.svg" alt="Schedule" className="w-4 h-4 mr-3" />
              Schedule
            </Button>
            <Button variant="ghost" className="w-full justify-start px-4 py-2.5 h-10 text-gray-700">
              <img src="/frame-32.svg" alt="Services" className="w-4 h-4 mr-3" />
              Services
            </Button>
            <Button variant="ghost" className="w-full justify-start px-4 py-2.5 h-10 text-gray-700">
              <img src="/frame-9.svg" alt="Reports" className="w-4 h-4 mr-3" />
              Reports
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        <div className="flex justify-end p-5">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <BellIcon className="w-[17.5px] h-5 text-gray-700" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white rounded-full">
                <span className="text-xs">3</span>
              </Badge>
            </div>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/img.png" alt="Profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="px-5 pb-5 max-w-[1184px] mx-auto">
          {/* Header Card */}
          <Card className="mb-6 border border-gray-200 shadow-none">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center space-x-4">
                  <h2 className="font-bold text-2xl leading-6">Schedule</h2>
                  <ToggleGroup
                    type="single"
                    defaultValue="day"
                    onValueChange={(value) => handleViewModeChange(value as "day" | "week" | "month")}
                  >
                    <ToggleGroupItem
                      value="day"
                      className={`px-3 py-1 rounded ${
                        viewMode === "day" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Day
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="week"
                      className={`px-3 py-1 rounded ${
                        viewMode === "week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Week
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="month"
                      className={`px-3 py-1 rounded ${
                        viewMode === "month" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Month
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex items-center">
                  <button className="p-2" onClick={handlePrevDate}>
                    <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <span className="mx-4 text-lg text-gray-800">
                    {format(currentDate, "MMMM d, yyyy")}
                  </span>
                  <button className="p-2" onClick={handleNextDate}>
                    <ChevronRightIcon className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4">
                {statsData.map((stat, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="font-bold text-2xl">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Layout based on viewMode */}
          {viewMode === "day" && renderDayView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "month" && renderMonthView()}
        </div>
      </main>
    </div>
  );
};
