// src/screens/StaffDashboard/StaffDashboard.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { StaffHeader } from "../StaffHeader/StaffHeader";

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
}
interface Appointment {
  appointment_id: number;
  client: string;
  service: string;
  time: string;    // e.g. "14:30"
  status: string;  // "booked" | "completed" etc.
}
interface Review {
  customer_name: string;
  rating: number;
  comment: string;
}

export const StaffDashboard = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const staff_id = searchParams.get("staff_id") || localStorage.getItem("staff_id") || "";

  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, confirmed: 0 });
  const [todayApps, setTodayApps] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!staff_id) {
      setError("Missing staff_id");
      return;
    }

    // Load stats
    axios
      .get(`http://localhost/Backend/staff_stats.php?staff_id=${staff_id}`, {
        transformResponse: [(d: string) => JSON.parse(d.slice(d.indexOf("{")))],
      })
      .then((res) => {
        if (res.data.status) setStats(res.data.data);
        else setError(res.data.message || "Stats load failed");
      })
      .catch(() => setError("Error loading stats"));

    // Today’s appointments
    axios
      .get(`http://localhost/Backend/staff_todays_apps.php?staff_id=${staff_id}`, {
        transformResponse: [(d: string) => JSON.parse(d.slice(d.indexOf("{")))],
      })
      .then((res) => {
        if (res.data.status) setTodayApps(res.data.data);
      })
      .catch(() => console.error("Error loading today's apps"));

    // Recent reviews (optional)
    axios
      .get(`http://localhost/Backend/staff_recent_rev.php?staff_id=${staff_id}`, {
        transformResponse: [(d: string) => JSON.parse(d.slice(d.indexOf("{")))],
      })
      .then((res) => {
        if (res.data.status) setReviews(res.data.data.slice(0, 3));
      })
      .catch(() => console.error("Error loading reviews"));
  }, [staff_id]);

  const handleViewAllApps = () => navigate(`/staff/schedule?staff_id=${staff_id}`);
  const handleEditProfile = () => navigate(`/staff/profile?staff_id=${staff_id}`);

  return (
    <div className="flex min-h-screen">
      <StaffHeader />

      <main className="flex-1 bg-gray-50 pl-64 overflow-auto">
        <div className="p-8 space-y-8">
          {/* Title + quick buttons */}
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">Staff Dashboard</h2>
            <div className="space-x-4">
              <button
                onClick={handleViewAllApps}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Schedule
              </button>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Edit Profile
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-gray-500">Total Appointments</p>
              <p className="mt-2 text-4xl font-bold">{stats.total}</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-gray-500">Pending</p>
              <p className="mt-2 text-4xl font-bold text-yellow-500">
                {stats.pending}
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <p className="text-gray-500">Confirmed / Completed</p>
              <p className="mt-2 text-4xl font-bold text-green-500">
                {stats.confirmed}
              </p>
            </div>
          </div>

          {/* Today's Appointments */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Today's Appointments</h3>
              <button
                onClick={handleViewAllApps}
                className="text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>
            {todayApps.length === 0 ? (
              <p className="text-gray-500">No appointments for today.</p>
            ) : (
              <ul className="space-y-2">
                {todayApps.map((app) => (
                  <li
                    key={app.appointment_id}
                    className="p-4 bg-white rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{app.client}</p>
                      <p className="text-sm text-gray-600">{app.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">{app.time}</p>
                      <p className="text-sm text-gray-500">{app.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Recent Reviews */}
          {reviews.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Recent Reviews</h3>
                {/* you could add a “View All Reviews” link */}
              </div>
              <ul className="space-y-4">
                {reviews.map((r, i) => (
                  <li key={i} className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <span className="font-medium">{r.customer_name}</span>
                      <div className="ml-4 flex">
                        {[...Array(5)].map((_, star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star < r.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.175 0L5.37 16.0c-.783.57-1.838-.197-1.538-1.118l1.286-3.966a1 1 0 00-.364-1.118L1.974 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{r.comment}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};
