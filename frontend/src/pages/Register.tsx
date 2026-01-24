import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface RegisterResponse {
  message?: string;
}

export const Register = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, phoneNumber }),
      });

      const data: RegisterResponse = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage({
          text: "Account created! Redirecting to login...",
          isError: false,
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({
          text: data.message || `Protocol failed. Status: ${res.status}`,
          isError: true,
        });
      }
    } catch (err) {
      setMessage({
        text: "Network interference detected. Try again.",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
      <Navbar />

      <main className="relative min-h-screen flex items-center justify-center p-6 pt-24">
        <LaserBackground />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="flex items-center gap-5 mb-8 ml-2">
            <div className="p-4 rounded-[22px] bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] shrink-0">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-1">
                New Account
              </span>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                Create <span className="text-zinc-500">Account</span>
              </h1>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[45px] p-10 shadow-2xl">
            <header className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Membership Application
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter">
                Join <span className="text-pink-500">Us</span>
              </h2>
            </header>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-pink-500 tracking-widest ml-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    required
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-pink-500 tracking-widest ml-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="name@sector.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-pink-500 tracking-widest ml-2">
                  Phone Number
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    placeholder="+48 000 000 000"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-pink-500 tracking-widest ml-2">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all placeholder:text-zinc-800"
                  />
                </div>
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-xs font-bold border ${
                      message.isError
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {message.isError ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full py-4 mt-4 rounded-2xl bg-pink-500 text-white font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_30px_-5px_rgba(236,72,153,0.4)] hover:bg-pink-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign up"
                )}
              </motion.button>
            </form>

            <footer className="mt-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                Already a member?
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-pink-500 ml-2 hover:text-white transition-colors underline decoration-pink-500/30 underline-offset-4"
                >
                  Return to Login
                </button>
              </p>
            </footer>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};
