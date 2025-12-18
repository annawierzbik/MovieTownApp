import React from "react";
import { motion } from "framer-motion";

export const MoviesSection = () => {
  const movies = [
    { title: "Avengers: Endgame", img: "https://via.placeholder.com/300x400" },
    { title: "Inception", img: "https://via.placeholder.com/300x400" },
    { title: "The Batman", img: "https://via.placeholder.com/300x400" },
    {
      title: "Spider-Man: No Way Home",
      img: "https://via.placeholder.com/300x400",
    },
  ];

  return (
    <section id="movies" className="py-20 px-6">
      <h3 className="text-4xl font-bold mb-12 text-center mt-8">Now Showing</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {movies.map((movie, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow hover:scale-105"
          >
            <img
              src={movie.img}
              alt={movie.title}
              className="w-full h-80 object-cover"
            />
            <div className="p-4 text-center">
              <h4 className="text-xl font-semibold">{movie.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
