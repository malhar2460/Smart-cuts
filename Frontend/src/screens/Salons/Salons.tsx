// src/screens/Salons.tsx
import {
  ChevronDownIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "../../components/Salons_ui/badge";
import { Button } from "../../components/Salons_ui/button";
import { Card, CardContent } from "../../components/Salons_ui/card";
import { Input } from "../../components/Salons_ui/input";
import { Link, useNavigate } from "react-router-dom";
import { FooterSection } from "../HomePage/sections/FooterSection/FooterSection";
import { HeaderSection } from "../HomePage/sections/HeaderSection";

interface Salon {
  id: number;
  name: string;
  image: string;
  description: string;
  stars: number;
  reviews: number;
  location: string;
  avgPrice: number;
  avgDuration: number;
}

interface Service {
  category: string;
}

export const Salons = (): JSX.Element => {
  const navigate = useNavigate();

  // --- UI state ---
  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });
  const [durationRange, setDurationRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: Infinity,
  });
  const [ratingFilter, setRatingFilter] = useState<number | "">("");

  // --- Salon data ---
  const [salonCards, setSalonCards] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Categories state ---
  const [salonCategories, setSalonCategories] = useState<Record<number,string[]>>({});
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCats, setSelectedCats] = useState<string[]>([]); // start empty

  // require customer login
  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) return void navigate("/login");
    if (!JSON.parse(u).customer_id) return void navigate("/");
  }, [navigate]);

  // fetch all salons
  useEffect(() => {
    fetch("http://localhost/Backend/display_salons.php")
      .then((res) => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.services)) {
          const mapped: Salon[] = data.services.map((s: any) => ({
            id:           s.salon_id,
            name:         s.salon_name,
            image:        s.image.replace(/^(\.\.\/)+/, ""),
            description:  s.description,
            stars:        Number(s.avg_rating) || 0,
            reviews:      Number(s.review_count) || 0,
            location:     s.location,
            avgPrice:     Number(s.average_price)   || 0,
            avgDuration:  Number(s.average_duration) || 0,
          }));
          setSalonCards(mapped);
        } else {
          throw new Error("Unexpected data format");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // once salons are loaded, fetch each salon’s services → build categories
  useEffect(() => {
    if (salonCards.length === 0) return;
    Promise.all(
      salonCards.map((salon) =>
        fetch(
          `http://localhost/Backend/display_services.php?salon_id=${salon.id}`
        )
          .then((r) => r.json())
          .then((d) =>
            Array.isArray(d.services)
              ? Array.from(new Set(d.services.map((svc: Service) => svc.category)))
              : []
          )
          .catch(() => [])
      )
    )
      .then((arrays) => {
        const catMap: Record<number,string[]> = {};
        salonCards.forEach((s, idx) => (catMap[s.id] = arrays[idx]));
        setSalonCategories(catMap);
        // master list
        setAllCategories(Array.from(new Set(arrays.flat())));
      })
      .catch(console.error);
  }, [salonCards]);

  // filter out salons
  const displayed = useMemo(() => {
    return salonCards.filter((s) => {
      // name
      if (searchText && !s.name.toLowerCase().includes(searchText.toLowerCase()))
        return false;
      // location
      if (
        locationText &&
        !s.location.toLowerCase().includes(locationText.toLowerCase())
      )
        return false;
      // price
      if (priceRange.min && s.avgPrice < priceRange.min) return false;
      if (priceRange.max !== Infinity && s.avgPrice > priceRange.max) return false;
      // duration
      if (durationRange.min && s.avgDuration < durationRange.min) return false;
      if (
        durationRange.max !== Infinity &&
        s.avgDuration > durationRange.max
      )
        return false;
      // rating
      if (ratingFilter !== "" && Math.floor(s.stars) < ratingFilter) return false;
      // category — only if user selected at least one
      if (selectedCats.length > 0) {
        const cats = salonCategories[s.id] || [];
        if (!cats.some((c) => selectedCats.includes(c))) return false;
      }
      return true;
    });
  }, [
    salonCards,
    searchText,
    locationText,
    priceRange,
    durationRange,
    ratingFilter,
    salonCategories,
    selectedCats,
  ]);

  // star rendering helper
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const stars: JSX.Element[] = [];
    for (let i = 0; i < full; i++) {
      stars.push(
        <StarIcon key={`f${i}`} className="w-[18px] h-4 text-yellow-400 fill-yellow-400" />
      );
    }
    if (half) {
      stars.push(
        <StarIcon key="half" className="w-[18px] h-4 text-yellow-400 fill-yellow-400" />
      );
    }
    while (stars.length < 5) {
      stars.push(
        <StarIcon key={`e${stars.length}`} className="w-[18px] h-4 text-yellow-400" />
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white border-2 border-solid border-[#ced4da]">
      <HeaderSection />

      <main className="flex-1 bg-gray-50 px-12 py-6">
        {/* Search & Location */}
        <div className="max-w-7xl mx-auto mt-6 mb-10">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-4 top-3.5 w-4 h-4 text-[#adaebc]" />
              <Input
                className="pl-12 h-[50px] rounded-xl text-base"
                placeholder="Search salons…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="relative w-64">
              <MapPinIcon className="absolute left-4 top-3.5 w-3 h-4 text-[#adaebc]" />
              <Input
                className="pl-12 h-[50px] rounded-xl text-base"
                placeholder="Location"
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Category Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCats.includes(cat) ? "default" : "outline"}
                className={`rounded-full px-6 py-2.5 h-10 ${
                  selectedCats.includes(cat)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                } text-base`}
                onClick={() =>
                  setSelectedCats((prev) =>
                    prev.includes(cat)
                      ? prev.filter((c) => c !== cat)
                      : [...prev, cat]
                  )
                }
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Price / Duration / Rating dropdowns */}
          <div className="flex space-x-4">
            <select
              value={`${priceRange.min}-${priceRange.max === Infinity ? "" : priceRange.max}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split("-");
                setPriceRange({
                  min: Number(min) || 0,
                  max: max ? Number(max) : Infinity,
                });
              }}
              className="h-10 px-4 border rounded bg-white"
            >
              <option value="0-">All Prices</option>
              <option value="0-500">0 – 500</option>
              <option value="500-1000">500 – 1 000</option>
              <option value="1000-">1 000 +</option>
            </select>
            <select
              value={`${durationRange.min}-${durationRange.max === Infinity ? "" : durationRange.max}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split("-");
                setDurationRange({
                  min: Number(min) || 0,
                  max: max ? Number(max) : Infinity,
                });
              }}
              className="h-10 px-4 border rounded bg-white"
            >
              <option value="0-">All Durations</option>
              <option value="0-30">Up to 30 min</option>
              <option value="30-60">30 – 60 min</option>
              <option value="60-">60 + min</option>
            </select>
            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="h-10 px-4 border rounded bg-white"
            >
              <option value="">All Ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 ★ & up</option>
              <option value="3">3 ★ & up</option>
              <option value="2">2 ★ & up</option>
              <option value="1">1 ★ & up</option>
            </select>
          </div>
        </div>

        {/* Salon Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {loading ? (
            <p>Loading salons…</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : displayed.length > 0 ? (
            displayed.map((salon) => (
              <Card
                key={salon.id}
                className="rounded-xl shadow-sm overflow-hidden"
              >
                <div
                  className="relative h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url(${salon.image})` }}
                />
                <CardContent className="p-6">
                  <h3 className="text-xl font-normal text-black mb-4">
                    {salon.name}
                  </h3>
                  <div className="flex items-center mb-1">
                    <div className="flex">{renderStars(salon.stars)}</div>
                    <span className="ml-2 text-gray-600 text-base">
                      {salon.stars.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Based on {salon.reviews} review
                    {salon.reviews !== 1 ? "s" : ""}
                  </p>
                  <p className="text-gray-600 text-base mb-6">
                    {salon.description}
                  </p>
                  <Link to={`/service?salon_id=${salon.id}`}>
                    <Button className="w-full bg-blue-600 text-white text-base py-3.5">
                      Book Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No salons found.</p>
          )}
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
