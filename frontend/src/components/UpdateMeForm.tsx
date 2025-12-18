import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Save, Loader2, User, Mail, Phone } from "lucide-react";
import { Navbar } from "./Navbar";

interface UserType {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  xmin: number;
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

export const UpdateMeForm = () => {
  const {
    token,
    role: currentRole,
    setToken,
  } = useContext(AuthContext) as AuthContextType;

  const [user, setUser] = useState<UserType | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [xmin, setXmin] = useState(0);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5081/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile data");

        const data: UserType = await res.json();
        setUser(data);
        setFullName(data.fullName);
        setPhoneNumber(data.phoneNumber);
        setXmin(data.xmin);
      } catch (err: any) {
        setMessage({ text: err.message, isError: true });
        setToken(null);
      }
    };

    fetchProfile();
  }, [token, setToken]);

  const handleSubmit = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5081/api/user/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phoneNumber, xmin }),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      setMessage({ text: data.message || "Profile updated", isError: false });
      setToken(token, fullName, currentRole);
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">You must be logged in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto pt-28 px-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-xl bg-pink-600/20">
            <User className="w-7 h-7 text-pink-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-8">
          {!user ? (
            <div className="flex items-center justify-center gap-3 text-pink-400 py-12">
              <Loader2 className="animate-spin" />
              <span>Loading profile...</span>
            </div>
          ) : (
            <>
              {message && (
                <div
                  className={`mb-6 rounded-xl px-4 py-3 text-sm font-medium border \
                  ${
                    message.isError
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="grid gap-6">
                <div>
                  <label className="text-sm text-gray-300">Full name</label>
                  <input
                    className="mt-1 w-full rounded-xl bg-slate-900/80 border border-white/10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Phone number</label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300">Email</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      disabled
                      value={user.email}
                      className="w-full cursor-not-allowed rounded-xl bg-slate-900/40 border border-white/5 pl-10 pr-4 py-3 text-gray-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold shadow-lg shadow-pink-600/30 hover:bg-pink-500 transition"
                >
                  <Save className="w-5 h-5" />
                  Save changes
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
