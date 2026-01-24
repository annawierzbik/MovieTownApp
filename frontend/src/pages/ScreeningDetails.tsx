import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Armchair,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Clock,
  Calendar,
  MapPin,
  Ticket,
  AlertTriangle,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const ScreeningDetails = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { screeningId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [screening, setScreening] = useState<any>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<
    { row: number; seat: number }[]
  >([]);
  const [selectedSeat, setSelectedSeat] = useState<{
    row: number;
    seat: number;
  } | null>(null);
  const [isReserving, setIsReserving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_URL}/api/screening/${screeningId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setScreening(data);
        fetchOccupied(data.id);
      })
      .catch(() => navigate("/screenings"));
  }, [screeningId, token]);

  const fetchOccupied = (id: number) => {
    fetch(`${API_URL}/api/reservation/screening/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOccupiedSeats);
  };

  const handleReserve = async () => {
    if (!selectedSeat || isReserving) return;
    setIsReserving(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          screeningId: Number(screeningId),
          row: selectedSeat.row,
          seat: selectedSeat.seat,
        }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/screenings"), 2000);
      } else {
        if (res.status === 409 || res.status === 400) {
          setErrorMessage(
            data?.message ||
              "Someone has just booked this seat. Please try again.",
          );
          setSelectedSeat(null);
          fetchOccupied(Number(screeningId));
        } else {
          setErrorMessage("Protocol error. Status: " + res.status);
        }
      }
    } catch (err) {
      setErrorMessage("Connection failed. Check your uplink.");
    } finally {
      setIsReserving(false);
    }
  };

  if (!screening)
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );

  const screeningDate = new Date(screening.startTime);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-pink-500/30">
      <Navbar />
      <div className="min-h-screen">
        <section className="relative h-[25vh] w-full overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={screening.movie.posterImg}
              className="w-full h-full object-cover opacity-20 blur-md"
              alt="Backdrop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1600px] mx-auto h-full px-8 flex flex-col justify-end pb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <Ticket className="w-5 h-5 text-pink-500 " />
              <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Seat Reservation
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
              Reserve Your <span className="text-pink-500">Seat</span>
            </h1>
          </div>
        </section>

        <main className="max-w-[1600px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 relative z-20 mt-4">
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white leading-tight">
                {screening.movie.title}
              </h2>
              <div className="h-1 w-12 bg-pink-500 rounded-full" />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[2/3] rounded-[30px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900"
            >
              <img
                src={screening.movie.posterImg}
                className="w-full h-full object-cover"
                alt="Poster"
              />
            </motion.div>
            <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-5 rounded-3xl space-y-4">
              <div className="flex items-center gap-3 text-zinc-300 font-bold text-[10px] uppercase tracking-widest">
                <Calendar className="w-4 h-4 text-pink-500" />{" "}
                {screeningDate.toLocaleDateString("pl-PL")}
              </div>
              <div className="flex items-center gap-3 text-zinc-300 font-bold text-[10px] uppercase tracking-widest">
                <Clock className="w-4 h-4 text-pink-500" />{" "}
                {screeningDate.toLocaleTimeString("pl-PL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-3 text-zinc-300 font-bold text-[10px] uppercase tracking-widest">
                <MapPin className="w-4 h-4 text-pink-500" />{" "}
                {screening.cinema.name}
              </div>
            </div>
            <button
              onClick={() => navigate("/screenings")}
              className="w-full flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-all text-[12px] font-black uppercase tracking-widest"
            >
              <ChevronLeft className="w-3 h-3" /> Back to Screenings
            </button>
          </div>

          <div className="lg:col-span-9 flex flex-col gap-8">
            <div className="bg-zinc-900/20 backdrop-blur-xl border border-white/5 rounded-[40px] p-6 md:p-8 space-y-8 flex-1 shadow-2xl relative">
              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md bg-red-950 border border-red-500/50 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-4 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
                  >
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <p className="text-[11px] font-black uppercase tracking-widest leading-none">
                      {errorMessage}
                    </p>
                    <button
                      onClick={() => setErrorMessage(null)}
                      className="ml-auto text-red-500/50 hover:text-red-500 text-[10px] font-bold"
                    >
                      CLOSE
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="w-full max-w-2xl mx-auto mb-16 relative">
                <div className="h-1.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full shadow-[0_0_30px_rgba(236,72,153,0.6)]" />
                <p className="text-center text-[9px] font-black uppercase tracking-[0.8em] text-pink-500/40 mt-4 italic">
                  Screen Focus Area
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
                {Array.from({ length: screening.cinema.rows }).map((_, r) => (
                  <div key={r} className="flex gap-3 items-center">
                    <span className="text-[10px] font-black text-zinc-800 w-6 text-center">
                      {r + 1}
                    </span>
                    <div className="flex gap-2">
                      {Array.from({ length: screening.cinema.seatsPerRow }).map(
                        (_, s) => {
                          const isOccupied = occupiedSeats.some(
                            (os) => os.row === r + 1 && os.seat === s + 1,
                          );
                          const isSelected =
                            selectedSeat?.row === r + 1 &&
                            selectedSeat?.seat === s + 1;
                          return (
                            <motion.button
                              key={s}
                              whileHover={
                                !isOccupied ? { scale: 1.2, y: -2 } : {}
                              }
                              whileTap={!isOccupied ? { scale: 0.9 } : {}}
                              onClick={() => {
                                if (isOccupied) return;
                                // LOGIKA TOGGLE: Odznacz jeśli kliknięto ponownie to samo
                                if (
                                  selectedSeat?.row === r + 1 &&
                                  selectedSeat?.seat === s + 1
                                ) {
                                  setSelectedSeat(null);
                                } else {
                                  setSelectedSeat({ row: r + 1, seat: s + 1 });
                                }
                              }}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                                isOccupied
                                  ? "bg-red-500/20 text-red-600 cursor-not-allowed border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                                  : isSelected
                                    ? "bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border-none"
                                    : "bg-white/5 border border-white/10 text-zinc-600 hover:text-pink-500 hover:border-pink-500/30"
                              }`}
                            >
                              <Armchair
                                className={`w-5 h-5 ${isSelected ? "fill-current" : ""}`}
                              />
                            </motion.button>
                          );
                        },
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-10 pt-12 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-white/10 rounded-sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-900 rounded-sm" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Occupied
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-sm shadow-[0_0_8px_#ec4899]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Selected
                  </span>
                </div>
              </div>

              <div className="bg-zinc-900/40 backdrop-blur-xl border rounded-[35px] p-6 transition-colors duration-500 border-white/5">
                <AnimatePresence mode="wait">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-4 py-4 text-green-500"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                      <span className="font-black uppercase italic tracking-widest text-xl">
                        Reservation Synchronized
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
                      <div className="space-y-1">
                        <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[8px]">
                          Current Selection
                        </p>
                        <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">
                          {selectedSeat ? (
                            <>
                              Row {selectedSeat.row}{" "}
                              <span className="text-pink-500">
                                Seat {selectedSeat.seat}
                              </span>
                            </>
                          ) : (
                            <span className="text-zinc-800">
                              No seat chosen
                            </span>
                          )}
                        </h2>
                      </div>
                      <motion.button
                        onClick={handleReserve}
                        disabled={!selectedSeat || isReserving}
                        whileHover={selectedSeat ? { scale: 1.02 } : {}}
                        whileTap={selectedSeat ? { scale: 0.98 } : {}}
                        className={`min-w-[280px] py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                          selectedSeat
                            ? "bg-pink-500 text-white shadow-pink-500/20 hover:bg-pink-400"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                        }`}
                      >
                        {isReserving ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Ticket className="w-4 h-4" /> Book a seat
                          </>
                        )}
                      </motion.button>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
