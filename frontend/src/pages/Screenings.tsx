import React, { useEffect, useState, useContext } from "react";
import { Film, Trash2, Loader2, Plus, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { CreateScreeningForm } from "../components/CreateScreeningForm";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { ScreeningCard } from "../components/ScreeningCard";

interface Cinema {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
}

interface Screening {
  id: number;
  movieTitle: string;
  startTime: string;
  cinema: Cinema;
}

interface AuthContextType {
  token: string | null;
  setToken: (
    token: string | null,
    fullName?: string | null,
    role?: string | null
  ) => void;
  fullName: string | null;
  role: string | null;
}

export const Screenings: React.FC = () => {
  const authContext = useContext(AuthContext) as AuthContextType;
  const { token, setToken, fullName, role } = authContext;

  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const fetchScreenings = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5081/api/screening", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch screenings");
      const data = await res.json();
      setScreenings(data);
    } catch (err: any) {
      console.error(err);
      setMessage({ text: String(err), isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScreenings();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this screening?"))
      return;

    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:5081/api/screening/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setScreenings((prev) => prev.filter((s) => s.id !== id));
      setMessage({ text: "Screening deleted successfully", isError: false });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: String(err), isError: true });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Navbar />
      <LaserBackground />
      <div className="max-w-8xl mx-auto p-32">
        <div className="flex items-center gap-10 p-14">
          <div className="flex items-center gap-4 ">
            <div className="p-3 rounded-xl bg-pink-600/20">
              <Film className="w-7 h-7 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Screenings</h1>
          </div>
          {token && role === "Admin" && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Plus className="w-5 h-5" /> Create
            </button>
          )}
        </div>

        {message && (
          <div
            className={`relative p-4 rounded-2xl flex items-center justify-between space-x-4 shadow-lg mb-5 max-w-2xl ml-14 ${
              message.isError
                ? "bg-red-900 border-l-4 border-red-500 text-red-300"
                : "bg-green-900 border-l-4 border-green-500 text-green-300"
            }`}
          >
            <div>
              {message.isError ? (
                <span className="font-bold">Error:</span>
              ) : (
                <span className="font-bold">Success:</span>
              )}{" "}
              {message.text}
            </div>

            <button
              onClick={() => setMessage(null)}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          </div>
        ) : screenings.length === 0 ? (
          <p className="text-gray-400 text-center">No screenings available</p>
        ) : (
          <div className="grid grid-cols-3 gap-5 mt-6">
            {screenings.map((s) => (
              <ScreeningCard
                key={s.id}
                screening={s}
                onDelete={handleDelete}
                isDeleting={deletingId === s.id}
              />
            ))}
          </div>
        )}

        {isCreateOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setIsCreateOpen(false)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <h3 className="text-xl font-bold text-pink-400">
                    Create screening
                  </h3>
                  <button
                    onClick={() => setIsCreateOpen(false)}
                    className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <CreateScreeningForm
                    onCreated={async () => {
                      await fetchScreenings();
                      setIsCreateOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
