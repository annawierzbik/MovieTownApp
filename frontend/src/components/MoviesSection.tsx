import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Play, Star, Info, ChevronRight, Loader2 } from "lucide-react";

export const MoviesSection = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) as any;
  const token = authContext?.token;

  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_URL}/api/movie`);
        if (res.ok) {
          const data = await res.json();
          setMovies(data.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBookingAction = () => {
    if (token) {
      navigate("/screenings");
    } else {
      navigate("/login");
    }
  };

  return (
    <section
      id="movies"
      className="py-24 bg-[#050505] relative overflow-hidden"
    >
      <div className="max-w-[1800px] mx-auto mb-16 px-8 md:px-16 flex items-end justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-[2px] bg-pink-500" />
            <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Premiere List
            </span>
          </div>
          <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-white">
            Now <span className="text-pink-500">Showing</span>
          </h3>
        </div>

        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">
            View All Movies
          </span>
          <div className="p-2 rounded-full border border-zinc-800 group-hover:border-pink-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      <div className="max-w-[1800px] mx-auto px-8 md:px-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {movies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative cursor-pointer"
                onClick={handleBookingAction}
              >
                <div className="relative aspect-[2/3] rounded-[40px] overflow-hidden border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:border-pink-500/40 group-hover:shadow-[0_20px_50px_-15px_rgba(236,72,153,0.3)]">
                  <img
                    src={movie.posterImg} // Zmieniono z .img na .posterImg (zgodnie z Twoim modelem C#)
                    alt={movie.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:rotate-1 opacity-80 group-hover:opacity-100"
                  />

                  {/* Rating - jeśli masz go w bazie, użyj movie.rating, jeśli nie, zostaw statyczny lub usuń */}
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5 shadow-2xl">
                    <Star className="w-3 h-3 text-pink-500 fill-pink-500" />
                    <span className="text-[10px] font-black text-white">
                      4.9
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <div className="flex flex-col gap-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingAction();
                        }}
                        className="w-full py-4 bg-pink-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-pink-400 transition-colors shadow-lg shadow-pink-500/20"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        {token ? "Book Ticket" : "Sign In to Book"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/movies/${movie.id}`);
                        }}
                        className="w-full py-4 bg-white/10 backdrop-blur-xl rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
                      >
                        <Info className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-pink-500 transition-colors leading-none truncate">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {movie.genre} • {movie.duration} min
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
