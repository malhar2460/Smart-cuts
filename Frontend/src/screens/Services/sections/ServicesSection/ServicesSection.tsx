import React, { useEffect, useState } from "react";
import { Badge } from "../../../../components/Services_ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "../../../../components/Services_ui/card";
import { Checkbox } from "../../../../components/Services_ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/Services_ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/Services_ui/select";
import { Button } from "../../../../components/Services_ui/button";
import axios from "axios";

// --- Booking Types ---
interface Service { /* ...unchanged... */ }
interface StaffMember { /* ...unchanged... */ }
interface BookingFormData { /* ...unchanged... */ }

// --- Progress Bar Component (now larger) ---
const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ["Select Time", "Choose Staff", "Payment"];
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center w-1/3">
            <div
              className={`w-12 h-12 rounded-full ${idx + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
                } flex items-center justify-center text-white text-lg`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-2 text-base font-medium ${idx + 1 <= currentStep ? "text-blue-600" : "text-gray-500"
                }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Booking Modal with richer UI ---
const BookingModal: React.FC<{ service: Service; onClose: () => void }> = ({
  service,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    time: "",
    staff: "",
    payment: {},
  });

  const next = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // Final submission handler (unchanged)
  const handleComplete = async () => { /* ...unchanged... */ };

  // Improved field styling
  const inputClass = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Steps + Content */}
        <div className="col-span-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{service.service_name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>

          <ProgressBar currentStep={currentStep} />

          <div className="space-y-6">
            {currentStep === 1 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Select Date & Time</h3>
                <input
                  type="date"
                  className={inputClass + " mb-4"}
                  value={formData.date}
                  onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
                  min={new Date().toISOString().split("T")[0]}
                />
                <div className="grid grid-cols-2 gap-4">
                  {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormData((p) => ({ ...p, time: t }))}
                      className={`py-3 rounded-lg border ${formData.time === t ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button disabled={!formData.date || !formData.time} onClick={next}>
                    Next
                  </Button>
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Choose Staff</h3>
                <div className="space-y-4">
                  {[
                    { id: 1, name: "John Doe", specialization: "Senior Stylist" },
                    { id: 2, name: "Jane Smith", specialization: "Color Specialist" },
                    { id: 3, name: "Mike Johnson", specialization: "Barber" },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setFormData((p) => ({ ...p, staff: String(m.id) }))}
                      className={`p-4 rounded-lg border ${formData.staff === String(m.id)
                          ? "border-blue-600 bg-blue-50"
                          : "hover:bg-gray-50"
                        } cursor-pointer`}
                    >
                      <h4 className="font-medium">{m.name}</h4>
                      <p className="text-gray-600">{m.specialization}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={back}>Back</Button>
                  <Button disabled={!formData.staff} onClick={next}>Next</Button>
                </div>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                {/* Payment gateway logos */}
                <div className="flex items-center space-x-6 my-7">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="Mastercard"
                    className="h-8"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="h-8"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Full name as on card"
                      value={formData.payment.cardHolder || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          payment: { ...p.payment, cardHolder: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Card Number</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="#### #### #### ####"
                      value={formData.payment.cardNumber || ""}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          payment: { ...p.payment, cardNumber: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1">Expiry</label>
                      <input
                        type="month"
                        className={inputClass}
                        value={formData.payment.expiry || ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            payment: { ...p.payment, expiry: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        className={inputClass}
                        placeholder="XXX"
                        value={formData.payment.cvv || ""}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            payment: { ...p.payment, cvv: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={back}>Back</Button>
                  <Button
                    disabled={
                      !formData.payment.cardNumber ||
                      !formData.payment.cardHolder ||
                      !formData.payment.expiry ||
                      !formData.payment.cvv
                    }
                    onClick={handleComplete}
                  >
                    Confirm & Pay ₹{service.price}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Optional image / info panel */}
        <div className="hidden lg:block bg-gray-50 p-6 rounded-lg">
          <img
            src={service.image}
            alt={service.service_name}
            className="rounded-lg mb-6 w-full h-48 object-cover"
          />
          <h4 className="text-lg font-semibold mb-2">You're booking:</h4>
          <p className="mb-4">{service.service_name}</p>
          <div className="flex items-center mb-2">
            <Badge className="bg-white text-black px-2 py-1 rounded-lg mr-2">
              ⏱ {service.duration} min
            </Badge>
            <Badge className="bg-white text-black px-2 py-1 rounded-lg">
              💵 ₹{service.price}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Services Section with Booking Integration ---
export const ServicesSection: React.FC = (): JSX.Element => {
  const [services, setServices] = useState<Service[]>([]);
  const [modalService, setModalService] = useState<Service | null>(null);

  const queryParams = new URLSearchParams(window.location.search);
  const salon_id = queryParams.get("salon_id");

  useEffect(() => {
    if (salon_id) {
      axios
        .get(
          `http://localhost/Backend/display_services.php?salon_id=${salon_id}`
        )
        .then((res) => {
          if (res.data?.success && Array.isArray(res.data.services)) {
            setServices(res.data.services);
          } else {
            console.error("API error or unexpected format:", res.data?.message);
            setServices([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching services:", err);
          setServices([]);
        });
    }
  }, [salon_id]);

  return (
    <div className="w-full">
      {/* Main Content Section */}
      <div className="w-full py-8">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="max-w-[1248px] mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters Sidebar */}
              <Card className="w-full md:w-[305px] shadow-sm">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg mb-6">Filters</h2>

                  {/* Categories */}
                  <div className="mb-8">
                    <h3 className="font-medium text-base mb-2">Categories</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="haircut" className="bg-[#0075ff] border-0" defaultChecked />
                        <label htmlFor="haircut" className="text-base">Haircut</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coloring" />
                        <label htmlFor="coloring" className="text-base">Coloring</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="styling" />
                        <label htmlFor="styling" className="text-base">Styling</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="treatment" />
                        <label htmlFor="treatment" className="text-base">Treatment</label>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <h3 className="font-medium text-base mb-2">Price Range</h3>
                    <div className="relative h-2 bg-neutral-200 rounded-full border-[0.5px] border-[#b7b5b5]">
                      <div className="h-2 bg-[#0075ff] rounded-full w-full">
                        <div className="w-[18px] h-[18px] absolute top-[-5px] right-0"></div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">$0</span>
                      <span className="text-sm text-gray-600">$200</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="mb-8">
                    <h3 className="font-medium text-base mb-2">Duration</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="under30" />
                        <label htmlFor="under30" className="text-base">Under 30 mins</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="30to60" />
                        <label htmlFor="30to60" className="text-base">30-60 mins</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="over60" />
                        <label htmlFor="over60" className="text-base">Over 60 mins</label>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-medium text-base mb-2">Rating</h3>
                    <RadioGroup defaultValue="5stars">
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="5stars" id="5stars" className="rounded-full" />
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <img key={star} className="w-[18px] h-4" alt="Star" src="/frame-6.svg" />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4stars" id="4stars" className="rounded-full" />
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <img key={star} className="w-[18px] h-4" alt="Star" src="/frame-6.svg" />
                          ))}
                          <img className="w-[18px] h-4" alt="Empty star" src="/frame-11.svg" />
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Services Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Available Services</h2>
                  <Select defaultValue="recommended">
                    <SelectTrigger className="w-[244px] h-[43px] border">
                      <SelectValue placeholder="Sort by: Recommended" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recommended">Sort by: Recommended</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card key={service.service_id} className="shadow-sm">
                      <div
                        className="relative h-48 rounded-t-lg"
                        style={{
                          backgroundImage: `url(${service.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
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
                          <span className="text-blue-600 font-semibold">₹{service.price}</span>
                          <div className="flex items-center">
                            <img className="w-[18px] h-4" alt="Star" src="/frame-6.svg" />
                            <span className="ml-1">{service.rating || "4.5"} ({service.reviews || "50"})</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pb-4">
                        <Button
                          className="w-full bg-blue-600 text-white"
                          onClick={() => setModalService(service)}
                        >
                          Book Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {modalService && (
          <BookingModal service={modalService} onClose={() => setModalService(null)} />
        )};
      </div>
    </div>
  )
};
