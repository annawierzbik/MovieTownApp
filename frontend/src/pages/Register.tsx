import React, { useState } from "react";
import { motion } from "framer-motion";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { Navbar } from "../components/Navbar";

interface RegisterResponse {
  message?: string;
}

export const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleRegister = async () => {
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5081/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          fullName,
          phoneNumber,
        }),
      });

      let data: RegisterResponse = {};

      try {
        data = await res.json();
      } catch (e) {}

      if (res.ok) {
        setMessage("Registration successful! You can now log in.");
        setIsError(false);

        setEmail("");
        setPassword("");
        setFullName("");
        setPhoneNumber("");
      } else {
        const errorMessage =
          data.message || `Error during registration. Status: ${res.status}`;
        setMessage(errorMessage);
        setIsError(true);
      }
    } catch (networkError) {
      setMessage("Network error. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="bg-black text-pink-500 font-sans overflow-x-hidden">
      <Navbar />
      <main className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <LaserBackground />

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card relative z-10 w-full max-w-md p-8"
        >
          <h1 className="neon-text text-4xl font-extrabold text-center mb-8">
            Register
          </h1>

          <form
            className="space-y-5"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            {message && (
              <div
                className={`p-3 rounded text-center font-bold 
                            ${
                              isError
                                ? "text-red-500 neon-error"
                                : "text-green-300 neon-success"
                            }`}
              >
                {message}
              </div>
            )}

            <input
              className="neon-input w-full"
              placeholder="Full Name"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
            />

            <input
              type="email"
              className="neon-input w-full"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />

            <input
              className="neon-input w-full"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhoneNumber(e.target.value)
              }
            />

            <input
              type="password"
              className="neon-input w-full"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />

            <button type="submit" className="neon-btn w-full py-3">
              Create Account
            </button>
          </form>
        </motion.section>
      </main>
    </div>
  );
};
