import React from "react";
import { Card, CardContent } from "../../../../components/HomePage_ui/card";

export const ServicesSection = (): JSX.Element => {
  // Service card data for mapping
  const serviceCards = [
    {
      id: 1,
      icon: "/frame.svg",
      title: "Easy Booking",
      description: "Book appointments 24/7 with real-time availability updates",
    },
    {
      id: 2,
      icon: "/frame-12.svg",
      title: "Multi-location Management",
      description: "Manage multiple salon locations from a single dashboard",
    },
    {
      id: 3,
      icon: "/frame-7.svg",
      title: "Analytics & Insights",
      description:
        "Track performance and grow your business with detailed reports",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col items-center mb-14">
          <h2 className="font-bold text-3xl text-gray-900 text-center font-['Poppins',Helvetica] mb-5">
            Why Choose SmartCuts
          </h2>
          <p className="font-normal text-base text-gray-600 text-center font-['Poppins',Helvetica]">
            Everything you need to manage your salon business efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {serviceCards.map((card) => (
            <Card
              key={card.id}
              className="rounded-xl shadow-[0px_1px_2px_#0000000d] border-0"
            >
              <CardContent className="p-8">
                <div className="mb-5">
                  <div className="flex items-center justify-start">
                    <img
                      className="h-[30px]"
                      alt="Feature icon"
                      src={card.icon}
                    />
                  </div>
                </div>

                <h3 className="font-bold text-xl text-gray-900 font-['Poppins',Helvetica] mb-4">
                  {card.title}
                </h3>

                <p className="font-normal text-base text-gray-600 font-['Poppins',Helvetica]">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
