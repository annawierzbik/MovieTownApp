import React, { useEffect, useState, useContext } from "react";
import {
  Film,
  Trash2,
  Loader2,
  Plus,
  X,
  Ticket,
  Activity,
  AlertTriangle,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CreateScreeningForm } from "../components/CreateScreeningForm";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { ScreeningCard } from "../components/ScreeningCard";
import { motion, AnimatePresence } from "framer-motion";

export const Screenings: React.FC = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const authContext = useContext(AuthContext) as any;
  const { token, role } = authContext;

  const [screenings, setScreenings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [idToDelete, setIdToDelete] = useState<number | null>(null); // Stan dla modala potwierdzenia
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // 1. Synchronizacja blokady scrolla tła
  useEffect(() => {
    if (idToDelete !== null || isCreateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [idToDelete, isCreateOpen]);

  const fetchScreenings = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/screening`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch screenings");
      const data = await res.json();
      setScreenings(data);
    } catch (err: any) {
      setMessage({
        text: "Backend connection failed. Is the server live?",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, [token]);

  // 2. Logika właściwego usuwania po potwierdzeniu w modalu
  const handleDelete = async () => {
    if (!token || idToDelete === null) return;
    const id = idToDelete;
    setDeletingId(id);

    try {
      const res = await fetch(`${API_URL}/api/screening/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      setScreenings((prev) => prev.filter((s) => s.id !== id));
      setMessage({ text: "Screening successfully removed", isError: false });
      setIdToDelete(null); // Zamknij modal po sukcesie
    } catch (err: any) {
      setMessage({ text: "Error during deletion", isError: true });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/40 font-sans mt-20">
      <Navbar />
      <LaserBackground />

      <main className="max-w-[1800px] mx-auto px-6 pt-32 pb-20 relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]"
              >
                <Film className="w-8 h-8 text-pink-500" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                  Screenings
                </h1>
                <div className="flex items-center gap-2 mt-2 text-zinc-500 font-bold text-xs uppercase tracking-[0.2em]">
                  <Activity className="w-3 h-3 text-green-500" />
                  <span>{screenings.length} Upcoming Screenings</span>
                </div>
              </div>
            </div>
          </div>

          {token && role === "Admin" && (
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 30px rgba(236, 72, 153, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateOpen(true)}
              className="group flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest bg-pink-500 text-white shadow-lg transition-all"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Screening</span>
            </motion.button>
          )}
        </div>

        {/* MESSAGES */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="px-4 mb-10"
            >
              <div
                className={`flex items-center justify-between p-5 rounded-3xl border-2 backdrop-blur-md ${message.isError ? "bg-red-500/5 border-red-500/30 text-red-400" : "bg-pink-500/5 border-pink-500/30 text-pink-400"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${message.isError ? "bg-red-500" : "bg-pink-500"}`}
                  />
                  <span className="font-bold tracking-tight">
                    {message.text}
                  </span>
                </div>
                <button
                  onClick={() => setMessage(null)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <Loader2 className="w-16 h-16 animate-spin text-pink-500" />
              <div className="absolute inset-0 blur-2xl bg-pink-500/20" />
            </div>
            <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-sm animate-pulse">
              Synchronizing Data
            </p>
          </div>
        ) : screenings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 border-2 border-dashed border-zinc-900 rounded-[50px] bg-zinc-900/10"
          >
            <Ticket className="w-20 h-20 text-zinc-600 mx-auto mb-6" />
            <p className="text-zinc-600 font-bold text-2xl tracking-tight italic">
              No upcoming screenings.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 px-4"
          >
            {screenings.map((s) => (
              <motion.div
                key={s.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
              >
                <ScreeningCard
                  screening={s}
                  onDelete={(id) => setIdToDelete(id)} // Otwiera modal zamiast usuwać od razu
                  isDeleting={deletingId === s.id}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* MODAL: CREATE SCREENING */}
        <AnimatePresence>
          {isCreateOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCreateOpen(false)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative z-10 "
              >
                <motion.button
                  whileHover={{
                    scale: 1.1,
                    rotate: 90,
                    backgroundColor: "#ef4444",
                  }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsCreateOpen(false)}
                  className="absolute top-5 right-5 z-[130] p-3 rounded-3xl bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.4)] transition-all"
                >
                  <X className="w-4 h-4 stroke-[3px]" />
                </motion.button>
                <CreateScreeningForm
                  onCreated={async () => {
                    await fetchScreenings();
                    setIsCreateOpen(false);
                  }}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL: CONFIRM DELETE */}
        <AnimatePresence>
          {idToDelete !== null && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !deletingId && setIdToDelete(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative z-[210] w-full max-w-md bg-zinc-950 border border-white/10 rounded-[40px] p-8 shadow-2xl text-center"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                <div className="mb-6 inline-flex p-4 rounded-3xl bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
                  Confirm <span className="text-red-500">Deletion</span>
                </h2>

                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8 leading-loose">
                  Are you sure you want to remove this screening? This process
                  cannot be undone.
                </p>

                <div className="flex gap-4">
                  <button
                    disabled={!!deletingId}
                    onClick={() => setIdToDelete(null)}
                    className="flex-1 py-4 rounded-2xl bg-zinc-900 text-zinc-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!!deletingId}
                    onClick={handleDelete}
                    className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 shadow-[0_10px_20px_-5px_rgba(220,38,38,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    {deletingId ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Delete Now"
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
