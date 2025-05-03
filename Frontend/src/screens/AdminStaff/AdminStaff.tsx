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
import axios from "axios";
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
import { HeaderSection } from "../AdminDashboard/sections/HeaderSection/HeaderSection";

export const AdminStaff = (): JSX.Element => {
  const salonId = localStorage.getItem("salon_id");
  const adminId = localStorage.getItem("admin_id");
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staff_name: "",
    password: "",
    specialization: "",
    phone_number: "",
    email: "",
    availability: "",
  });
  const [addFormMessage, setAddFormMessage] = useState("");
  const [addImageFile, setAddImageFile] = useState<File | null>(null);

  const [editFormVisible, setEditFormVisible] = useState(false);
  const [editStaff, setEditStaff] = useState<any>(null);
  const [editFormMessage, setEditFormMessage] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const BACKEND_URL = "http://localhost/Backend";
  const BACKEND_IMG_URL = "http://localhost/Backend/uploads/staff";

  const fetchStaff = () => {
    if (!salonId) return;
    axios
      .get(`${BACKEND_URL}/admin_display_staff.php?salon_id=${salonId}`, {
        transformResponse: [
          (data: string) => {
            const jsonStart = data.indexOf("{");
            if (jsonStart !== -1) {
              try {
                return JSON.parse(data.slice(jsonStart));
              } catch {
                return {};
              }
            }
            return {};
          },
        ],
      })
      .then((res) => {
        if (res.data?.status && Array.isArray(res.data.data)) {
          const mappedData = res.data.data.map((item: any) => ({
            ...item,
            staff_name: item.username,
            image: item.photo?.replace(/^..\/\/|^\.\.\//, "") || null, // clean photo path
          }));
          setStaffMembers(mappedData);
        }
        
      })
      .catch((err) => console.error("Error fetching staff:", err));
  };

  useEffect(() => {
    fetchStaff();
  }, [salonId]);

  const handleDelete = (staff_id: number) => {
    if (!salonId) return;
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    axios
      .post(`${BACKEND_URL}/admin_delete_staff.php`, { staff_id })
      .then((res) => {
        if (res.data?.status) fetchStaff();
        else alert(res.data.message || "Error deleting staff member");
      })
      .catch((err) => {
        console.error("Error deleting staff:", err);
        alert("Error deleting staff member");
      });
  };

  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      setAddImageFile(e.target.files?.[0] || null);
      return;
    }
    const { name, value } = e.target;
    setNewStaff({ ...newStaff, [name]: value });
  };

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!salonId || !adminId) return;

    const missingText = Object.values(newStaff).some((v) => !v);
    if (missingText || !addImageFile) {
      setAddFormMessage("All fields (including the image) are required");
      return;
    }

    const fd = new FormData();
    fd.append("admin_id", adminId);
    fd.append("salon_id", salonId);
    fd.append("staff_name", newStaff.staff_name);
    fd.append("password", newStaff.password);
    fd.append("specialization", newStaff.specialization);
    fd.append("phone_number", newStaff.phone_number);
    fd.append("email", newStaff.email);
    fd.append("availability", newStaff.availability);
    fd.append("image", addImageFile);

    axios
      .post(`${BACKEND_URL}/admin_add_staff.php`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.data?.status) {
          setAddFormMessage("Staff member added successfully");
          setNewStaff({
            staff_name: "",
            password: "",
            specialization: "",
            phone_number: "",
            email: "",
            availability: "",
          });
          setAddImageFile(null);
          setShowAddForm(false);
          fetchStaff();
        } else {
          setAddFormMessage(res.data.message || "Error adding staff member");
        }
      })
      .catch(() => setAddFormMessage("Error adding staff member"));
  };

  const handleEditClick = (staff: any) => {
    setEditStaff({ ...staff, password: "" });
    setEditFormVisible(true);
    setEditFormMessage("");
    setEditImage(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditStaff((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setEditImage(e.target.files[0]);
  };

  const handleEditStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editStaff?.staff_id) {
      setEditFormMessage("All fields are required");
      return;
    }
    const fd = new FormData();
    fd.append("staff_id", editStaff.staff_id);
    fd.append("staff_name", editStaff.staff_name);
    if (editStaff.password) fd.append("password", editStaff.password);
    fd.append("specialization", editStaff.specialization);
    fd.append("phone_number", editStaff.phone_number);
    fd.append("email", editStaff.email);
    fd.append("availability", editStaff.availability);
    if (editImage) fd.append("image", editImage);

    axios
      .post(`${BACKEND_URL}/admin_edit_staff.php`, fd, { headers: { "Content-Type": "multipart/form-data" } })
      .then((res) => {
        if (res.data?.status) {
          setEditFormVisible(false);
          fetchStaff();
        } else {
          setEditFormMessage(res.data.message || "Error updating staff member");
        }
      })
      .catch(() => setEditFormMessage("Error updating staff member"));
  };

  return (
    <div className="flex min-h-screen bg-white border-2 border-solid border-[#ced4da] overflow-hidden">
      <div >
        <HeaderSection />
      </div>

      <div className="flex-1 p-8 bg-gray-50 ml-64">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">Staff Management</h1>
            <p className="text-gray-500 mt-2">Manage your salon staff and their schedules</p>
          </div>
        </div>

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
                    <LayoutGridIcon className="h-4 w-4 mr-2" /> Grid
                  </ToggleGroupItem>
                  <ToggleGroupItem value="list" className="flex items-center">
                    <ListIcon className="h-4 w-4 mr-2" /> List
                  </ToggleGroupItem>
                </ToggleGroup>
                <Button className="bg-indigo-600" onClick={() => setShowAddForm(!showAddForm)}>
                  <PlusIcon className="h-4 w-3.5 mr-2" /> Add New Staff
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Add New Staff</h2>
            {addFormMessage && <p className="mb-2 text-sm text-red-600">{addFormMessage}</p>}
            <form onSubmit={handleAddStaff} className="space-y-4">
              <Input name="staff_name" value={newStaff.staff_name} onChange={handleAddInputChange} placeholder="Staff Name" />
              <Input name="specialization" value={newStaff.specialization} onChange={handleAddInputChange} placeholder="Specialization" />
              <Input name="phone_number" value={newStaff.phone_number} onChange={handleAddInputChange} placeholder="Phone Number" />
              <Input name="email" value={newStaff.email} onChange={handleAddInputChange} placeholder="Email" />
              {/* <Input name="availability" value={newStaff.availability} onChange={handleAddInputChange} placeholder="Availability" /> */}
              <Select
                value={newStaff.availability}
                onValueChange={(val) => setNewStaff({ ...newStaff, availability: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>

              <Input
                name="password"
                type="password"
                value={newStaff.password}
                onChange={handleAddInputChange}
                placeholder="Password"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleAddInputChange}
                required
                className="block w-full border rounded p-2"
              />
              <div className="flex space-x-4">
                <Button type="submit" className="bg-green-600">Add Staff</Button>
                <Button type="button" variant="ghost" onClick={() => { setShowAddForm(false); setAddFormMessage(""); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {editFormVisible && editStaff && (
          <div className="mb-6 p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Edit Staff</h2>
            {editFormMessage && <p className="mb-2 text-sm text-red-600">{editFormMessage}</p>}
            <form onSubmit={handleEditStaff} className="space-y-4">
              <Input name="staff_name" value={editStaff.staff_name} onChange={handleEditInputChange} placeholder="Staff Name" />
              <Input name="specialization" value={editStaff.specialization} onChange={handleEditInputChange} placeholder="Specialization" />
              <Input name="phone_number" value={editStaff.phone_number} onChange={handleEditInputChange} placeholder="Phone Number" />
              <Input name="email" value={editStaff.email} onChange={handleEditInputChange} placeholder="Email" />
              {/* <Input name="availability" value={editStaff.availability} onChange={handleEditInputChange} placeholder="Availability" /> */}
              
              <Select
                value={editStaff.availability}
                onValueChange={(val) => setEditStaff({ ...editStaff, availability: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>

              <Input
                name="password"
                type="password"
                value={editStaff.password}
                onChange={handleEditInputChange}
                placeholder="New Password (leave blank to keep)"
              />
              <div>
                <label className="block mb-1 text-sm text-gray-700">Staff Image (optional)</label>
                <input type="file" accept="image/*" onChange={handleEditImageChange} className="border p-1 rounded w-full" />
              </div>
              <div className="flex space-x-4">
                <Button type="submit" className="bg-green-600">Update Staff</Button>
                <Button variant="ghost" onClick={() => setEditFormVisible(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {staffMembers.length > 0 ? (
            staffMembers.map((staff) => {
              const imgSrc = staff.image
                ? `${BACKEND_IMG_URL}/${staff.image}`
                : "/default-avatar.png";
              return (
                <Card key={staff.staff_id} className="rounded-xl shadow-sm">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={imgSrc} alt={staff.staff_name} />
                        <AvatarFallback>{staff.staff_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <Badge
                          className={
                            staff.availability === "available"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }
                        >
                          {staff.availability}
                      </Badge>
                      {/* <Badge className="bg-green-100 text-green-600">{staff.availability}</Badge> */}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <h3 className="text-lg text-gray-900">{staff.staff_name}</h3>
                    <p className="text-gray-600">{staff.specialization}</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <MailIcon className="h-4 w-4 mr-1" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span>{staff.phone_number}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start pt-4">
                    <h4 className="text-sm text-gray-600 mb-4">Today's Schedule</h4>
                    <p className="text-sm text-gray-600">No schedule available</p>
                    <div className="flex space-x-2 mt-4">
                      <Button onClick={() => handleEditClick(staff)} className="bg-blue-500 hover:bg-blue-600 text-white">
                        Edit
                      </Button>
                      <Button onClick={() => handleDelete(staff.staff_id)} className="bg-red-500 hover:bg-red-600 text-white">
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <p>No staff found for this salon.</p>
          )}
        </div>
      </div>
    </div>
  );
};
