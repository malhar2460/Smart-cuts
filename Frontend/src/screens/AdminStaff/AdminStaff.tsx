import {
  BarChart3Icon,
  CalendarIcon,
  FileTextIcon,
  LayoutGridIcon,
  ListIcon,
  MailIcon,
  PhoneIcon,
  PlusIcon,
  ScissorsIcon,
  SearchIcon,
  BellIcon
} from "lucide-react";
import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/AdminStaff_ui/avatar";
import { Badge } from "../../components/AdminStaff_ui/badge";
import { Button } from "../../components/AdminStaff_ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/AdminStaff_ui/card";
import { Input } from "../../components/AdminStaff_ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/AdminStaff_ui/select";
import { ToggleGroup, ToggleGroupItem } from "../../components/AdminStaff_ui/toggle-group";
import { Link } from "react-router-dom";
export const AdminStaff = (): JSX.Element => {
  // Staff data for mapping
  const staffMembers = [
    {
      id: 1,
      name: "Sarah Wilson",
      role: "Senior Hair Stylist",
      status: "Available",
      statusColor: "bg-emerald-100 text-emerald-600",
      email: "sarah.w@smartcuts.com",
      phone: "(555) 123-4567",
      image: "/img-1.png",
      schedule: [
        { time: "9:00 AM", service: "Haircut & Style" },
        { time: "11:30 AM", service: "Color Treatment" },
      ],
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Colorist",
      status: "Busy",
      statusColor: "bg-red-100 text-red-600",
      email: "michael.c@smartcuts.com",
      phone: "(555) 234-5678",
      image: "/img-2.png",
      schedule: [
        { time: "10:00 AM", service: "Full Color" },
        { time: "2:00 PM", service: "Highlights" },
      ],
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Junior Stylist",
      status: "On Break",
      statusColor: "bg-amber-100 text-amber-600",
      email: "emma.r@smartcuts.com",
      phone: "(555) 345-6789",
      image: "/img-3.png",
      schedule: [
        { time: "1:00 PM", service: "Haircut" },
        { time: "3:30 PM", service: "Blow Dry" },
      ],
    },
  ];

  return (
    <div className="flex h-[627px] bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 h-full bg-white border-r border-solid">
        <div className="p-4">
          <h1 className="font-bold text-indigo-600 text-2xl leading-6">
            SmartCuts
          </h1>

          <div className="mt-16 space-y-2">
            <Link to="/admindashboard">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-10 text-gray-700"
            >
              <img src="/frame-34.svg" alt="" className="w-4 h-4 mr-3" style={{ color: "#374151" }} />
              Dashboard
            </Button>
            </Link>

            <Button
              variant="seconday"
              className="w-full justify-start px-4 py-2.5 h-10 bg-indigo-50 text-indigo-600"
            >
              <img src="/frame-3.svg" alt="" className="w-4 h-4 mr-3"></img>
              Staff
            </Button>

          <Link to="/adminschedule">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2.5 h-10 text-gray-700"
            >
              <img src="/frame-15.svg" alt="" className="w-4 h-4 mr-3"></img>
              Schedule
            </Button>
          </Link>

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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl leading-6">
              Staff Management
            </h1>
            <p className="text-gray-500 text-base mt-2">
              Manage your salon staff and their schedules
            </p>
          </div>

          <div className="flex items-center">
            <div className="relative mr-4">
              <div className="flex items-center justify-center">
              <BellIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="absolute left-2 -top-1 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </div>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/img-1.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* SearchIcon and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 w-64"
                  placeholder="SearchIcon staff..."
                />
              </div>

              <Select defaultValue="all-roles">
                <SelectTrigger className="w-[137px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-roles">All Roles</SelectItem>
                  <SelectItem value="stylist">Stylist</SelectItem>
                  <SelectItem value="colorist">Colorist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-4">
              <ToggleGroup type="single" defaultValue="grid">
                <ToggleGroupItem value="grid" className="flex items-center">
                  <LayoutGridIcon className="h-4 w-4 mr-2" />
                  Grid
                </ToggleGroupItem>
                <ToggleGroupItem value="list" className="flex items-center">
                  <ListIcon className="h-4 w-4 mr-2" />
                  ListIcon
                </ToggleGroupItem>
              </ToggleGroup>

              <Button className="bg-indigo-600">
                <PlusIcon className="h-4 w-3.5 mr-2" />
                Add New Staff
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Staff Cards */}
        <div className="grid grid-cols-3 gap-6">
          {staffMembers.map((staff) => (
            <Card key={staff.id} className="rounded-xl shadow-sm">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={staff.image} alt={staff.name} />
                    <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Badge className={staff.statusColor}>{staff.status}</Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-2">
                <h3 className="text-lg text-gray-900 font-normal">
                  {staff.name}
                </h3>
                <p className="text-gray-600 text-base">{staff.role}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-1" />
                    <span className="text-gray-600 text-base">
                      {staff.email}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1" />
                    <span className="text-gray-600 text-base">
                      {staff.phone}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-start border-t pt-4">
                <h4 className="text-sm text-gray-600 font-medium mb-4">
                  Today's Schedule
                </h4>
                <div className="w-full space-y-2">
                  {staff.schedule.map((appointment, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-sm text-black">
                        {appointment.time}
                      </span>
                      <span className="text-sm text-indigo-600">
                        {appointment.service}
                      </span>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
