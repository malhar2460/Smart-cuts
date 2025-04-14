import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/AdminStaff_ui/card";
import { Button } from "../../components/AdminStaff_ui/button";
import { ArrowLeftIcon } from "lucide-react";

export const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [appointment, setAppointment] = useState(null);
  
  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails(appointmentId);
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async (id) => {
    setLoading(true);
    try {
      // Call the details endpoint which requires ?id= parameter.
      const res = await axios.get("http://localhost/Backend/admin_get_appointment_details.php", {
        params: { id }
      });
      if (res.data?.status) {
        setAppointment(res.data.data.appointment);
      } else {
        setErrorMessage(res.data.message || "Error fetching appointment");
      }
    } catch (error) {
      setErrorMessage("Error fetching appointment");
    }
    setLoading(false);
  };
console.log(appointment)
  // Handler to reschedule (for demo, a hard-coded new date is used)
  const handleReschedule = async () => {
    const newDateTime = "2025-03-16 14:30:00";
    try {
      const res = await axios.post("http://localhost/Backend/admin_reschedule_appointment.php", {
        appointment_id: appointmentId,
        new_date_time: newDateTime,
      });
      if (res.data?.status) {
        alert("Appointment rescheduled successfully");
        fetchAppointmentDetails(appointmentId);
      } else {
        alert(res.data.message || "Error rescheduling appointment");
      }
    } catch (error) {
      alert("Error rescheduling appointment");
    }
  };

  // Handler to cancel appointment
  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const res = await axios.post("http://localhost/Backend/admin_cancel_appointment.php", {
        appointment_id: appointmentId,
      });
      if (res.data?.status) {
        alert("Appointment canceled");
        navigate("/adminschedule");
      } else {
        alert(res.data.message || "Error canceling appointment");
      }
    } catch (error) {
      alert("Error canceling appointment");
    }
  };

  if (loading) {
    return <p className="p-4">Loading appointment details...</p>;
  }
  if (errorMessage) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="text-red-500 mt-4">{errorMessage}</p>
      </div>
    );
  }
  if (!appointment) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="mt-4">No appointment found.</p>
      </div>
    );
  }

  const dateValue = appointment.date_time || appointment.appointment_date;
  const formattedDate = dateValue ? format(new Date(dateValue), "MMMM d, yyyy - h:mma") : "Date not available";
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="text-xl font-semibold text-gray-800">{appointment.service}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stylist</p>
              <p className="text-xl font-semibold text-gray-800">{appointment.stylist_name}</p>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Date & Time</p>
              <p className="text-base text-gray-800">
                {formattedDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="text-base text-gray-800">{appointment.location || "Default Location"}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Notes</p>
            <p className="text-base text-gray-800">{appointment.notes || "No additional notes."}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={handleReschedule}>
              Reschedule
            </Button>
            <Button variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
