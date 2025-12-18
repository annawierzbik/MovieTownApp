import React from "react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { PricingSection } from "../components/PricingSection";
import { MoviesSection } from "../components/MoviesSection";
import { TitleSection } from "../components/TitleSection";

export const LandingPage = () => {
  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 text-pink-500 font-sans overflow-x-hidden">
      <Navbar />

      <TitleSection />

      <MoviesSection />

      <PricingSection />

      <Footer />
    </div>
  );
};
