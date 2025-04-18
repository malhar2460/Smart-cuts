import React, { useState } from "react";
import { Button } from "../../components/Services_ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "../../components/Services_ui/card";
import { Badge } from "../../components/Services_ui/badge";

// Type definitions
type Service = {
  service_id: number;
  service_name: string;
  description: string;
  price: number;
  duration: string;
  rating?: string;
  reviews?: string;
  image?: string;
};

type StaffMember = {
  id: number;
  name: string;
  specialization: string;
};

type BookingFormData = {
  date: string;
  time: string;
  staff: string;
  payment: {
    cardNumber?: string;
  };
};

// Progress Bar Component
const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ["Select Time", "Choose Staff", "Payment"];
  
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center w-1/3">
            <div className={`w-8 h-8 rounded-full ${
              index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-200"
            } flex items-center justify-center text-white`}>
              {index + 1}
            </div>
            <span className={`mt-2 text-sm ${
              index + 1 <= currentStep ? "text-blue-600" : "text-gray-400"
            }`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 1: Time Selection
const TimeSelectionStep: React.FC<{ 
  onNext: () => void; 
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
}> = ({ onNext, formData, setFormData }) => {
  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Select Date & Time</h3>
      <div className="mb-4">
        <label className="block mb-2">Select Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={formData.date}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]} // Disable past dates
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            type="button"
            onClick={() => handleTimeSelect(time)}
            className={`p-2 border rounded ${
              formData.time === time ? "bg-blue-600 text-white" : ""
            }`}
          >
            {time}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={!formData.date || !formData.time}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Step 2: Staff Selection
const StaffSelectionStep: React.FC<{ 
  onNext: () => void;
  onBack: () => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
}> = ({ onNext, onBack, formData, setFormData }) => {
  const staffMembers: StaffMember[] = [
    { id: 1, name: "John Doe", specialization: "Senior Stylist" },
    { id: 2, name: "Jane Smith", specialization: "Color Specialist" },
    { id: 3, name: "Mike Johnson", specialization: "Barber" },
  ];

  const handleStaffSelect = (staffId: string) => {
    setFormData(prev => ({ ...prev, staff: staffId }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Choose Staff</h3>
      <div className="space-y-4">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            onClick={() => handleStaffSelect(staff.id.toString())}
            className={`p-4 border rounded cursor-pointer ${
              formData.staff === staff.id.toString() ? "border-blue-600" : ""
            }`}
          >
            <h4 className="font-medium">{staff.name}</h4>
            <p className="text-sm text-gray-600">{staff.specialization}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={!formData.staff}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Step 3: Payment
const PaymentStep: React.FC<{ 
  onComplete: () => void;
  onBack: () => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
}> = ({ onComplete, onBack, formData, setFormData }) => {
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ 
      ...prev, 
      payment: { ...prev.payment, cardNumber: e.target.value } 
    }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-2">Card Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="4242 4242 4242 4242"
            value={formData.payment.cardNumber || ''}
            onChange={handleCardNumberChange}
          />
        </div>
        {/* Additional payment fields can be added here */}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={!formData.payment.cardNumber}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

// Booking Modal Component
const BookingModal: React.FC<{ 
  service: Service | null;
  onClose: () => void;
}> = ({ service, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    time: "",
    staff: "",
    payment: {}
  });

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{service?.service_name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <ProgressBar currentStep={currentStep} />
        
        {currentStep === 1 && (
          <TimeSelectionStep 
            onNext={handleNext} 
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {currentStep === 2 && (
          <StaffSelectionStep 
            onNext={handleNext} 
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
        {currentStep === 3 && (
          <PaymentStep 
            onComplete={onClose} 
            onBack={handleBack}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

// Main Booking Component
export const Booking: React.FC<{ service: Service }> = ({ service }) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

  return (
    <>
      <Card key={service.service_id} className="shadow-sm">
        <div
          className="relative h-48 rounded-t-lg"
          style={{
            backgroundImage: service.image ? `url(${service.image})` : 'none',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: service.image ? 'transparent' : '#f3f4f6'
          }}
        >
          <Badge className="absolute top-4 right-4 bg-white text-black font-medium px-3 py-1 rounded-full">
            {service.duration} min
          </Badge>
        </div>
        <CardContent className="pt-4 pb-0">
          <CardTitle className="text-lg mb-2">{service.service_name}</CardTitle>
          <p className="text-sm text-gray-600 mb-6">{service.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-blue-600 font-semibold">
              ₹{service.price}
            </span>
            <div className="flex items-center">
              <span className="ml-1">
                {service.rating || "4.5"} ({service.reviews || "50"})
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pb-4">
          <Button 
            className="w-full bg-blue-600 text-white"
            onClick={() => setShowBookingModal(true)}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>

      {showBookingModal && (
        <BookingModal
          service={service}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </>
  );
};