import React from "react";
import { FooterSection } from "./sections/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { ServicesSection } from "./sections/ServicesSection";

export const Services = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-white">
      <HeaderSection />

      <ServicesSection />

      <FooterSection />
    </main>
  );
};
