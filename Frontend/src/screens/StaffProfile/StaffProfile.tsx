// src/screens/StaffProfile/StaffProfile.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { StaffHeader } from "../StaffHeader/StaffHeader";
import { useNavigate } from "react-router-dom";

interface StaffData {
  username: string;
  email: string;
  phone_number: string;
  specialization: string;
  availability: string;
  photo: string;   // backend key
}

export const StaffProfile = (): JSX.Element | null => {
  const [searchParams] = useSearchParams();
  const staff_id =
    searchParams.get("staff_id") ||
    localStorage.getItem("staff_id") ||
    "";

  const [data, setData] = useState<StaffData | null>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<Partial<StaffData & { photo: File | string }>>({});
  const [preview, setPreview] = useState<string>("");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear(); // remove all saved user data
    navigate("/"); // or navigate("/login") if you have a login page
  };
  // fetch profile
  useEffect(() => {
    if (!staff_id) return;
    axios
      .get("http://localhost/Backend/staff_profile.php", {
        params: { staff_id },
        transformResponse: [(raw: string) => {
          const i = raw.indexOf("{");
          return i >= 0 ? JSON.parse(raw.slice(i)) : {};
        }],
      })
      .then(res => {
        if (res.data.status && res.data.data) {
          const d: StaffData = res.data.data;
          setData(d);
          setForm(d);
          // build preview URL
          setPreview(`http://localhost/Backend/uploads/staff/${d.photo}`);
        }
      })
      .catch(console.error);
  }, [staff_id]);

  // input handlers
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setForm(p => ({ ...p, photo: f }));
      setPreview(URL.createObjectURL(f));
    }
  };

  // save profile
  const save = () => {
    if (!staff_id) return;
    const fd = new FormData();
    fd.append("staff_id", staff_id);
    // append all changed fields
    Object.entries(form).forEach(([k, v]) => {
      if (v != null) fd.append(k, v as any);
    });
    axios
      .post("http://localhost/Backend/staff_update_profile.php", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(res => {
        if (res.data.status) {
          // if backend returned a new filename under `photo`
          if (res.data.photo) {
            const newName = res.data.photo as string;
            setPreview(`http://localhost/Backend/uploads/${newName}`);
            form.photo = newName;
          }
          setData(d =>
            d
              ? ({
                  ...d,
                  ...form as any,
                  photo: typeof form.photo === "string" ? form.photo : d.photo,
                } as StaffData)
              : d
          );
          setEdit(false);
        } else {
          console.error("Update failed:", res.data.message);
        }
      })
      .catch(console.error);
  };

  if (!data) return null;

  return (
    <div className="flex min-h-screen">
      <StaffHeader />

      <main className="flex-1 bg-gray-50 pl-64 overflow-auto py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-semibold mb-6">My Profile</h2>

          {/* VIEW MODE */}
          {!edit && (
            <div className="grid grid-cols-12 gap-6 items-center">
              <div className="col-span-4 flex justify-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-indigo-100">
                  <img
                    src={preview || "/default-profile.png"}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="col-span-8 space-y-3">
                <div>
                  <h3 className="text-2xl font-bold">{data.username}</h3>
                  <p className="text-gray-500">{data.specialization}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{data.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p>{data.phone_number}</p>
                  </div>
                  <div>
                    <span className="font-medium">Availability:</span>
                    <p>{data.availability}</p>
                  </div>
                </div>
                <button
                  onClick={() => setEdit(true)}
                  className="mt-6 inline-block px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={logout}
                  className="mt-10 ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* EDIT MODE */}
          {edit && (
            <form className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <label className="block text-gray-700 mb-2">Photo</label>
                <div className="w-48 h-48 rounded-full overflow-hidden border mb-2">
                  <img src={preview || "/default-profile.png"} alt="" className="object-cover w-full h-full"/>
                </div>
                <input type="file" accept="image/*" onChange={handleFile} className="w-full"/>
              </div>
              <div className="col-span-8 space-y-4">
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    name="username"
                    value={form.username || ""}
                    onChange={handleText}
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email || ""}
                      onChange={handleText}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Phone</label>
                    <input
                      name="phone_number"
                      value={form.phone_number || ""}
                      onChange={handleText}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700">Specialization</label>
                    <input
                      name="specialization"
                      value={form.specialization || ""}
                      onChange={handleText}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Availability</label>
                    <input
                      name="availability"
                      value={form.availability || ""}
                      onChange={handleText}
                      className="mt-1 w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={save}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEdit(false)}
                    className="px-6 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};
