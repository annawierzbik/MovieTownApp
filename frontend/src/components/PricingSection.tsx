import React from "react";
import { motion } from "framer-motion";
import { Check, Crown, Ticket, Star } from "lucide-react";

export const PricingSection = () => {
  const pricing = [
    {
      type: "Standard",
      price: "10",
      icon: <Ticket className="w-6 h-6" />,
      features: ["Regular Seat", "2D Screening", "Standard Audio"],
      isPopular: false,
    },
    {
      type: "Premium",
      price: "15",
      icon: <Star className="w-6 h-6" />,
      features: ["Premium Seat", "3D Screening", "Dolby Atmos"],
      isPopular: true,
    },
    {
      type: "VIP",
      price: "25",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Recliner Seat",
        "All Screenings",
        "Free Snack & Drink",
        "Priority Entry",
      ],
      isPopular: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-32 bg-[#050505] relative overflow-hidden w-80%"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <h3 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
            Ticket <span className="text-pink-500 text-glow">Pricing</span>
          </h3>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.4em]">
            Choose your cinematic experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative group rounded-[40px] p-8 border transition-all duration-500 ${
                plan.isPopular
                  ? "bg-pink-500/5 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.15)] scale-105 z-10"
                  : "bg-zinc-900/40 border-white/5 hover:border-white/20"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg shadow-pink-500/40">
                  Most Popular
                </div>
              )}

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${
                  plan.isPopular
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/40"
                    : "bg-white/5 text-pink-500"
                }`}
              >
                {plan.icon}
              </div>

              <h4 className="text-2xl font-black uppercase italic text-white mb-2 tracking-tight">
                {plan.type}
              </h4>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black text-white">
                  ${plan.price}
                </span>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  / seat
                </span>
              </div>

              <ul className="space-y-4 mb-10 text-left">
                {plan.features.map((f, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm font-medium text-zinc-400"
                  >
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-pink-500" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
