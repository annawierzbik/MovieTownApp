import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  LogOut,
  Users,
  Film,
  CalendarDays,
  Ticket,
  User,
} from "lucide-react";

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

export const Navbar = () => {
  const authContext = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const { token, setToken, fullName, role } = authContext;

  const isAdmin = token && role === "Admin";
  const displayUserName = fullName || "User";

  const handleLogout = () => {
    setToken(null, null, null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur border-b border-pink-600 text-white">
      <div className="w-full mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-3xl font-extrabold tracking-widest neon-outline hover:scale-105 transition-transform"
        >
          <Film className="w-7 h-7 text-pink-500" />
          MovieTown
        </button>

        <div className="flex gap-5">
          {token && (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => navigate("/screenings")}
                className="nav-link flex items-center gap-1"
              >
                <CalendarDays className="w-4 h-4" />
                Screenings
              </button>

              <button
                onClick={() => navigate("/reservations")}
                className="nav-link flex items-center gap-1"
              >
                <Ticket className="w-4 h-4" />
                My Reservations
              </button>

              <button
                onClick={() => navigate("/profile")}
                className="nav-link flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Profile
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate("/users")}
                  className="nav-link flex items-center gap-1"
                >
                  <Users className="w-4 h-4" />
                  Users
                </button>
              )}
            </div>
          )}

          {token ? (
            <>
              <button onClick={handleLogout} className="nav-btn">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="nav-btn">
                <LogIn className="w-4 h-4" />
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="nav-btn-outline"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
