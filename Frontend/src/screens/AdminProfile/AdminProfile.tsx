import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/AdminDashboard_ui/avatar";
import { Button } from "../../components/AdminDashboard_ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/AdminDashboard_ui/card";

export const AdminProfile = (): JSX.Element => {
  const queryParams = new URLSearchParams(window.location.search);
  const admin_id = queryParams.get("admin_id");
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: string;
    profile_pic: string;
  }>({
    name: "",
    email: "",
    phone: "",
    role: "Admin",
    profile_pic: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(adminData);
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);

  // fetch profile from backend
  const loadProfile = () => {
    if (!admin_id) return;
    axios
      .get(
        `http://localhost/Backend/admin_profile.php?admin_id=${encodeURIComponent(
          admin_id
        )}`,
        {
          transformResponse: [
            (data) => {
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
        }
      )
      .then((res) => {
        if (res.data?.status && res.data.data) {
          setAdminData(res.data.data);
          setFormData(res.data.data);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadProfile();
  }, [admin_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setNewProfilePic(file);
  };

  const handleSave = () => {
    if (!admin_id) return;
    const fd = new FormData();
    fd.append("admin_id", admin_id);
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    fd.append("phone", formData.phone);
    if (newProfilePic) fd.append("profile_pic", newProfilePic);

    axios
      .post("http://localhost/Backend/update_admin_profile.php", fd)
      .then((res) => {
        if (res.data?.status) {
          // after saving, reload profile so we get the new uploads/<file>.jpg path
          loadProfile();
          setNewProfilePic(null);
          setIsEditing(false);
        }
      })
      .catch(console.error);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("admin_id");
    localStorage.removeItem("salon_id");
    localStorage.removeItem("staff_id");
    localStorage.removeItem("customer_id");
    navigate("/");
  };

  // build full URL for the image; fallback to default
  const imageUrl = adminData.profile_pic
    ? `http://localhost/Backend/${adminData.profile_pic}`
    : "default-profile.png";

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen font-['Poppins']">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and edit your profile information
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() =>
              navigate(
                `/admindashboard?admin_id=${encodeURIComponent(admin_id || "")}`
              )
            }
          >
            Back to Dashboard
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl mx-auto rounded-2xl shadow-md border border-gray-200">
        <CardHeader className="flex flex-col items-center gap-3 py-6">
          <Avatar className="h-24 w-24 shadow-sm">
            <AvatarImage src={imageUrl} alt={adminData.name} />
            <AvatarFallback>{adminData.name?.[0] ?? "A"}</AvatarFallback>
          </Avatar>

          <CardTitle className="text-2xl font-bold text-gray-800">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 px-2 py-1 rounded-md w-full text-center"
              />
            ) : (
              adminData.name
            )}
          </CardTitle>
          <p className="text-sm text-gray-500">{adminData.role}</p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8 text-sm">
          <div>
            <label className="block text-gray-500 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-1 rounded-md w-full"
              />
            ) : (
              <p className="text-gray-800 font-medium">{adminData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-1 rounded-md w-full"
              />
            ) : (
              <p className="text-gray-800 font-medium">{adminData.phone}</p>
            )}
          </div>

          {isEditing && (
            <div>
              <label className="block text-gray-500 mb-1">
                Profile Photo
              </label>
              <input
                type="file"
                name="profile_pic"
                accept="image/*"
                onChange={handleFileChange}
                className="border border-gray-300 px-3 py-1 rounded-md w-full"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData(adminData);
                    setNewProfilePic(null);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
