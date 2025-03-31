import React from "react";
import { BusinessGrowthSection } from "./sections/BusinessGrowthSection/BusinessGrowthSection";
import { CallToActionSection } from "./sections/CallToActionSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { HeaderSection } from "./sections/HeaderSection";
import { HeroSection } from "./sections/HeroSection";
import { PopularSalonsSection } from "./sections/PopularSalonsSection/PopularSalonsSection";
import { ServicesSection } from "./sections/ServicesSection";

export const HomePage = (): JSX.Element => {
  return (
    <div className="flex flex-col w-full bg-white">
      <HeaderSection />
      <HeroSection />
      <ServicesSection />
      <PopularSalonsSection />
      <BusinessGrowthSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};
