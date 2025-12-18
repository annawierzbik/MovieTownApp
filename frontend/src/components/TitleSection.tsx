import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const TitleSection = () => {
  const authContext = useContext(AuthContext);
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
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="laser-vertical"
          style={{
            left: `${i * 5}%`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <h2 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-widest neon">
          MovieTown
        </h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-pink-200"
        >
          The ultimate movie experience with neon vibes and cozy seats!
        </motion.p>

        <motion.button
          onClick={handleBookNow}
          whileHover={{
            scale: 1.1,
            boxShadow: "0px 0px 20px #ff69b4",
          }}
          whileTap={{ scale: 0.95 }}
          className="neon-btn px-10 py-4"
        >
          Book Now
        </motion.button>
      </motion.div>
    </section>
  );
};
