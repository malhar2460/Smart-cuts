import { BellIcon, ScissorsIcon, StarIcon } from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Select, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export const Frame = (): JSX.Element => {
  // Profile data
  const profileData = {
    staffId: "ST-2025-001",
    specialization: "Hair Styling",
    status: "Available",
  };

  // Appointment data
  const appointments = [
    {
      id: 1,
      name: "John Smith",
      service: "Haircut & Styling",
      time: "Today, 2:30 PM",
      image: "..//img.png",
      status: "upcoming",
      isToday: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      service: "Color & Highlights",
      time: "Tomorrow, 10:00 AM",
      image: "..//img-1.png",
      status: "upcoming",
      isToday: false,
    },
    {
      id: 3,
      name: "Mike Brown",
      service: "Beard Trim",
      time: "Yesterday, 3:00 PM",
      image: "..//img-2.png",
      status: "past",
      rating: 5,
      review: '"Great service!"',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      {/* Header */}
      <header className="w-full h-16 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ScissorsIcon className="h-6 w-6" />
            <span className="font-semibold text-lg">SmartCuts Staff</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <BellIcon className="h-4 w-3.5" />
              <span className="absolute w-2 h-2 top-0 right-0 bg-red-500 rounded-full"></span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="..//img-3.png" alt="User avatar" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 py-24 px-20">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Profile Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">My Profile</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Status:</span>
                  <div className="flex items-center gap-2">
                    <Switch id="status" defaultChecked />
                    <span className="text-sm font-medium text-emerald-600">
                      {profileData.status}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-6">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Staff ID
                  </label>
                  <div className="h-6 px-2 bg-gray-100 rounded-md flex items-center">
                    <span className="text-base">{profileData.staffId}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Specialization
                  </label>
                  <Select>
                    <SelectTrigger className="h-[25px]">
                      <SelectValue defaultValue={profileData.specialization} />
                    </SelectTrigger>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <Input className="h-6" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <Input className="h-6" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <Input className="h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-0 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">My Appointments</CardTitle>
                <div className="flex items-center gap-2">
                  <Input
                    className="h-[22px] w-[272px]"
                    placeholder="Search customers..."
                  />
                  <Input
                    className="h-[22px] w-[138px]"
                    defaultValue="mm/dd/yyyy"
                  />
                </div>
              </div>

              <Tabs defaultValue="upcoming" className="mt-4">
                <TabsList className="border-b-0">
                  <TabsTrigger
                    value="upcoming"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-4"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger
                    value="today"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-4"
                  >
                    Today
                  </TabsTrigger>
                  <TabsTrigger
                    value="past"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none px-4"
                  >
                    Past
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="p-0">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className={`border-t ${index === 0 ? "bg-blue-50" : ""} py-6 px-6`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={appointment.image}
                          alt={appointment.name}
                        />
                        <AvatarFallback>
                          {appointment.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {appointment.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.service}
                        </p>
                        {appointment.rating && (
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(appointment.rating)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className="h-4 w-4 fill-current text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {appointment.review}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`text-sm ${appointment.isToday ? "font-medium text-blue-600" : "text-gray-500"}`}
                      >
                        {appointment.time}
                      </p>
                      {appointment.isToday && (
                        <Button
                          size="sm"
                          className="mt-2 h-7 bg-blue-600 hover:bg-blue-700"
                        >
                          Check In
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
