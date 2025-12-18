import React, { useEffect, useState, useContext } from "react";
import { Save, Loader2, Film } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

interface Cinema {
  id: number;
  name: string;
  rows: number;
  seatsPerRow: number;
}

interface CreateScreeningFormProps {
  onCreated: () => void | Promise<void>;
}

export const CreateScreeningForm: React.FC<CreateScreeningFormProps> = ({
  onCreated,
}) => {
  const { token } = useContext(AuthContext);

  const [movieTitle, setMovieTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [cinemaId, setCinemaId] = useState<number | "">("");
  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5081/api/cinema", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setCinemas)
      .catch(() =>
        setMessage({ text: "Failed to load cinemas", isError: true })
      );
  }, [token]);

  const handleSubmit = async () => {
    if (!token || !cinemaId) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5081/api/screening", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieTitle,
          startTime: new Date(startTime).toISOString(),
          cinemaId,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Creation failed");
      }

      setMovieTitle("");
      setStartTime("");
      setCinemaId("");

      await onCreated();
      setMessage({ text: "Screening created successfully!", isError: false });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: String(err), isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-white flex items-center gap-2">
        <Film className="w-5 h-5" /> Create Screening
      </h3>

      {message && (
        <div
          className={`p-3 rounded font-semibold text-center ${
            message.isError
              ? "bg-red-900 border-l-4 border-red-500 text-red-300"
              : "bg-green-900 border-l-4 border-green-500 text-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm text-gray-400">Movie Title</label>
        <input
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          disabled={isSaving}
          className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          disabled={isSaving}
          className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Cinema</label>
        <select
          value={cinemaId}
          onChange={(e) => setCinemaId(Number(e.target.value))}
          disabled={isSaving}
          className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
        >
          <option value="">Select cinema</option>
          {cinemas.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.rows}x{c.seatsPerRow})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition ${
            isSaving
              ? "bg-pink-700 opacity-70 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-500/30"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Creating...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Create
            </>
          )}
        </button>
      </div>
    </div>
  );
};
