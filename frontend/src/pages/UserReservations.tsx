import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Loader2,
  QrCode,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";

export const UserReservations = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { token } = useContext(AuthContext) as any;
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [idToCancel, setIdToCancel] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchReservations();
  }, [token]);

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_URL}/api/reservation/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Failed to fetch protocols.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!idToCancel) return;
    setIsDeleting(true);
    setCancelError(null);

    try {
      const res = await fetch(`${API_URL}/api/reservation/${idToCancel}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== idToCancel));
        setIdToCancel(null);
      } else if (res.status === 404) {
        setCancelError(
          "This screening no longer exists in the system. Your reservation has been canceled.",
        );
        setTimeout(() => {
          fetchReservations();
          setIdToCancel(null);
          setCancelError(null);
        }, 2000);
      } else {
        setCancelError("Protocol termination failed. Please try again.");
      }
    } catch (err) {
      setCancelError("Network error. Could not reach the server.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-pink-500/30 font-sans">
      <Navbar />
      <LaserBackground />
      <div className="min-h-screen">
        <AnimatePresence>
          {idToCancel && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !isDeleting && setIdToCancel(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-[40px] p-8 shadow-2xl text-center overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent ${cancelError ? "via-amber-500" : "via-red-500"} to-transparent opacity-50`}
                />

                <div
                  className={`mb-6 inline-flex p-4 rounded-3xl ${cancelError ? "bg-amber-500/10 border-amber-500/20" : "bg-red-500/10 border-red-500/20"} border`}
                >
                  {cancelError ? (
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                  ) : (
                    <Trash2 className="w-8 h-8 text-red-500" />
                  )}
                </div>

                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                  {cancelError ? "System" : "Cancel"}{" "}
                  <span
                    className={cancelError ? "text-amber-500" : "text-red-500"}
                  >
                    {cancelError ? "Update" : "Reservation?"}
                  </span>
                </h2>

                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                  {cancelError ||
                    "This action will permanently cancel your reservation and release the seat."}
                </p>

                {!cancelError ? (
                  <div className="flex gap-4">
                    <button
                      disabled={isDeleting}
                      onClick={() => setIdToCancel(null)}
                      className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-400 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button
                      disabled={isDeleting}
                      onClick={handleCancel}
                      className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Cancel Reservation"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <main className="max-w-[1800px] mx-auto pt-32 px-6 pb-20 relative z-10 mt-10">
          <header className="mb-16 space-y-4 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center md:justify-start gap-3 text-pink-500"
            >
              <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <Ticket className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                User Tickets
              </span>
            </motion.div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
              My <span className="text-pink-500 text-glow">Reservations</span>
            </h1>
          </header>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Fetching Data...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {reservations.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-zinc-900/20 border border-white/5 p-12 rounded-[40px] text-center"
                  >
                    <AlertCircle className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">
                      No active tickets found in your profile.
                    </p>
                  </motion.div>
                ) : (
                  reservations.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -50 }}
                      className="group relative flex flex-col md:flex-row bg-zinc-900/30 border border-white/5 rounded-[35px] overflow-hidden hover:border-pink-500/30 transition-all duration-500"
                    >
                      <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden shrink-0 bg-zinc-800">
                        <img
                          src={ticket.screening.movie.posterImg}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          alt="movie"
                        />
                      </div>

                      <div className="flex-1 p-8 flex flex-col justify-between space-y-6">
                        <div className="space-y-2 text-center md:text-left">
                          <div className="flex items-center justify-center md:justify-start gap-2 text-pink-500 text-[9px] font-black uppercase tracking-widest">
                            <MapPin className="w-3 h-3" />{" "}
                            {ticket.screening.cinema.name}
                          </div>
                          <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-tight group-hover:text-pink-500 transition-colors line-clamp-1">
                            {ticket.screening.movie.title}
                          </h3>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <Calendar className="w-3.5 h-3.5 text-pink-500" />
                            {new Date(
                              ticket.screening.startTime,
                            ).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <Clock className="w-3.5 h-3.5 text-pink-500" />
                            {new Date(
                              ticket.screening.startTime,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="flex items-center gap-2 bg-pink-500/10 text-pink-500 px-3 py-1.5 rounded-xl border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]">
                            ROW {ticket.row} • SEAT {ticket.seat}
                          </div>
                        </div>

                        <button
                          onClick={() => setIdToCancel(ticket.id)}
                          className="flex items-center justify-center md:justify-start gap-2 text-red-600 hover:text-white transition-colors text-[9px] font-black uppercase tracking-[0.2em] w-full md:w-fit"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Reservation
                        </button>
                      </div>

                      <div className="hidden md:block relative w-px border-l border-dashed border-white/10 my-8 mx-2">
                        <div className="absolute -top-10 -left-2.5 w-5 h-5 bg-[#020202] rounded-full" />
                        <div className="absolute -bottom-10 -left-2.5 w-5 h-5 bg-[#020202] rounded-full" />
                      </div>

                      <div className="w-full md:w-40 bg-white/[0.01] flex flex-col items-center justify-center p-8 border-t md:border-t-0 md:border-l border-white/5">
                        <QrCode className="w-16 h-16 text-zinc-800 group-hover:text-pink-500/40 transition-colors duration-500" />
                        <span className="text-[8px] text-zinc-700 font-black mt-4 uppercase tracking-[0.3em]">
                          ID: #{ticket.id.toString().padStart(5, "0")}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
