import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  LogOut,
  Users,
  Film,
  CalendarDays,
  Ticket,
  User as UserIcon,
  Sparkles,
  Home,
  Clapperboard,
} from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const { token, setToken, fullName, role } = useContext(AuthContext) as any;
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = token && role === "Admin";
  const handleLogout = () => {
    setToken(null, null, null);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ path, icon: Icon, label }: any) => (
    <button
      onClick={() => navigate(path)}
      className={`relative flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
        isActive(path) ? "text-pink-500" : "text-zinc-400 hover:text-white"
      }`}
    >
      <Icon
        className={`w-4 h-4 ${isActive(path) ? "drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" : ""}`}
      />
      <span className="hidden xl:block">{label}</span>
      {isActive(path) && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-1 left-4 right-4 h-[2px] bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,1)]"
        />
      )}
    </button>
  );

  return (
    <div className="fixed top-0 left-0 w-full z-[100] px-6 py-6">
      <nav className="mx-auto relative group">
        <div className="absolute inset-0 bg-pink-600/5 blur-3xl -z-10 rounded-full" />

        <div className="flex justify-between items-center bg-zinc-950 backdrop-blur-xl rounded-[28px] px-8 py-6 border border-pink-500/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] transition-all group-hover:border-pink-500/40">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3"
          >
            <div className="p-2.5 bg-gradient-to-br from-pink-600 to-pink-400 rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black italic tracking-tighter uppercase text-white hidden sm:block">
              Movie<span className="text-pink-500">Town</span>
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] rounded-2xl px-2 py-1 border border-white/5">
            <NavLink path="/" icon={Home} label="Home" />
            <NavLink path="/movies" icon={Clapperboard} label="Movies" />
            {token && (
              <>
                <NavLink
                  path="/screenings"
                  icon={CalendarDays}
                  label="Screenings"
                />
                <NavLink
                  path="/reservations"
                  icon={Ticket}
                  label="Reservations"
                />
                <NavLink path="/profile" icon={UserIcon} label="Profile" />
                {isAdmin && (
                  <NavLink path="/users" icon={Users} label="Users" />
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end leading-none">
                  <span className="text-[9px] font-black text-pink-500/80 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Sparkles className="w-2 h-2" /> {role}
                  </span>
                  <span className="text-sm font-bold text-white tracking-tight italic">
                    {fullName}
                  </span>
                </div>

                <motion.button
                  whileHover={{
                    backgroundColor: "rgba(236,72,153,1)",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2.5 md:px-5 md:py-2.5 rounded-xl bg-pink-500/10 text-pink-500 text-[10px] font-black uppercase tracking-widest border border-pink-500/20 transition-all shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline text-xs">Log out</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors group"
                >
                  <LogIn className="w-4 h-4 text-zinc-500 group-hover:text-pink-500 transition-colors" />
                  Sign In
                </button>

                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(236,72,153,0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-pink-500 text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-500/20 border border-white/10"
                >
                  <UserPlus className="w-4 h-4" />
                  Join
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};
