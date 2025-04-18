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
  BellIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../components/AdminStaff_ui/toggle-group";
import axios from "axios";
import { HeaderSection } from "../AdminDashboard/sections/HeaderSection/HeaderSection";

export const AdminStaff = (): JSX.Element => {
  // ─── Pull salon_id (and admin_id if you need it) from localStorage ─────
  const salonId = localStorage.getItem("salon_id");
  // (Optional) const adminId = localStorage.getItem("admin_id");

  // State for staff members list.
  const [staffMembers, setStaffMembers] = useState<any[]>([]);

  // State for Add Staff form.
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staff_name: "",
    specialization: "",
    phone_number: "",
    email: "",
    availability: "",
  });
  const [addFormMessage, setAddFormMessage] = useState("");

  // State for Edit Staff form.
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);
  const [editFormMessage, setEditFormMessage] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  // Function to fetch staff data.
  const fetchStaff = () => {
    if (!salonId) {
      console.error("Missing salon_id in localStorage");
      return;
    }

    axios
      .get(
        `http://localhost/Backend/admin_display_staff.php?salon_id=${salonId}`,
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
        if (res.data?.status && Array.isArray(res.data.data)) {
          setStaffMembers(res.data.data);
        } else {
          setStaffMembers([]);
          console.error("API error or unexpected format (staff):", res.data?.message);
        }
      })
      .catch((err) => console.error("Error fetching staff:", err));
  };

  // Fetch staff on component mount or when salonId changes.
  useEffect(() => {
    fetchStaff();
  }, [salonId]);

  // Handler to delete a staff member.
  const handleDelete = (staff_id: number) => {
    if (!salonId) return;
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      axios
        .post("http://localhost/Backend/admin_delete_staff.php", {
          staff_id,
        })
        .then((res) => {
          if (res.data?.status) {
            fetchStaff(); // Refresh staff list.
          } else {
            alert(res.data.message || "Error deleting staff member");
          }
        })
        .catch((err) => {
          console.error("Error deleting staff:", err);
          alert("Error deleting staff member");
        });
    }
  };

  // Handlers for Add Staff form.
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewStaff({
      ...newStaff,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!salonId) return;

    // Validate all fields for Add Staff.
    if (
      !newStaff.staff_name ||
      !newStaff.specialization ||
      !newStaff.phone_number ||
      !newStaff.email ||
      !newStaff.availability
    ) {
      setAddFormMessage("All fields are required");
      return;
    }

    axios
      .post("http://localhost/Backend/admin_add_staff.php", {
        ...newStaff,
        salon_id: parseInt(salonId, 10),
      })
      .then((res) => {
        if (res.data?.status) {
          setAddFormMessage("Staff member added successfully");
          setNewStaff({
            staff_name: "",
            specialization: "",
            phone_number: "",
            email: "",
            availability: "",
          });
          setShowAddForm(false);
          fetchStaff();
        } else {
          setAddFormMessage(res.data.message || "Error adding staff member");
        }
      })
      .catch((err) => {
        console.error("Error adding staff:", err);
        setAddFormMessage("Error adding staff member");
      });
  };

  // Handler for clicking "Edit" on a staff card.
  const handleEditClick = (staff: any) => {
    setEditStaff(staff);
    setEditFormVisible(true);
    setEditFormMessage("");
    setEditImage(null);
  };

  // Handlers for Edit Staff form.
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditStaff({
      ...editStaff,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditImage(e.target.files[0]);
    }
  };

  const handleEditStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editStaff?.staff_id) {
      setEditFormMessage("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("staff_id", editStaff.staff_id);
    formData.append("staff_name", editStaff.staff_name);
    formData.append("specialization", editStaff.specialization);
    formData.append("phone_number", editStaff.phone_number);
    formData.append("email", editStaff.email);
    formData.append("availability", editStaff.availability);
    if (editImage) {
      formData.append("image", editImage);
    }

    axios
      .post("http://localhost/Backend/admin_edit_staff.php", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data?.status) {
          setEditFormMessage("Staff updated successfully");
          setEditFormVisible(false);
          setEditStaff(null);
          fetchStaff();
        } else {
          setEditFormMessage(res.data.message || "Error updating staff member");
        }
      })
      .catch((err) => {
        console.error("Error updating staff:", err);
        setEditFormMessage("Error updating staff member");
      });
  };
console.log(salonId)
  return (
    <div className="flex min-h-screen bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      {/* Sidebar */}
      <div>

      <HeaderSection />
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
          {/* <div className="flex items-center">
            <div className="relative mr-4">
              <BellIcon className="h-5 w-5 text-gray-600" />
              <div className="absolute left-2 -top-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">3</span>
              </div>
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src="/img-1.png" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div> */}
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4 flex justify-between items-center">
              <div className="flex space-x-4">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input className="pl-10 w-64" placeholder="Search staff..." />
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
                    List
                  </ToggleGroupItem>
                </ToggleGroup>
                <Button
                  className="bg-indigo-600"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <PlusIcon className="h-4 w-3.5 mr-2" />
                  Add New Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Staff Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Staff</h2>
            {addFormMessage && (
              <p className="mb-2 text-sm text-red-600">{addFormMessage}</p>
            )}
            <form onSubmit={handleAddStaff} className="space-y-4">
              <Input
                name="staff_name"
                value={newStaff.staff_name}
                onChange={handleAddInputChange}
                placeholder="Staff Name"
                className="w-full"
              />
              <Input
                name="specialization"
                value={newStaff.specialization}
                onChange={handleAddInputChange}
                placeholder="Specialization"
                className="w-full"
              />
              <Input
                name="phone_number"
                value={newStaff.phone_number}
                onChange={handleAddInputChange}
                placeholder="Phone Number"
                className="w-full"
              />
              <Input
                name="email"
                value={newStaff.email}
                onChange={handleAddInputChange}
                placeholder="Email"
                className="w-full"
              />
              <Input
                name="availability"
                value={newStaff.availability}
                onChange={handleAddInputChange}
                placeholder="Availability"
                className="w-full"
              />
              <div className="flex space-x-4">
                <Button type="submit" className="bg-green-600">
                  Add Staff
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowAddForm(false);
                    setAddFormMessage("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Staff Form */}
        {editFormVisible && editStaff && (
          <div className="mb-6 p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit Staff</h2>
            {editFormMessage && (
              <p className="mb-2 text-sm text-red-600">{editFormMessage}</p>
            )}
            <form onSubmit={handleEditStaff} className="space-y-4">
              <Input
                name="staff_name"
                value={editStaff.staff_name}
                onChange={handleEditInputChange}
                placeholder="Staff Name"
                className="w-full"
              />
              <Input
                name="specialization"
                value={editStaff.specialization}
                onChange={handleEditInputChange}
                placeholder="Specialization"
                className="w-full"
              />
              <Input
                name="phone_number"
                value={editStaff.phone_number}
                onChange={handleEditInputChange}
                placeholder="Phone Number"
                className="w-full"
              />
              <Input
                name="email"
                value={editStaff.email}
                onChange={handleEditInputChange}
                placeholder="Email"
                className="w-full"
              />
              <Input
                name="availability"
                value={editStaff.availability}
                onChange={handleEditInputChange}
                placeholder="Availability"
                className="w-full"
              />
              <div>
                <label className="block mb-1 text-sm text-gray-700">
                  Staff Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="border p-1 rounded w-full"
                />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-green-600">
                  Update Staff
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditFormVisible(false);
                    setEditStaff(null);
                    setEditFormMessage("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Staff Cards */}
        <div className="grid grid-cols-3 gap-6">
          {staffMembers.length > 0 ? (
            staffMembers.map((staff: any) => (
              <Card key={staff.staff_id} className="rounded-xl shadow-sm">
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={
                          staff.image
                            ? `/uploads/staff/${staff.image}`
                            : "/default-avatar.png"
                        }
                        alt={staff.staff_name}
                      />
                      <AvatarFallback>
                        {staff.staff_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className="bg-green-100 text-green-600">
                      {staff.availability}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  <h3 className="text-lg text-gray-900 font-normal">
                    {staff.staff_name}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {staff.specialization}
                  </p>
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
                        {staff.phone_number}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start pt-4">
                  <h4 className="text-sm text-gray-600 font-medium mb-4">
                    Today's Schedule
                  </h4>
                  <p className="text-sm text-gray-600">No schedule available</p>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => handleEditClick(staff)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(staff.staff_id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No staff found for this salon.</p>
          )}
        </div>
      </div>
    </div>
  );
};
