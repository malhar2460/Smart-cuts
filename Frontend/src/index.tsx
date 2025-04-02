import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./screens/HomePage/HomePage";
import { AboutUs } from "./screens/AboutUs/AboutUs"; // Example new page
import { ContactUs } from "./screens/ContactUs/ContactUs"; // Example new page
import { Salons }  from "./screens/Salons/Salons"; // Example new page
import { Services } from "./screens/Services/Services"; // Example new page
import { AdminDashboard } from "./screens/AdminDashboard/AdminDashboard"; // Example new page

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
      </Routes>
    </Router>
  </StrictMode>
);
