
import React from "react";
import { Badge } from "../../../../components/Services_ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/Services_ui/breadcrumb";
import { Button } from "../../../../components/Services_ui/button";
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
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";


export const ServicesSection = (): JSX.Element => {
  // Service data for mapping
  const { salon_id } = useParams(); 
  const [services, setServices] = useState([]);

  useEffect(() => {
    if (salon_id) {
      axios
        .get(`http://localhost/Backend/display_services.php?salon_id=${salon_id}`)
        .then((res) => setServices(res.data))
        .catch((err) => console.error("Error fetching services:", err));
    }
  }, [salon_id]);
  // const services = [
  //   {
  //     id: 1,
  //     name: "Men's Classic Haircut",
  //     description:
  //       "Professional cut includes consultation, shampoo, and styling",
  //     price: "$35.00",
  //     duration: "45 min",
  //     rating: "4.8",
  //     reviews: "126",
  //     image: "..//img.png",
  //   },
  //   {
  //     id: 2,
  //     name: "Full Color Treatment",
  //     description: "Complete color service with premium products and styling",
  //     price: "$120.00",
  //     duration: "120 min",
  //     rating: "4.9",
  //     reviews: "84",
  //     image: "..//img-1.png",
  //   },
  //   {
  //     id: 3,
  //     name: "Special Event Styling",
  //     description: "Elegant styling for weddings, proms, and special occasions",
  //     price: "$75.00",
  //     duration: "60 min",
  //     rating: "4.7",
  //     reviews: "92",
  //     image: "..//img-2.png",
  //   },
  // ];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="w-full py-16 bg-white border-b border-solid">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="max-w-[1248px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="max-w-[816px]">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-8">
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        className="text-sm text-gray-500"
                      >
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <img
                        className="w-[7.5px] h-3"
                        alt="Separator"
                        src="/frame-16.svg"
                      />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        className="text-sm text-gray-500"
                      >
                        Salons
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <img
                        className="w-[7.5px] h-3"
                        alt="Separator"
                        src="/frame-16.svg"
                      />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href="#"
                        className="text-sm text-blue-600"
                      >
                        Downtown SmartCuts
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                {/* Salon Name */}
                <h1 className="text-3xl font-bold mb-4">Downtown SmartCuts</h1>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <img
                        key={star}
                        className="w-[18px] h-4"
                        alt="Star"
                        src="/frame-6.svg"
                      />
                    ))}
                    <img
                      className="w-5 h-4"
                      alt="Half star"
                      src="/frame-23.svg"
                    />
                  </div>
                  <span className="ml-2 text-gray-600">
                    (4.5) · 238 reviews
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-center">
                  <img className="w-3 h-4" alt="Location" src="/frame-4.svg" />
                  <span className="ml-2 text-gray-600">
                    123 Main Street, Downtown, NY 10001
                  </span>
                </div>
              </div>

              <div className="mt-4 md:mt-0">
                {/* Hours */}
                <div className="flex items-center justify-end mb-2">
                  <img
                    className="w-4 h-4 mr-2"
                    alt="Clock"
                    src="/frame-28.svg"
                  />
                  <span className="text-gray-600">
                    Open today until 9:00 PM
                  </span>
                </div>

                {/* Book Appointment Button */}
                <Button  className="w-full md:w-[198px] h-12 bg-blue-600 text-white">
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                        <Checkbox
                          id="haircut"
                          className="bg-[#0075ff] border-0"
                          defaultChecked
                        />
                        <label htmlFor="haircut" className="text-base">
                          Haircut
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="coloring" />
                        <label htmlFor="coloring" className="text-base">
                          Coloring
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="styling" />
                        <label htmlFor="styling" className="text-base">
                          Styling
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="treatment" />
                        <label htmlFor="treatment" className="text-base">
                          Treatment
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-8">
                    <h3 className="font-medium text-base mb-2">Price Range</h3>
                    <div className="relative h-2 bg-neutral-200 rounded-full border-[0.5px] border-[#b7b5b5]">
                      <div className="h-2 bg-[#0075ff] rounded-full w-full">
                        <div className="w-[18px] h-[18px] absolute top-[-5px] right-0">
                          {/* <img
                            className="w-[18px] h-[18px]"
                            alt="Slider handle"
                            src="/frame-4.svg"
                          /> */}
                        </div>
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
                        <label htmlFor="under30" className="text-base">
                          Under 30 mins
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="30to60" />
                        <label htmlFor="30to60" className="text-base">
                          30-60 mins
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="over60" />
                        <label htmlFor="over60" className="text-base">
                          Over 60 mins
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <h3 className="font-medium text-base mb-2">Rating</h3>
                    <RadioGroup defaultValue="5stars">
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem
                          value="5stars"
                          id="5stars"
                          className="rounded-full"
                        />
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <img
                              key={star}
                              className="w-[18px] h-4"
                              alt="Star"
                              src="/frame-6.svg"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="4stars"
                          id="4stars"
                          className="rounded-full"
                        />
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <img
                              key={star}
                              className="w-[18px] h-4"
                              alt="Star"
                              src="/frame-6.svg"
                            />
                          ))}
                          <img
                            className="w-[18px] h-4"
                            alt="Empty star"
                            src="/frame-11.svg"
                          />
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
                      <SelectItem value="recommended">
                        Sort by: Recommended
                      </SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <Card key={service.id} className="shadow-sm">
                      <div
                        className="relative h-48 rounded-t-lg"
                        style={{
                          backgroundImage: `url(${service.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <Badge className="absolute top-4 right-4 bg-white text-black font-medium px-3 py-1 rounded-full">
                          {service.duration}
                        </Badge>
                      </div>
                      <CardContent className="pt-4 pb-0">
                        <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                        <p className="text-sm text-gray-600 mb-6">{service.description}</p>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-blue-600 font-semibold">
                            {service.price}
                          </span>
                          <div className="flex items-center">
                            <img className="w-[18px] h-4" alt="Star" src="/frame-1.svg" />
                            <span className="ml-1">
                              {service.rating} ({service.reviews})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pb-4">
                        <Button className="w-full bg-blue-600 text-white">Book Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
