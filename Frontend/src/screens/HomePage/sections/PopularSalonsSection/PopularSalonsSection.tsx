import { ChevronRightIcon, MapPinIcon, StarIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/HomePage_ui/button";
import { Card, CardContent } from "../../../../components/HomePage_ui/card";

export const PopularSalonsSection = (): JSX.Element => {
  // Salon data for mapping
  const salons = [
    {
      id: 1,
      name: "Style Studio",
      location: "Downtown, NYC",
      rating: "4.9",
      price: "From $30",
      image: "..//img-1.png",
    },
    {
      id: 2,
      name: "Glamour House",
      location: "Brooklyn, NYC",
      rating: "4.8",
      price: "From $45",
      image: "..//img-2.png",
    },
    {
      id: 3,
      name: "The Cut Lounge",
      location: "Manhattan, NYC",
      rating: "4.7",
      price: "From $35",
      image: "..//img-3.png",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="font-bold text-3xl text-gray-900 [font-family:'Poppins',Helvetica] leading-[30px]">
            Popular Salons
          </h2>

          <div className="flex items-center">
            <a
              href="#"
              className="text-indigo-600 [font-family:'Poppins',Helvetica] text-base leading-4 mr-1"
            >
              View All
            </a>
            <ChevronRightIcon className="h-4 w-3.5 text-indigo-600" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {salons.map((salon) => (
            <Card
              key={salon.id}
              className="rounded-xl overflow-hidden shadow-[0px_1px_2px_#0000000d]"
            >
              <div
                className="h-48 w-full relative"
                style={{
                  backgroundImage: `url(${salon.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute top-4 right-4 bg-white rounded-full px-4 py-1 flex items-center">
                  <StarIcon className="h-3.5 w-4 text-black mr-1 fill-current" />
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-black text-sm">
                    {salon.rating}
                  </span>
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="font-bold text-xl text-gray-900 [font-family:'Poppins',Helvetica] leading-5 mb-4">
                  {salon.name}
                </h3>

                <div className="flex items-center mb-8">
                  <MapPinIcon className="h-4 w-3 text-gray-600 mr-2" />
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-gray-600 text-base leading-4">
                    {salon.location}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="[font-family:'Poppins',Helvetica] font-normal text-gray-500 text-sm leading-[14px]">
                    {salon.price}
                  </span>

                  <Button className="bg-indigo-600 text-white rounded-full h-10 px-4 hover:bg-indigo-700">
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
