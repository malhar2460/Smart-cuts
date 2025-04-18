import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./screens/HomePage/HomePage";
import { AboutUs } from "./screens/AboutUs/AboutUs"; // Example new page
import { ContactUs } from "./screens/ContactUs/ContactUs"; // Example new page
import { Salons }  from "./screens/Salons/Salons"; // Example new page
import { Services } from "./screens/Services/Services"; // Example new page
import { AdminDashboard } from "./screens/AdminDashboard/AdminDashboard"; // Example new page
import { AdminStaff } from "./screens/AdminStaff/AdminStaff"; // Example new page
import { AdminSchedule } from "./screens/AdminSchedule/AdminSchedule"; // Example new page
import { AppointmentDetails } from "./screens/AdminSchedule/AppointmentDetails"; // Example new page
import { LogIn } from "./screens/LogIn/LogIn"; // Example new page
import { Profile } from "./screens/Profile/Profile";
import { AdminProfile } from "./screens/AdminProfile/AdminProfile";
import { Booking } from "./screens/Booking/Booking";
import { AdminServices } from "./screens/AdminServices/AdminServices";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/salon" element={<Salons />} />
        <Route path="/service" element={<Services />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminstaff" element={<AdminStaff />} />
        <Route path="/adminschedule" element={<AdminSchedule />} />
        <Route path="/adminschedule/appointment/:appointmentId" element={<AppointmentDetails />} />
        <Route path="/adminstaff" element={<AdminStaff />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        <Route path="/adminservices" element={<AdminServices />} />
      </Routes>
    </Router>
  </StrictMode>
);
