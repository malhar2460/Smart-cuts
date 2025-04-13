import React from "react";
import { Button } from "../../../../components/HomePage_ui/button";

export const HeroSection = (): JSX.Element => {
  return (
    <section className="w-full py-24 [background:linear-gradient(90deg,rgba(238,242,255,1)_0%,rgba(245,243,255,1)_100%)]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="font-bold text-5xl leading-tight text-gray-900 font-['Poppins',Helvetica] max-w-[547px]">
              Book Your Perfect Hair Experience
            </h1>

            <p className="text-xl text-gray-600 font-['Poppins',Helvetica] max-w-[572px]">
              Connect with top salons in your area. Book appointments easily and
              manage your beauty journey.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="rounded-full h-[50px] px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-['Poppins',Helvetica]">
                Book Now
              </Button>

              <Button
                variant="outline"
                className="rounded-full h-[50px] px-8 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-['Poppins',Helvetica]"
              >
                For Salon Owners
              </Button>
            </div>
          </div>

          <div className="flex-1">
            <div
              className="h-[600px] w-full rounded-lg shadow-[0px_25px_50px_#00000040] bg-cover bg-center"
              style={{ backgroundImage: "url(../img.png)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
