// src/screens/StaffSchedule/StaffSchedule.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { StaffHeader } from "../StaffHeader/StaffHeader";

interface Appointment {
  appointment_id: number;
  staff_id: number;
  staff_name: string;
  service: string;
  client: string;
  date_time: string;
}

interface Slot {
  time: string; 
  appointments: Appointment[][];
}

export const StaffSchedule = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const staff_id = searchParams.get("staff_id") || localStorage.getItem("staff_id") || "";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"day"|"week"|"month">("day");
  const [daySlots, setDaySlots] = useState<Slot[]>([]);
  const [flatApps, setFlatApps] = useState<Appointment[]>([]);
  const [selectedApp, setSelectedApp] = useState<Appointment|null>(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [showModal, setShowModal] = useState(false);

  // fetch one day's slots
  const fetchForDate = async (dateStr: string) => {
    const res = await axios.get("http://localhost/Backend/staff_schedule.php", {
      params: { staff_id, date: dateStr },
    });
    return res.data.status ? (res.data.appointments as Slot[]) : [];
  };

  const fetchSchedule = async () => {
    if (!staff_id) return;
    if (viewMode === "day") {
      const res = await axios.get("http://localhost/Backend/staff_schedule.php", {
        params: { staff_id, date: format(currentDate, "yyyy-MM-dd") },
      });
      if (res.data.status) {
        setDaySlots(res.data.appointments);
        setFlatApps([]);
      }
    } else {
      // build flat list
      let days: Date[] = [];
      if (viewMode === "week") {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        days = eachDayOfInterval({ start, end: addDays(start, 6) });
      } else {
        days = eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        });
      }
      const all: Appointment[] = [];
      for (let d of days) {
        const slots = await fetchForDate(format(d, "yyyy-MM-dd"));
        slots.forEach(s => s.appointments.forEach(col => all.push(...col)));
      }
      setFlatApps(all);
      setDaySlots([]);
    }
  };

  useEffect(() => {
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, viewMode, staff_id]);

  const openModal = (app: Appointment) => {
    setSelectedApp(app);
    setNewDateTime(app.date_time);
    setShowModal(true);
  };
  const handleReschedule = async () => {
    if (!selectedApp || !newDateTime) return;
    await axios.put("http://localhost/Backend/update_appointment.php", {
      appointment_id: selectedApp.appointment_id,
      new_datetime: newDateTime,
    });
    setShowModal(false);
    fetchSchedule();
  };

  const renderAppointment = (a: Appointment) => (
    <Card key={a.appointment_id} className="mb-1">
      <CardContent className="p-2 relative group">
        <p className="font-semibold">{a.service}</p>
        <p className="text-sm">{a.client}</p>
        <button
          className="absolute top-1 right-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={e => { e.stopPropagation(); openModal(a); }}
        >
          <ClockIcon className="h-4 w-4" />
        </button>
      </CardContent>
    </Card>
  );

  const renderDay = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Time</TableHead>
          <TableHead>My Slots</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {daySlots.map(slot => (
          <TableRow key={slot.time}>
            <TableCell>{slot.time}</TableCell>
            <TableCell>
              <div className="max-h-64 overflow-y-auto">
                {slot.appointments[0]?.map(renderAppointment)}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderWeek = () => (
    <div className="max-h-[60vh] overflow-y-auto space-y-2">
      {flatApps.map(a => (
        <Card key={a.appointment_id}>
          <CardContent className="p-2">
            <p className="text-sm">{format(new Date(a.date_time), "eee, MMM d 'at' p")}</p>
            <p className="font-semibold">{a.service}</p>
            <p className="text-sm text-gray-600">{a.client}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMonth = () => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });
    return (
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const apps = flatApps.filter(a => isSameDay(new Date(a.date_time), day));
          return (
            <div key={day.toString()} className="border p-2 h-24 flex flex-col">
              <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {apps.map(a => (
                  <Badge key={a.appointment_id}>{a.service}</Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-white">
      <StaffHeader />
      <main className="flex-1 bg-gray-50 ml-64">
        {/* Reschedule Modal */}
        {showModal && selectedApp && (
          <>
            <div className="fixed inset-0 bg-black/20" onClick={() => setShowModal(false)} />
            <div className="fixed top-1/4 right-0 w-96 bg-white p-6 shadow-2xl z-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Reschedule</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-500">✕</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm">Date</label>
                  <input
                    type="date"
                    value={newDateTime.split("T")[0]}
                    onChange={e => setNewDateTime(e.target.value + "T" + (newDateTime.split("T")[1] || "00:00"))}
                    className="w-full border p-2 rounded"
                    min={format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
                <div>
                  <label className="block text-sm">Time</label>
                  <input
                    type="time"
                    value={newDateTime.split("T")[1]?.slice(0,5) || ""}
                    onChange={e => setNewDateTime((newDateTime.split("T")[0] || format(new Date(), "yyyy-MM-dd")) + "T" + e.target.value)}
                    className="w-full border p-2 rounded"
                    step="900"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button onClick={handleReschedule}>Confirm</Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Header Controls */}
        <div className="px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Schedule</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => {
              const fn = viewMode === "day" ? subDays : viewMode === "week" ? subWeeks : subMonths;
              setCurrentDate(fn(currentDate, 1));
            }}>
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <input
              type="date"
              value={format(currentDate, "yyyy-MM-dd")}
              onChange={e => setCurrentDate(new Date(e.target.value))}
              className="border p-1 rounded"
              min={format(new Date(), "yyyy-MM-dd")}
            />
            <Button variant="ghost" onClick={() => {
              const fn = viewMode === "day" ? addDays : viewMode === "week" ? addWeeks : addMonths;
              setCurrentDate(fn(currentDate, 1));
            }}>
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <ToggleGroup type="single" value={viewMode} onValueChange={v => v && setViewMode(v as any)}>
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Views */}
        <div className="px-6 pb-8">
          {viewMode === "day" && renderDay()}
          {viewMode === "week" && renderWeek()}
          {viewMode === "month" && renderMonth()}
        </div>
      </main>
    </div>
  );
};
