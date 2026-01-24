import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  Star,
  Clock,
  Calendar,
  ChevronLeft,
  Ticket,
  Info,
  Users,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  description: string;
  genre: string;
  duration: string;
  rating: string;
  releaseDate: string;
  posterImg: string;
  backdropImg: string;
  director: string;
  cast: string;
}

export const MovieDetails = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) as any;
  const token = authContext?.token;

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/movie/${id}`);
        if (!response.ok) throw new Error("Movie not found");
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleBooking = () => {
    navigate(token ? "/screenings" : "/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black italic uppercase">
          Movie not found
        </h1>
        <button
          onClick={() => navigate("/movies")}
          className="text-pink-500 font-bold uppercase tracking-widest text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <Navbar />

      <div className="min-h-screen bg-[#020202]">
        {/* COMPACT HERO SECTION */}
        <section className="relative h-[35vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={movie.backdropImg}
              className="w-full h-full object-cover opacity-30"
              alt="Backdrop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1600px] mx-auto h-full px-8 flex flex-col justify-end pb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-5 mb-2">
                <div className="p-3 rounded-[18px] bg-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.4)] shrink-0">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em] leading-none mb-1">
                    Movie Details
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                {movie.title.split(" ")[0]}{" "}
                <span className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  {movie.title.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                <span className="flex items-center gap-2 bg-pink-500 text-white px-2 py-0.5 rounded-md shadow-lg shadow-pink-500/20 leading-none">
                  <Star className="w-3 h-3 fill-white" /> {movie.rating}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />{" "}
                  {movie.duration}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />{" "}
                  {movie.releaseDate}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="max-w-[1600px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 relative z-20 mt-10">
          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[2/3] rounded-[30px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900"
            >
              <img
                src={movie.posterImg}
                className="w-full h-full object-cover"
                alt="Poster"
              />
            </motion.div>
            <motion.button
              onClick={handleBooking}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 17,
              }}
              className="group relative w-full py-4 bg-pink-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 overflow-hidden shadow-xl shadow-pink-500/20 hover:bg-pink-400"
            >
              <Ticket className="w-4 h-4 relative z-20" />
              <span className="relative z-20">
                {token ? "Book Now" : "Login to Book"}
              </span>
            </motion.button>
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ChevronLeft className="w-3 h-3" /> Return to catalog
            </button>
          </div>

          <div className="lg:col-span-9 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-12 space-y-10 h-fit">
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                <Info className="w-4 h-4" /> Storyline
              </h3>
              <p className="text-lg text-zinc-300 leading-relaxed font-medium max-w-4xl italic">
                "{movie.description}"
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/5">
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  <Users className="w-4 h-4" /> Cast
                </h3>
                <p className="text-sm font-bold text-zinc-300 leading-loose">
                  {movie.cast.split(", ").join(" • ")}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Director
                </h3>
                <p className="text-sm font-black text-white uppercase italic tracking-tighter">
                  {movie.director}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em]">
                  Category
                </h3>
                <p className="text-sm font-bold text-zinc-300 uppercase tracking-widest">
                  {movie.genre}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
