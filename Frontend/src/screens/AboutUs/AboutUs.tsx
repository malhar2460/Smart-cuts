import React from "react";
import { MainContentSection } from "./sections/MainContentSection";
import { NavigationSection } from "./sections/NavigationSection";

import { FooterSection } from "../HomePage/sections/FooterSection/FooterSection";
import { HeaderSection } from "../HomePage/sections/HeaderSection";

export const AboutUs = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full bg-white border border-border">
      <header className="w-full border-b">
        <HeaderSection />
      </header>

      <section className="w-full bg-gray-50">
        <MainContentSection />
      </section>

      <footer className="w-full">
        <FooterSection />
      </footer>
    </main>
  );
};
