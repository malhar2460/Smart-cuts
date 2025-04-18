import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  format,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from "date-fns";
import axios from "axios";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
} from "lucide-react";
import { Badge } from "../../components/AdminSchedule_ui/badge";
import { Card, CardContent } from "../../components/AdminSchedule_ui/card";
import { ToggleGroup, ToggleGroupItem } from "../../components/AdminSchedule_ui/toggle-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/AdminSchedule_ui/table";
import { Button } from "../../components/AdminStaff_ui/button";
import { HeaderSection } from "../AdminDashboard/sections/HeaderSection/HeaderSection";

interface Appointment {
  appointment_id: number;
  staff_id: number;
  staff_name: string;
  service: string;
  client: string;
  date_time: string;
  color: string;
  notes?: string;
  contact?: string;
}

export const AdminSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const salonId = localStorage.getItem("salon_id");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [stylists, setStylists] = useState<string[]>([]);
  const [daySlots, setDaySlots] = useState<{ time: string; appointments: any[][] }[]>([]);
  const [flatApps, setFlatApps] = useState<Appointment[]>([]);
  const [statsData, setStatsData] = useState([
    { title: "Total Appointments", value: "0" },
    { title: "Pending Confirmation", value: "0" },
    { title: "Available Slots", value: "0" },
    { title: "Revenue Today", value: "$0" },
  ]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  const fetchScheduleData = async (): Promise<void> => {
    if (!salonId) return;
    try {
      const res = await axios.get(
        "http://localhost/Backend/admin_schedule_appointment.php",
        {
          params: {
            salon_id: salonId,
            date: format(currentDate, "yyyy-MM-dd"),
          },
        }
      );
      if (res.data.status) {
        setStylists(res.data.stylists);
        setStatsData(res.data.stats);
        viewMode === "day"
          ? setDaySlots(res.data.appointments)
          : setFlatApps(res.data.appointments);
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [currentDate, viewMode]);

  const handleReschedule = async () => {
    if (!selectedAppointment || !newDateTime) return;
    try {
      await axios.put("http://localhost/Backend/update_appointment.php", {
        appointment_id: selectedAppointment.appointment_id,
        new_datetime: newDateTime,
      });
      fetchScheduleData();
      setShowRescheduleModal(false);
    } catch (error) {
      console.error("Reschedule failed:", error);
    }
  };

  const prev = () => {
    if (viewMode === "day") setCurrentDate(subDays(currentDate, 1));
    if (viewMode === "week") setCurrentDate(subWeeks(currentDate, 1));
    if (viewMode === "month") setCurrentDate(subMonths(currentDate, 1));
  };

  const next = () => {
    if (viewMode === "day") setCurrentDate(addDays(currentDate, 1));
    if (viewMode === "week") setCurrentDate(addWeeks(currentDate, 1));
    if (viewMode === "month") setCurrentDate(addMonths(currentDate, 1));
  };

  // ---- Side‑drawer instead of full overlay ----
  const renderRescheduleModal = () =>
    showRescheduleModal && (
      <>
        {/* invisible overlay to catch clicks if you want, but pointer-events-none allows bg interactions */}
        <div className="fixed inset-0 pointer-events-none" />

        <div
          className="
            fixed top-0 right-0 h-full w-96
            bg-white p-6
            shadow-2xl
            transform transition-transform duration-300
            z-50
          "
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Reschedule</h3>
            <button
              onClick={() => setShowRescheduleModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                value={newDateTime.split("T")[0]}
                onChange={(e) =>
                  setNewDateTime(
                    e.target.value +
                      "T" +
                      (newDateTime.split("T")[1] || "00:00")
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label className="text-sm font-medium">Time</label>
              <input
                type="time"
                value={newDateTime.split("T")[1]?.substring(0, 5) || ""}
                onChange={(e) =>
                  setNewDateTime(
                    (newDateTime.split("T")[0] ||
                      format(new Date(), "yyyy-MM-dd")) +
                      "T" +
                      e.target.value
                  )
                }
                className="w-full p-2 border border-gray-300 rounded"
                step="900"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleReschedule}>Confirm</Button>
            </div>
          </form>
        </div>
      </>
    );

  const renderAppointment = (a: Appointment) => (
    <Card key={a.appointment_id} className="mb-1">
      <CardContent className="p-2 relative group">
        <p className="font-semibold">{a.service}</p>
        <p className="text-sm">{a.client}</p>
        <button
          className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAppointment(a);
            setNewDateTime(a.date_time);
            setShowRescheduleModal(true);
          }}
        >
          <ClockIcon className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );

  const renderDayView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          {stylists.map((stylist) => (
            <TableHead key={stylist}>{stylist}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {daySlots.map((slot) => (
          <TableRow key={slot.time}>
            <TableCell>{slot.time}</TableCell>
            {slot.appointments.map((apps, idx) => (
              <TableCell key={idx}>
                {apps.map((a: Appointment) => renderAppointment(a))}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderWeekView = () => (
    <div className="space-y-2">
      {flatApps.map((a) => (
        <Card key={a.appointment_id}>
          <CardContent className="p-2">
            <p className="text-sm">
              {format(new Date(a.date_time), "eee, MMM d 'at' p")}
            </p>
            <p className="font-semibold">{a.service}</p>
            <p className="text-sm text-gray-600">{a.client}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMonthView = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const apps = flatApps.filter((a) =>
            isSameDay(new Date(a.date_time), day)
          );
          return (
            <div key={day.toDateString()} className="border p-2 h-24">
              <div className="text-sm font-medium mb-1">
                {format(day, "d")}
              </div>
              {apps.map((a) => (
                <Badge key={a.appointment_id}>{a.service}</Badge>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div>

      <HeaderSection />
      </div>
      <main className="flex-1 bg-gray-50">
        {renderRescheduleModal()}

        <div className="px-6 mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Schedule</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={prev}>
                <ChevronLeftIcon className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium">
                {format(
                  currentDate,
                  viewMode === "day"
                    ? "PPP"
                    : viewMode === "week"
                    ? "'Week of' MMM d"
                    : "MMMM yyyy"
                )}
              </span>
              <Button variant="ghost" onClick={next}>
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={(val) =>
                val && setViewMode(val as "day" | "week" | "month")
              }
            >
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {viewMode === "day" && renderDayView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "month" && renderMonthView()}
        </div>
      </main>
    </div>
  );
};
