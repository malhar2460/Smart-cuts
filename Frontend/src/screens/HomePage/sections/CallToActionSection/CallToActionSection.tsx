import React from "react";
import { Button } from "../../../../components/HomePage_ui/button";

export const CallToActionSection = (): JSX.Element => {
  return (
    <section className="w-full bg-indigo-600 py-20">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="font-bold text-4xl text-white text-center font-['Poppins',Helvetica] leading-9 mb-8">
          Ready to Transform Your Salon Business?
        </h2>

        <p className="text-indigo-100 text-center font-['Poppins',Helvetica] font-normal text-xl leading-5 mb-12 max-w-[650px]">
          Join thousands of successful salon owners who are growing their
          business with SmartCuts
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button className="h-[52px] w-[179px] bg-white text-indigo-600 hover:bg-white/90 rounded-full font-['Poppins',Helvetica] font-normal text-base">
            Start Free Trial
          </Button>

          <Button
            variant="outline"
            className="h-[52px] w-[195px] border-2 border-white text-white hover:bg-white/10 rounded-full font-['Poppins',Helvetica] font-normal text-black"
          >
            Schedule Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
