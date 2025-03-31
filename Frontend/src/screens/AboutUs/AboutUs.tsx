import React from "react";
import { FooterSection } from "./sections/FooterSection";
import { MainContentSection } from "./sections/MainContentSection";
import { NavigationSection } from "./sections/NavigationSection";

export const AboutUs = (): JSX.Element => {
  return (
    <main className="flex flex-col w-full bg-white border border-border">
      <header className="w-full border-b">
        <NavigationSection />
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
