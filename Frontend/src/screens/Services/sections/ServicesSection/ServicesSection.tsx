// src/screens/Services/sections/ServicesSection/ServicesSection.tsx
import React, { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "../../../../components/Services_ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "../../../../components/Services_ui/card";
import { Checkbox } from "../../../../components/Services_ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/Services_ui/select";
import { Button } from "../../../../components/Services_ui/button";
import axios from "axios";

// --- Types ---
interface Service {
  service_id: number;
  service_name: string;
  description: string;
  price: number;
  duration: number;
  rating?: number;
  reviews?: number;
  image: string;
  category: string; // "haircut"|"coloring"|"styling"|"treatment"
}

// for reviews
interface Review {
  review_id: number;
  customer_name: string;
  rating: number;
  comment: string;
}

export const ServicesSection: React.FC = (): JSX.Element => {
  const [services, setServices] = useState<Service[]>([]);
  const [modalService, setModalService] = useState<Service | null>(null);

  // filters & sort
  const [durations, setDurations] = useState({
    under30: false,
    between30and60: false,
    over60: false,
  });
  const [priceBounds, setPriceBounds] = useState({ min: 0, max: 200 });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200 });
  const [sortOption, setSortOption] = useState<
    "recommended" | "price-low" | "price-high" | "rating"
  >("recommended");

  // reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const salon_id = new URLSearchParams(window.location.search).get("salon_id");

  // fetch services
  useEffect(() => {
    if (!salon_id) return;
    axios
      .get("http://localhost/Backend/display_services.php", {
        params: { salon_id },
      })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.services)) {
          setServices(res.data.services);
        }
      })
      .catch(console.error);
  }, [salon_id]);

  // price bounds
  useEffect(() => {
    if (services.length > 0) {
      const prices = services.map((s) => s.price);
      const min = Math.min(...prices),
        max = Math.max(...prices);
      setPriceBounds({ min, max });
      setPriceRange({ min, max });
    }
  }, [services]);

  // fetch reviews
  useEffect(() => {
    if (!salon_id) return;
    axios
      .get("http://localhost/Backend/display_reviews.php", {
        params: { salon_id },
        transformResponse: [(raw: string) => {
          const i = raw.indexOf("{");
          return i >= 0 ? JSON.parse(raw.slice(i)) : {};
        }],
      })
      .then((res) => {
        if (res.data.status && Array.isArray(res.data.data)) {
          setReviews(res.data.data);
        }
      })
      .catch(console.error);
  }, [salon_id]);

  // submit new review
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer_id = localStorage.getItem("customer_id");
    if (!customer_id || newRating === 0 || !newComment.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost/Backend/add_review.php",
        {
          salon_id: Number(salon_id),
          customer_id: Number(customer_id),
          rating: newRating,
          comment: newComment.trim(),
        },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data.status) {
        // prepend to list
        setReviews((r) => [
          {
            review_id: res.data.review_id,
            customer_name: JSON.parse(localStorage.user).username,
            rating: newRating,
            comment: newComment.trim(),
          },
          ...r,
        ]);
        setNewRating(0);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // filtered + sorted services
  const displayed = useMemo(() => {
    const activeDurs = Object.entries(durations)
      .filter(([, v]) => v)
      .map(([k]) => k);
    return services
      .filter((s) => {
        if (s.price < priceRange.min || s.price > priceRange.max) {
          return false;
        }
        if (activeDurs.length > 0) {
          if (s.duration <= 30 && !activeDurs.includes("under30")) return false;
          if (
            s.duration > 30 &&
            s.duration < 60 &&
            !activeDurs.includes("between30and60")
          )
            return false;
          if (s.duration >= 60 && !activeDurs.includes("over60")) return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "rating":
            return (b.rating ?? 0) - (a.rating ?? 0);
          default:
            return 0;
        }
      });
  }, [services, durations, priceRange, sortOption]);

  return (
    <div className="w-full">
      {/* Sort dropdown */}
      <div className="max-w-[1280px] mx-auto px-4 py-6 flex justify-end">
        <Select
          value={sortOption}
          onValueChange={(v) => setSortOption(v as any)}
        >
          <SelectTrigger className="w-[244px] h-[43px] border">
            <SelectValue placeholder="Sort by: Recommended" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full py-8">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="max-w-[1248px] mx-auto flex flex-col md:flex-row gap-8">
            {/* Filters sidebar */}
            <Card className="w-full md:w-[305px] shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-6">Filters</h2>
                {/* Price */}
                <div className="mb-8">
                  <h3 className="font-medium text-base mb-2">Price Range</h3>
                  <div className="flex flex-col space-x-2">
                    <input
                      type="range"
                      min={priceBounds.min}
                      max={priceBounds.max}
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((r) => ({
                          ...r,
                          max: Math.max(Number(e.target.value), r.min),
                        }))
                      }
                    />
                    <span>₹{priceRange.max}</span>
                  </div>
                </div>
                {/* Duration */}
                <div className="mb-8">
                  <h3 className="font-medium text-base mb-2">Duration</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="under30"
                        checked={durations.under30}
                        onCheckedChange={(v) =>
                          setDurations((d) => ({ ...d, under30: v }))
                        }
                      />
                      <label htmlFor="under30" className="text-base">
                        Under 30 mins
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="30to60"
                        checked={durations.between30and60}
                        onCheckedChange={(v) =>
                          setDurations((d) => ({ ...d, between30and60: v }))
                        }
                      />
                      <label htmlFor="30to60" className="text-base">
                        30–60 mins
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="over60"
                        checked={durations.over60}
                        onCheckedChange={(v) =>
                          setDurations((d) => ({ ...d, over60: v }))
                        }
                      />
                      <label htmlFor="over60" className="text-base">
                        Over 60 mins
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((s) => (
                  <Card key={s.service_id} className="shadow-sm">
                    <div
                      className="relative h-48 rounded-t-lg"
                      style={{
                        backgroundImage: `url(${s.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* <Badge className="absolute top-4 right-4 bg-white text-black font-medium px-3 py-1 rounded-full">
                        {s.duration} min
                      </Badge> */}
                    </div>
                    <CardContent className="pt-4 pb-0">
                      <CardTitle className="text-lg mb-2">
                        {s.service_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-6">
                        {s.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-blue-600 font-semibold">
                          ₹{s.price}
                        </span>
                        <span className="font-medium">{s.duration}m</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pb-4">
                      <Button
                        className="w-full bg-blue-600 text-white"
                        onClick={() => setModalService(s)}
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

      {/* --- REVIEWS SECTION --- */}
      <section className="max-w-[1280px] mx-auto px-4 mt-12">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>

        <div className="space-y-6">
          {/* Existing reviews list */}
          <div className="max-h-80 overflow-y-auto space-y-4">
            {reviews.length > 0 ? reviews.map((r) => (
              <div key={r.review_id} className="p-4 bg-white rounded-lg shadow">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-4">{r.customer_name}</span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? "fill-yellow-400" : "fill-gray-300"}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 1l2.6 5.3 5.8.8-4.2 4.1 1 5.7L10 14.8l-5.2 2.7 1-5.7L1.6 7.1l5.8-.8L10 1z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{r.review_text}</p>
              </div>
            )) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          {/* “Write a Review” form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-medium mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Your Rating</label>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewRating(i + 1)}
                      className={`w-6 h-6 ${i < newRating ? "bg-yellow-400" : "bg-gray-300"} rounded-full`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Your Review</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Tell us what you thought…"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* BookingModal (unchanged) */}
      {modalService && salon_id && (
        <BookingModal
          service={modalService}
          salon_id={salon_id}
          onClose={() => setModalService(null)}
        />
      )}
    </div>
  );
};

// (ProgressBar and BookingModal unchanged)

// --- ProgressBar Component (unchanged) ---
const ProgressBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ["Select Time", "Choose Staff", "Payment"];
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between">
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center w-1/3">
            <div
              className={`w-12 h-12 rounded-full ${
                idx + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
              } flex items-center justify-center text-white text-lg`}
            >
              {idx + 1}
            </div>
            <span
              className={`mt-2 text-base font-medium ${
                idx + 1 <= currentStep ? "text-blue-600" : "text-gray-400"
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

// --- BookingModal Component (appended) ---
const BookingModal: React.FC<{
  service: Service;
  salon_id: string;
  onClose: () => void;
}> = ({ service, salon_id, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    date: "",
    time: "",
    staff: "",
    payment: {},
  });
  const [times, setTimes] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  const next = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // fetch times & staff when date is selected
  useEffect(() => {
    if (!formData.date) return;
    axios
      .get("http://localhost/Backend/available_slots.php", {
        params: {
          salon_id : salon_id,
          service_id: service.service_id,
          date: formData.date,
        },
      })
      .then((res) => {
        setTimes(res.data.times || []);
        setStaffList(res.data.staff || []);
      })
      .catch(console.error);
  }, [formData.date, salon_id, service.service_id]);

// inside BookingModal...
const handleComplete = async () => {
  const customerId = localStorage.getItem("customer_id");
  if (!customerId) {
    alert("Please log in as a customer first.");
    return;
  }

  try {
    const payload = {
      salon_id:    Number(salon_id),
      service_id:  service.service_id,
      staff_id:    formData.staff,
      customer_id: Number(customerId),
      date:        formData.date,
      time:        formData.time,
      payment:     formData.payment,  // { cardHolder, cardNumber, ... }
    };

    const res = await axios.post(
      "http://localhost/Backend/book_appointment.php",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.data.status) {
      alert("Appointment booked! 🎉");
      onClose();         // close modal
      // optionally, refresh parent data here
    } else {
      alert("Error: " + res.data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Network or server error. See console.");
  }
};


  const inputClass =
    "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Steps + Content */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{service.service_name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <ProgressBar currentStep={currentStep} />

          <div className="space-y-6">
            {/* Step 1: dynamic times */}
            {currentStep === 1 && (
              <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Select Date &amp; Time</h3>
              <input
                type="date"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4`}
                value={formData.date}
                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                min={format(new Date(), "yyyy-MM-dd")}
              />

              {/* time slots in a responsive multi‑column grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4
                              max-h-[50vh] overflow-y-auto">
                {times.map(t => (
                  <button
                    key={t}
                    onClick={() => setFormData(p => ({ ...p, time: t }))}
                    className={`py-3 rounded-lg border ${
                      formData.time === t
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
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

            {/* Step 2: dynamic staff */}
            {currentStep === 2 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Choose Staff</h3>
                <div className="space-y-4">
                  {staffList.map((m) => (
                    <div
                      key={m.staff_id}
                      onClick={() =>
                        setFormData((p) => ({ ...p, staff: m.staff_id }))
                      }
                      className={`p-4 rounded-lg border ${
                        formData.staff === m.staff_id
                          ? "border-blue-600 bg-blue-50"
                          : "hover:bg-gray-50"
                      } cursor-pointer`}
                    >
                      <h4 className="font-medium">{m.staff_name}</h4>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={back}>
                    Back
                  </Button>
                  <Button disabled={!formData.staff} onClick={next}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment (unchanged) */}
            {currentStep === 3 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
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
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="secondary" onClick={back}>
                    Back
                  </Button>
                  <Button
                    disabled={
                      !formData.payment.cardNumber ||
                      !formData.payment.cardHolder
                    }
                    onClick={handleComplete}
                  >
                    Confirm &amp; Pay ₹{service.price}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: info panel */}
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
