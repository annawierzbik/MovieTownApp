import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Save,
  Loader2,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "./Navbar";
import { LaserBackground } from "./LaserBackgroundHoriztontal";
import { motion, AnimatePresence } from "framer-motion";

export const UpdateMeForm = () => {
  const {
    token,
    role: currentRole,
    setToken,
    fullName: authFullName,
  } = useContext(AuthContext) as any;

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [user, setUser] = useState<any | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Session expired");
        const data = await res.json();
        setUser(data);
        setFullName(data.fullName);
        setPhoneNumber(data.phoneNumber);
      } catch (err: any) {
        setToken(null);
      }
    };
    fetchProfile();
  }, [token, setToken]);

  const handleSubmit = async () => {
    if (!token) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phoneNumber, xmin: user.xmin }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok) {
        setMessage({
          text: "Profile updated successfully! ✨",
          isError: false,
        });
        setToken(token, fullName, currentRole);
        if (data && data.xmin) {
          setUser({ ...user, fullName, phoneNumber, xmin: data.xmin });
        }
      } else {
        if (res.status === 409) {
          setMessage({
            text: "Sync Error: This profile was modified by another terminal. Reloading...",
            isError: true,
          });
          setTimeout(() => window.location.reload(), 2500);
        } else if (res.status === 400) {
          setMessage({
            text: data?.message || "Invalid input data.",
            isError: true,
          });
        } else {
          setMessage({
            text: "System rejection. Update failed.",
            isError: true,
          });
        }
      }
    } catch (err: any) {
      console.error("Update error:", err);
      setMessage({
        text: "Network uplink failed. Check connection.",
        isError: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen  bg-[#050505] text-white">
      <Navbar />
      <LaserBackground />

      <main className="max-w-4xl mx-auto pt-32 px-6 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-10"
        >
          <div className="flex flex-col md:flex-row items-center gap-8 px-4">
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-[40px] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-4xl md:text-5xl font-black shadow-[0_0_30px_rgba(236,72,153,0.3)] border-2 border-white/20">
                {fullName.charAt(0) || "?"}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 p-2 rounded-2xl border border-white/10 shadow-xl">
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
            </div>
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                My <span className="text-pink-500">Profile</span>
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-[10px] font-black uppercase tracking-widest text-pink-500">
                  {currentRole || "User"} Account
                </span>
                <span className="text-zinc-600 text-xs font-bold uppercase tracking-tighter">
                  Verified Member
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[45px] border border-white/5 bg-zinc-900/40 backdrop-blur-3xl shadow-2xl p-8 md:p-12 ">
            {!user ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-pink-500">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="font-black uppercase tracking-widest text-xs">
                  Fetching data...
                </span>
              </div>
            ) : (
              <div className="space-y-8">
                <AnimatePresence mode="wait">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 rounded-2xl text-sm font-bold border text-center ${
                        message.isError
                          ? "bg-red-500/10 border-red-500/20 text-red-400"
                          : "bg-pink-500/10 border-pink-500/20 text-pink-400"
                      }`}
                    >
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] ml-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input
                      className="w-full p-4 rounded-2xl bg-white/[0.03] text-white border border-white/10 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all font-medium"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] ml-2">
                      <Phone className="w-3 h-3" /> Phone Number
                    </label>
                    <input
                      className="w-full p-4 rounded-2xl bg-white/[0.03] text-white border border-white/10 focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all font-medium"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number..."
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3 opacity-60">
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-2">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <div className="w-full p-4 rounded-2xl bg-black/40 text-zinc-400 border border-white/5 italic flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-zinc-700" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-center md:justify-end">
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 25px rgba(236,72,153,0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-lg ${
                      isSaving
                        ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                        : "bg-pink-500 text-white shadow-pink-500/20"
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> Save Profile
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};
