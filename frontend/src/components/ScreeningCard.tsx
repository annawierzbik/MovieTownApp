import React from "react";
import { Film, Trash2, Loader2 } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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

interface ScreeningCardProps {
  screening: Screening;
  onDelete: (id: number) => void;
  isDeleting: boolean;
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

export const ScreeningCard: React.FC<ScreeningCardProps> = ({
  screening,
  onDelete,
  isDeleting,
}) => {
  const authContext = useContext(AuthContext) as AuthContextType;
  const { role } = authContext;

  return (
    <div className="flex flex-col md:flex-col lg:flex-row rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 w-full min-w-[280px] max-w-[360px] mx-auto transition hover:scale-105 hover:shadow-pink-500/50">
      <div className="flex-shrink-0 w-full md:w-40 h-72 bg-pink-500/20 rounded-2xl flex items-center justify-center">
        <Film className="w-24 h-24 text-pink-400" />
      </div>

      <div className="flex-1 flex flex-col justify-between ml-0 md:ml-6 mt-6 md:mt-0">
        <div className="space-y-3 text-white">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {screening.movieTitle}
          </h2>
          <p className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
            {new Date(screening.startTime).toLocaleString()}
          </p>
          <p className="flex items-center gap-2 text-gray-300 text-sm md:text-base">
            Cinema: {screening.cinema.name} ({screening.cinema.rows}x
            {screening.cinema.seatsPerRow})
          </p>
        </div>

        {role === "Admin" && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => onDelete(screening.id)}
              disabled={isDeleting}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm md:text-base transition ${
                isDeleting
                  ? "bg-red-900 opacity-60 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
