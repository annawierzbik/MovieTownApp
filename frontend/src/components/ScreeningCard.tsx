import React from "react";
import {
  Film,
  Trash2,
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  ChevronRight,
  Star,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Cinema {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
}

interface Movie {
  id: number;
  title: string;
  posterImg: string;
  rating: string;
  genre: string;
}

interface Screening {
  id: number;
  movie: Movie;
  startTime: string;
  cinema: Cinema;
}

interface ScreeningCardProps {
  screening: Screening;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export const ScreeningCard: React.FC<ScreeningCardProps> = ({
  screening,
  onDelete,
  isDeleting,
}) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext) as any;
  const { role } = authContext;
  const date = new Date(screening.startTime);

  const handleBooking = () => {
    navigate(`/screenings/${screening.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="group relative flex flex-col rounded-[35px] bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-5 w-full max-w-[340px] mx-auto transition-all duration-500 hover:border-pink-500/50 shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 rounded-[35px] bg-gradient-to-tr from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="relative w-full h-48 bg-black/40 rounded-[24px] flex items-center justify-center border border-white/5 mb-6 overflow-hidden shadow-inner">
        {screening.movie.posterImg ? (
          <img
            src={screening.movie.posterImg}
            alt={screening.movie.title}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
          />
        ) : (
          <Film className="w-14 h-14 text-pink-500/30 group-hover:text-pink-500 transition-all duration-500" />
        )}

        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1">
          <Star className="w-3 h-3 text-pink-500 fill-pink-500" />
          <span className="text-[10px] font-black text-white">
            {screening.movie.rating}
          </span>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
      </div>

      <div className="space-y-1 mb-4 h-16">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase italic group-hover:text-pink-100 transition-colors line-clamp-2 leading-none">
          {screening.movie.title}
        </h2>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-pink-500 rounded-full group-hover:w-20 transition-all duration-500" />
          <span className="text-[9px] font-bold text-pink-500/80 uppercase tracking-widest">
            {screening.movie.genre.split(" • ")[0]}
          </span>
        </div>
      </div>

      <div className="space-y-3 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-zinc-300 uppercase">
              {date.toLocaleDateString("pl-PL", {
                day: "2-digit",
                month: "short",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">
            <Clock className="w-3 h-3 text-pink-500" />
            <span className="text-[11px] font-black text-white">
              {date.toLocaleTimeString("pl-PL", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <div className="h-[1px] flex-1 bg-zinc-800 border-t border-dashed border-zinc-700/50" />
          <Ticket className="w-3 h-3 text-zinc-700" />
          <div className="h-[1px] flex-1 bg-zinc-800 border-t border-dashed border-zinc-700/50" />
        </div>

        <div className="flex items-center gap-3 text-zinc-500">
          <MapPin className="w-4 h-4 text-pink-500/50" />
          <span className="text-[11px] font-medium tracking-tight">
            {screening.cinema.name} •{" "}
            <span className="text-zinc-400">
              {screening.cinema.rows * screening.cinema.seatsPerRow} Seats
            </span>
          </span>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <motion.button
          onClick={handleBooking}
          whileHover={{ x: 5, color: "#ec4899" }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-all outline-none"
        >
          <Ticket className="w-4 h-4" />
          Book Now
          <ChevronRight className="w-3 h-3" />
        </motion.button>

        {role === "Admin" && (
          <button
            onClick={() => onDelete(screening.id)}
            disabled={isDeleting}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              isDeleting
                ? "bg-red-500/20 text-red-500"
                : "bg-zinc-800/50 text-zinc-500 hover:bg-red-600 hover:text-white shadow-xl hover:shadow-red-600/40"
            }`}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-px bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,1)] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};
