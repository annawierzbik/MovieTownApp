import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Play, ChevronRight, Sparkles, Clapperboard } from "lucide-react";

export const TitleSection = () => {
  const authContext = useContext(AuthContext) as any;
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("TitleSection must be used within an AuthProvider");
  }

  const { token } = authContext;

  const handleBookNow = () => {
    if (token) {
      navigate("/screenings");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/5 via-transparent to-transparent opacity-60" />
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="laser-vertical opacity-10"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.15}s`,
              background:
                "linear-gradient(to bottom, transparent, #ec4899, transparent)",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 px-6 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-2xl"
        >
          {token ? (
            <>
              <Sparkles className="w-3.5 h-3.5 mb-0.5" /> Welcome Back
            </>
          ) : (
            <>
              <Clapperboard className="w-3.5 h-3.5 mb-0.5" /> Premium Cinema
              Experience
            </>
          )}
        </motion.div>

        <div className="relative mb-10 flex justify-center items-center">
          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-[120px] font-black italic tracking-tighter uppercase leading-none select-none flex items-center gap-4">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Movie
            </span>
            <span className="text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]">
              Town
            </span>
          </h2>

          <div className="absolute inset-0 bg-pink-500/10 blur-[120px] -z-10 rounded-full" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="text-base md:text-xl mb-12 max-w-2xl mx-auto text-zinc-400 font-medium leading-relaxed tracking-wide px-4"
        >
          Experience cinema like never before. Immerse yourself in
          <span className="text-white font-bold tracking-normal">
            {" "}
            neon aesthetics
          </span>{" "}
          and
          <span className="text-white font-bold tracking-normal text-pink-100">
            {" "}
            ultimate comfort
          </span>
          .
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <motion.button
            onClick={handleBookNow}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 15px 40px -10px rgba(236, 72, 153, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-14 py-5 bg-pink-500 rounded-full text-white font-black uppercase text-xs tracking-[0.3em] flex items-center gap-4 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

            <Play className="w-4 h-4 fill-white" />
            {token ? "Book Ticket" : "Sign In to Book"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <button
            onClick={() => navigate("/movies")}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all"
          >
            Explore Movies
            <div className="h-px w-0 group-hover:w-12 bg-pink-500 transition-all duration-300" />
          </button>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-20" />
    </section>
  );
};
