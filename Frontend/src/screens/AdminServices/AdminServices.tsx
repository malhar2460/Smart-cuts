import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { HeaderSection } from "../AdminDashboard/sections/HeaderSection/HeaderSection";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "../../components/AdminStaff_ui/card";
import { Input } from "../../components/AdminStaff_ui/input";
import { Button } from "../../components/AdminStaff_ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/AdminSchedule_ui/table";
import {
  PlusIcon,
  Trash2Icon,
  Edit2Icon,
} from "lucide-react";

interface Service {
  service_id: number;
  service_name: string;
  category: string;
  price: string;
  duration: number;
  description: string;
  image?: string;
}

export const AdminServices = (): JSX.Element => {
  const salonId = localStorage.getItem("salon_id")!;
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [newSvc, setNewSvc] = useState({
    service_name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
  });
  const [addMsg, setAddMsg] = useState("");

  // Edit form
  const [showEdit, setShowEdit] = useState(false);
  const [editSvc, setEditSvc] = useState<Service | null>(null);
  const [editMsg, setEditMsg] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  // Fetch
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost/Backend/display_services.php",
        { params: { salon_id: salonId } }
      );
      if (res.data.success && Array.isArray(res.data.services)) {
        setServices(res.data.services);
      } else {
        setServices([]);
      }
    } catch (e) {
      console.error(e);
      setServices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Add handlers
  const onNewChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setNewSvc({ ...newSvc, [e.target.name]: e.target.value });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg("");
    const { service_name, category, price, duration, description } = newSvc;
    if (
      !service_name ||
      !category ||
      !price ||
      !duration ||
      !description
    ) {
      setAddMsg("All fields are required");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost/Backend/admin_add_services.php",
        {
          salon_id: +salonId,
          admin_id: +localStorage.getItem('admin_id'),
          service_name,
          category,
          price: parseFloat(price),
          duration: +duration,
          description,
        }
      );
      if (res.data.success) {
        setShowAdd(false);
        setNewSvc({
          service_name: "",
          category: "",
          price: "",
          duration: "",
          description: "",
        });
        fetchServices();
      } else {
        setAddMsg(res.data.message || "Add failed");
      }
    } catch {
      setAddMsg("Add failed");
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Remove this service?")) return;
    try {
      const res = await axios.post(
        "http://localhost/Backend/admin_delete_services.php",
        { service_id: id,admin_id:localStorage.getItem('admin_id') }
      );
      if (res.data.success) fetchServices();
      else alert(res.data.message || "Delete failed");
    } catch {
      alert("Delete failed");
    }
  };

  // Edit
  const openEdit = (svc: Service) => {
    setEditSvc(svc);
    setEditImage(null);
    setEditMsg("");
    setShowEdit(true);
  };
  const onEditChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editSvc) return;
    setEditSvc({ ...editSvc, [e.target.name]: e.target.value });
  };
  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setEditImage(e.target.files[0]);
  };
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSvc) return;
    setEditMsg("");
    const fd = new FormData();
    fd.append("service_id", `${editSvc.service_id}`);
    fd.append("service_name", editSvc.service_name);
    fd.append("category", editSvc.category);
    fd.append("price", editSvc.price);
    fd.append("duration", `${editSvc.duration}`);
    fd.append("description", editSvc.description);
    fd.append("admin_id", localStorage.getItem('admin_id')); 
    if (editImage) fd.append("image", editImage);

    try {
      const res = await axios.post(
        "http://localhost/Backend/admin_edit_services.php",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.status) {
        setShowEdit(false);
        fetchServices();
      } else {
        setEditMsg(res.data.message || "Update failed");
      }
    } catch {
      setEditMsg("Update failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
        <div>

      <HeaderSection />
        </div>
      <main className="flex-1 p-8 bg-gray-50 ml-64">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Services</h1>
          <Button onClick={() => setShowAdd((v) => !v)}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Service
          </Button>
        </div>

        {/* Add Drawer */}
        {showAdd && (
          <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">New Service</h2>
              <button onClick={() => setShowAdd(false)}>✕</button>
            </div>
            {addMsg && <p className="text-red-600 mb-2">{addMsg}</p>}
            <form onSubmit={handleAdd} className="space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
              <Input
                name="service_name"
                value={newSvc.service_name}
                onChange={onNewChange}
                placeholder="Name"
              />
              <Input
                name="category"
                value={newSvc.category}
                onChange={onNewChange}
                placeholder="Category"
              />
              <Input
                name="price"
                type="number"
                value={newSvc.price}
                onChange={onNewChange}
                placeholder="Price"
              />
              <Input
                name="duration"
                type="number"
                value={newSvc.duration}
                onChange={onNewChange}
                placeholder="Duration (min)"
              />
              <textarea
                name="description"
                value={newSvc.description}
                onChange={onNewChange}
                placeholder="Description"
                className="w-full p-2 border rounded h-24"
              />
              <div className="flex justify-end space-x-2">
                <Button type="submit">Save</Button>
                <Button variant="ghost" onClick={() => setShowAdd(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Edit Drawer */}
        {showEdit && editSvc && (
          <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-lg p-6 z-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Edit Service</h2>
              <button onClick={() => setShowEdit(false)}>✕</button>
            </div>
            {editMsg && <p className="text-red-600 mb-2">{editMsg}</p>}
            <form onSubmit={handleEdit} className="space-y-4 overflow-y-auto h-[calc(100%-4rem)]">
              <Input
                name="service_name"
                value={editSvc.service_name}
                onChange={onEditChange}
                placeholder="Name"
              />
              <Input
                name="category"
                value={editSvc.category}
                onChange={onEditChange}
                placeholder="Category"
              />
              <Input
                name="price"
                type="number"
                value={editSvc.price}
                onChange={onEditChange}
                placeholder="Price"
              />
              <Input
                name="duration"
                type="number"
                value={String(editSvc.duration)}
                onChange={onEditChange}
                placeholder="Duration (min)"
              />
              <textarea
                name="description"
                value={editSvc.description}
                onChange={onEditChange}
                placeholder="Description"
                className="w-full p-2 border rounded h-24"
              />
              <div>
                <label className="block mb-1">Image (optional)</label>
                <input type="file" accept="image/*" onChange={onImageChange} />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="submit">Update</Button>
                <Button variant="ghost" onClick={() => setShowEdit(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Services Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No services found.
                  </TableCell>
                </TableRow>
              ) : (
                services.map((svc) => (
                  <TableRow key={svc.service_id} className="hover:bg-gray-50">
                    <TableCell>{svc.service_name}</TableCell>
                    <TableCell>{svc.category}</TableCell>
                    <TableCell>₹{parseFloat(svc.price).toFixed(2)}</TableCell>
                    <TableCell>{svc.duration}m</TableCell>
                    <TableCell className="truncate max-w-xs">
                      {svc.description}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        onClick={() => openEdit(svc)}
                      >
                        <Edit2Icon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(svc.service_id)}
                      >
                        <Trash2Icon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};
