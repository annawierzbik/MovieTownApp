import React, { useEffect, useState, useContext } from "react";
import {
  Save,
  Loader2,
  Film,
  Calendar,
  MapPin,
  Clapperboard,
  ChevronDown,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface Cinema {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
}

interface CreateScreeningFormProps {
  onCreated: () => void | Promise<void>;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const CreateScreeningForm: React.FC<CreateScreeningFormProps> = ({
  onCreated,
}) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { token } = useContext(AuthContext);

  const [movieId, setMovieId] = useState<number | "">("");
  const [startTime, setStartTime] = useState("");
  const [cinemaId, setCinemaId] = useState<number | "">("");

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/cinema`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCinemas)
      .catch(() =>
        setMessage({ text: "Failed to load cinemas", isError: true }),
      );

    fetch(`${API_URL}/api/movie`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMovies)
      .catch(() =>
        setMessage({ text: "Failed to load movies", isError: true }),
      );
  }, [token]);

  const handleSubmit = async () => {
    if (!token || !cinemaId || !movieId || !startTime) {
      setMessage({ text: "All fields are required! ✨", isError: true });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/screening`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: Number(movieId),
          startTime: new Date(startTime).toISOString(),
          cinemaId: Number(cinemaId),
        }),
      });

      if (!res.ok) throw new Error();

      setMovieId("");
      setStartTime("");
      setCinemaId("");

      await onCreated();
      setMessage({ text: "Success! Screening is live. 🎬", isError: false });
    } catch (err) {
      setMessage({
        text: "Protocol failure. Check system logs.",
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg h-auto rounded-[45px] border border-pink-500/20 bg-zinc-950/90 backdrop-blur-xl shadow-[0_0_100px_-20px_rgba(236,72,153,0.15)] p-8 md:p-12"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-600/10 blur-[80px] pointer-events-none" />

        <motion.div
          variants={itemVariants}
          className="text-center space-y-4 mb-10"
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              filter: [
                "drop-shadow(0 0 5px #ec4899)",
                "drop-shadow(0 0 15px #ec4899)",
                "drop-shadow(0 0 5px #ec4899)",
              ],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-flex p-4 rounded-3xl bg-pink-500/10 text-pink-500 mb-2"
          >
            <Clapperboard className="w-8 h-8" />
          </motion.div>

          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Schedule <span className="text-pink-500">Session</span>
          </h3>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">
            Register a new screening in the database
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 p-4 rounded-2xl text-xs font-bold text-center border ${
                message.isError
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-pink-500/10 text-pink-400 border-pink-500/20"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[10px] font-black uppercase text-pink-500/60 tracking-[0.3em] ml-4">
              <Film className="inline w-3 h-3 mr-1 mb-1" /> Movie
            </label>
            <div className="relative group">
              <select
                value={movieId}
                onChange={(e) =>
                  setMovieId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full p-4 rounded-2xl bg-white/[0.03] text-white border border-white/10 focus:border-pink-500/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-zinc-950">
                  Select Movie...
                </option>
                {movies.map((m) => (
                  <option key={m.id} value={m.id} className="bg-zinc-950">
                    {m.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
            </div>
          </motion.div>

          {/* TIME INPUT */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[10px] font-black uppercase text-pink-500/60 tracking-[0.3em] ml-4">
              <Calendar className="inline w-3 h-3 mr-1 mb-1" /> Start Protocol
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/[0.03] text-white border border-white/10 focus:border-pink-500/50 outline-none transition-all [color-scheme:dark]"
            />
          </motion.div>

          {/* CINEMA SELECT */}
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-[10px] font-black uppercase text-pink-500/60 tracking-[0.3em] ml-4">
              <MapPin className="inline w-3 h-3 mr-1 mb-1" /> Sector Location
            </label>
            <div className="relative group">
              <select
                value={cinemaId}
                onChange={(e) =>
                  setCinemaId(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="w-full p-4 rounded-2xl bg-white/[0.03] text-white border border-white/10 focus:border-pink-500/50 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-zinc-950">
                  Select theater...
                </option>
                {cinemas.map((c) => (
                  <option key={c.id} value={c.id} className="bg-zinc-950">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pt-10">
          <motion.button
            whileHover={
              !isSaving
                ? { scale: 1.02, boxShadow: "0 0 25px rgba(236, 72, 153, 0.4)" }
                : {}
            }
            whileTap={!isSaving ? { scale: 0.98 } : {}}
            onClick={handleSubmit}
            disabled={isSaving}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${
              isSaving
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-pink-500 text-white shadow-[0_20px_40px_-15px_rgba(236,72,153,0.5)]"
            }`}
          >
            {isSaving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" /> Deploy Screening
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
