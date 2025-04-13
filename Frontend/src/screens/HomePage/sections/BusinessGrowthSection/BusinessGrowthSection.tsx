import { CheckIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/HomePage_ui/button";
import { Card, CardContent } from "../../../../components/HomePage_ui/card";

export const BusinessGrowthSection = (): JSX.Element => {
  // Feature list data
  const features = [
    "Manage multiple locations easily",
    "Track staff performance and scheduling",
    "Get insights with detailed analytics",
  ];

  // Stats cards data
  const statsCards = [
    {
      value: "50K+",
      label: "Active Users",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      value: "1M+",
      label: "Bookings",
      bgColor: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      value: "5K+",
      label: "Salons",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      value: "98%",
      label: "Satisfaction",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="container max-w-[1280px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          {/* Left side - Text content */}
          <div className="w-full lg:w-1/2 max-w-[600px]">
            <h2 className="text-4xl font-bold text-gray-900 font-['Poppins',Helvetica] leading-9 mb-8">
              Grow Your Salon Business
            </h2>

            <p className="text-xl text-gray-600 font-['Poppins',Helvetica] font-normal leading-5 mb-10">
              Join thousands of salon owners who trust SmartCuts to manage and
              grow their business.
            </p>

            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex items-center justify-center mr-2 mt-1">
                    <CheckIcon className="h-4 w-3.5 text-indigo-600" />
                  </div>
                  <span className="font-['Poppins',Helvetica] font-normal text-gray-700 text-base leading-4">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <Button className="bg-indigo-600 text-white rounded-full h-12 px-8 font-['Poppins',Helvetica] font-normal">
              Get Started
            </Button>
          </div>

          {/* Right side - Stats cards */}
          <div className="w-full lg:w-1/2 max-w-[600px]">
            <div className="grid grid-cols-2 gap-4">
              {statsCards.map((stat, index) => (
                <Card
                  key={index}
                  className={`${stat.bgColor} border-0 rounded-xl shadow-none`}
                >
                  <CardContent className="p-6">
                    <div className="mb-2">
                      <p
                        className={`text-4xl font-bold ${stat.textColor} font-['Poppins',Helvetica] leading-10`}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-normal text-gray-600 font-['Poppins',Helvetica]">
                        {stat.label}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
