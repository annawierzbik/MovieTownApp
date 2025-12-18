import React from "react";
import { motion } from "framer-motion";

export const PricingSection = () => {
  const pricing = [
    {
      type: "Standard",
      price: "$10",
      features: ["Regular Seat", "2D Screening"],
    },
    {
      type: "Premium",
      price: "$15",
      features: ["Premium Seat", "3D Screening"],
    },
    {
      type: "VIP",
      price: "$25",
      features: ["Recliner Seat", "All Screenings", "Free Snack"],
    },
  ];

  return (
    <section id="pricing" className="py-20 px-6 rounded-t-3xl">
      <h3 className="text-4xl font-bold mb-12 text-center">Ticket Pricing</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {pricing.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="bg-black border border-pink-500 rounded-lg p-6 text-center hover:scale-105 transition-transform"
          >
            <h4 className="text-2xl font-bold mb-4">{plan.type}</h4>
            <p className="text-3xl font-extrabold mb-4">{plan.price}</p>
            <ul className="mb-4">
              {plan.features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
