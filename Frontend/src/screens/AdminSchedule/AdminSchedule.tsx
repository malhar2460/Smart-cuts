import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  format,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
} from "date-fns";

import { ChevronLeftIcon, ChevronRightIcon, ClockIcon } from "lucide-react";
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
}

export const AdminSchedule = (): JSX.Element => {
  const navigate = useNavigate();
  const salonId = localStorage.getItem("salon_id") || "";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  const [stylists, setStylists] = useState<string[]>([]);
  const [daySlots, setDaySlots] = useState<{ time: string; appointments: Appointment[][] }[]>([]);
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

  // fetch one day's slots
  const fetchForDate = async (dateStr: string) => {
    const res = await axios.get("http://localhost/Backend/admin_schedule_appointment.php", {
      params: { salon_id: salonId, date: dateStr },
    });
    return res.data.status ? res.data.appointments : [];
  };

  const fetchScheduleData = async (): Promise<void> => {
    if (!salonId) return;

    const baseRes = await axios.get("http://localhost/Backend/admin_schedule_appointment.php", {
      params: { salon_id: salonId, date: format(currentDate, "yyyy-MM-dd") },
    });
    if (!baseRes.data.status) return;

    setStylists(baseRes.data.stylists);
    setStatsData(baseRes.data.stats);

    if (viewMode === "day") {
      setDaySlots(baseRes.data.appointments);
      setFlatApps([]);
    } else {
      const apps: Appointment[] = [];
      let daysToFetch: Date[] = [];

      if (viewMode === "week") {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        daysToFetch = eachDayOfInterval({ start, end: addDays(start, 6) });
      } else {
        daysToFetch = eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        });
      }

      for (let d of daysToFetch) {
        const slots = await fetchForDate(format(d, "yyyy-MM-dd"));
        slots.forEach((slot: any) =>
          slot.appointments.forEach((cell: Appointment[]) => apps.push(...cell))
        );
      }

      setFlatApps(apps);
      setDaySlots([]);
    }
  };

  useEffect(() => {
    fetchScheduleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, viewMode]);

  const handleReschedule = async () => {
    if (!selectedAppointment || !newDateTime) return;
    await axios.put("http://localhost/Backend/update_appointment.php", {
      appointment_id: selectedAppointment.appointment_id,
      new_datetime: newDateTime,
    });
    setShowRescheduleModal(false);
    fetchScheduleData();
  };

  const renderRescheduleModal = () =>
    showRescheduleModal && selectedAppointment && (
      <>
        <div className="fixed inset-0 pointer-events-none" />
        <div className="fixed top-0 right-0 h-full w-96 bg-white p-6 shadow-2xl z-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Reschedule</h3>
            <button onClick={() => setShowRescheduleModal(false)} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                value={newDateTime.split("T")[0]}
                onChange={(e) =>
                  setNewDateTime(e.target.value + "T" + (newDateTime.split("T")[1] || "00:00"))
                }
                className="w-full p-2 border rounded"
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Time</label>
              <input
                type="time"
                value={newDateTime.split("T")[1]?.substring(0, 5) || ""}
                onChange={(e) =>
                  setNewDateTime(
                    (newDateTime.split("T")[0] || format(new Date(), "yyyy-MM-dd")) +
                      "T" +
                      e.target.value
                  )
                }
                className="w-full p-2 border rounded"
                step="900"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRescheduleModal(false)}>
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
            <TableCell className="align-top">{slot.time}</TableCell>
            {slot.appointments.map((cell, idx) => (
              <TableCell key={idx}>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {cell.map(renderAppointment)}
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderWeekView = () => (
    <div className="space-y-2 max-h-screen overflow-y-auto">
      {flatApps.map((a) => (
        <Card key={a.appointment_id} className="max-w-full">
          <CardContent className="p-2">
            <p className="text-sm">{format(new Date(a.date_time), "eee, MMM d 'at' p")}</p>
            <p className="font-semibold">{a.service}</p>
            <p className="text-sm text-gray-600">{a.client}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMonthView = () => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const apps = flatApps.filter((a) => isSameDay(new Date(a.date_time), day));
          return (
            <div key={day.toDateString()} className="border p-1 h-24 flex flex-col">
              <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {apps.slice(0, 3).map((a) => <Badge key={a.appointment_id}>{a.service}</Badge>)}
                {apps.length > 3 && (
                  <Badge className="text-xs">+{apps.length - 3} more</Badge>
                )}
              </div>
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
      <main className="flex-1 bg-gray-50 ml-64 p-6">
        {renderRescheduleModal()}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Schedule</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => setCurrentDate(
              viewMode === "day"
                ? subDays(currentDate, 1)
                : viewMode === "week"
                ? subWeeks(currentDate, 1)
                : subMonths(currentDate, 1)
            )}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <input
              type="date"
              value={format(currentDate, "yyyy-MM-dd")}
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
              className="border p-1 rounded"
              min={format(new Date(), "yyyy-MM-dd")}
            />
            <Button variant="ghost" onClick={() => setCurrentDate(
              viewMode === "day"
                ? addDays(currentDate, 1)
                : viewMode === "week"
                ? addWeeks(currentDate, 1)
                : addMonths(currentDate, 1)
            )}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
          <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
            <ToggleGroupItem value="day">Day</ToggleGroupItem>
            <ToggleGroupItem value="week">Week</ToggleGroupItem>
            <ToggleGroupItem value="month">Month</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {viewMode === "day" && renderDayView()}
        {viewMode === "week" && renderWeekView()}
        {viewMode === "month" && renderMonthView()}
      </main>
    </div>
  );
};
