import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";

interface LoginResponse {
  token: string;
  fullName: string;
  role: string;
  message?: string;
}

export const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("Login must be used within an AuthProvider");
  }

  const { setToken } = authContext;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data: LoginResponse | { message: string } = {
        message: "Server error.",
      } as LoginResponse;

      try {
        data = await res.json();
      } catch (e) {
        data = {
          message:
            res.statusText ||
            `Exception caught. Server Response: ${res.status}`,
        };
      }

      if (res.ok) {
        const loginData = data as LoginResponse;

        setToken(loginData.token, loginData.fullName, loginData.role);

        setMessage("Login successful!");
        setIsError(false);

        navigate("/");
      } else {
        if (res.status === 401) {
          setMessage(
            "Invalid credentials. Please check your email and password."
          );
          setIsError(true);
        } else {
          const errorData = data as { message?: string };
          setMessage(
            errorData.message || `Error occured. Status: ${res.status}`
          );
          setIsError(true);
        }
      }
    } catch (networkError) {
      setMessage("Network error. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="bg-black text-pink-500 font-sans overflow-x-hidden">
      <Navbar />
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <LaserBackground />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card w-full max-w-md p-8 relative z-10"
        >
          <h2 className="text-4xl font-extrabold text-center mb-8 neon-text">
            Login
          </h2>

          <form onSubmit={handleLogin}>
            <input
              className="neon-input w-full mb-4"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />

            <input
              className="neon-input w-full mb-6"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />

            {message && (
              <div
                className={`p-3 mb-4 text-center font-bold 
                            ${isError ? "text-red-500 " : "text-green-300"}`}
              >
                {message}
              </div>
            )}

            <button type="submit" className="neon-btn w-full py-3">
              Sign In
            </button>
            <p className="text-center mt-6 text-sm text-pink-300">
              Don't have an account yet?
              <a
                onClick={() => navigate("/register")}
                className="text-pink-500 font-bold ml-1 cursor-pointer hover:underline neon-link"
              >
                Register here
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
