import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { Footer } from "../components/Footer";
import {
  Mail,
  Lock,
  LogIn,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("Login must be used within an AuthProvider");
  const { setToken } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);

        const errorMessage =
          res.status === 401 || res.status === 404
            ? "Invalid email or password. Access denied."
            : errorData?.message ||
              "Something went wrong during login. Please try again.";

        setMessage({ text: errorMessage, isError: true });
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      setToken(data.token, data.fullName, data.role);
      setMessage({ text: "Welcome back!", isError: false });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMessage({ text: "Server connection failed.", isError: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
      <Navbar />

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <LaserBackground />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="flex items-center gap-5 mb-8 ml-2">
            <div className="p-4 rounded-[22px] bg-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.4)] shrink-0">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.3em] leading-none mb-1">
                Welcome
              </span>
              <h1 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                Sign <span className="text-zinc-500">In</span>
              </h1>
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[45px] p-10 shadow-2xl">
            <header className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                <ShieldCheck className="w-3 h-3 text-pink-500" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  Encrypted Connection
                </span>
              </div>
              <h2 className="text-4xl font-black tracking-tighter">
                Welcome, <span className="text-pink-500">User</span>
              </h2>
            </header>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-pink-500 tracking-widest ml-2">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-pink-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-pink-500 tracking-widest ml-2">
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
                    className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all placeholder:text-zinc-700 font-medium"
                  />
                </div>
              </div>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-xs font-bold border ${
                      message.isError
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-pink-500/10 border-pink-500/20 text-pink-400"
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                type="submit"
                className="w-full py-4 rounded-2xl bg-pink-500 text-white font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_30px_-5px_rgba(236,72,153,0.4)] hover:bg-pink-400 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>

            <footer className="mt-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                New member?
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-pink-500 ml-2 hover:text-white transition-colors underline decoration-pink-500/30 underline-offset-4"
                >
                  Register
                </button>
              </p>
            </footer>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};
