import React, { useState, useEffect, useContext } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Play, Info, Clapperboard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Movie {
  id: number;
  title: string;
  genre: string;
  rating: string;
  releaseDate: string;
  posterImg: string;
}

export const Movies = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) as any;
  const token = authContext?.token;

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/movie`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleBooking = (movieId: number) => {
    if (token) {
      navigate("/screenings");
    } else {
      navigate("/login");
    }
  };

  const genres = [
    "All",
    "Action",
    "Sci-Fi",
    "Crime",
    "Drama",
    "Adventure",
    "Thriller",
  ];

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGenre =
      selectedGenre === "All" || movie.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <LaserBackground />

      <main className="max-w-[1800px] mx-auto pt-32 px-8 md:px-16 pb-20 relative z-10 min-h-screen mt-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <Clapperboard className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Cinema Catalog
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
              Explore <span className="text-pink-500">Movies</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm outline-none focus:border-pink-500/40 focus:ring-4 focus:ring-pink-500/5 transition-all"
              />
            </div>
          </div>
        </header>

        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap ${
                selectedGenre === genre
                  ? "bg-pink-500 border-pink-500 text-white shadow-[0_10px_20px_-5px_rgba(236,72,153,0.4)]"
                  : "bg-white/5 border-white/10 text-zinc-500 hover:border-white/30 hover:text-white"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
            <p className="text-zinc-500 font-black uppercase tracking-widest animate-pulse">
              Synchronizing Data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredMovies.map((movie) => (
                <motion.div
                  layout
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative"
                >
                  <div className="relative aspect-[2/3] rounded-[40px] overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl transition-all duration-500 group-hover:border-pink-500/40">
                    <img
                      src={movie.posterImg}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      alt={movie.title}
                    />

                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-pink-500 fill-pink-500" />
                      <span className="text-[10px] font-black">
                        {movie.rating}
                      </span>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                      <div className="space-y-3 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                        <button
                          onClick={() => handleBooking(movie.id)}
                          className="w-full py-3.5 bg-pink-500 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-pink-400 transition-all shadow-lg shadow-pink-500/20"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          {token ? "Book a ticket" : "Sign in to book"}
                        </button>

                        <button
                          onClick={() => navigate(`/movies/${movie.id}`)}
                          className="w-full py-3.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-white/20 transition-all"
                        >
                          <Info className="w-4 h-4 text-pink-500" /> View
                          Details
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 px-2">
                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-pink-500 transition-colors leading-none truncate">
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black text-pink-500 uppercase">
                        {movie.genre.split(" • ")[0]}{" "}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">
                        {movie.releaseDate}{" "}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredMovies.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-zinc-600 font-black uppercase tracking-[0.5em]">
              No movies found in this sector
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
