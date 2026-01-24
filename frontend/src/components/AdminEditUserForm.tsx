import React, { useState } from "react";
import { Save, Loader2, User, Phone, Shield, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  xmin: number;
}

interface AdminEditUserFormProps {
  user: User;
  token: string;
  onUpdate: (updatedUser: User) => void | Promise<void>;
}

export const AdminEditUserForm: React.FC<AdminEditUserFormProps> = ({
  user,
  token,
  onUpdate,
}) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [role, setRole] = useState(user.role);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = async () => {
    if (!token) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phoneNumber, role, xmin: user.xmin }),
      });

      const contentType = res.headers.get("content-type");
      let data = null;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (res.ok) {
        onUpdate({ ...user, fullName, phoneNumber, role });
        setMessage({ text: "Personnel file updated! ✨", isError: false });
      } else {
        if (res.status === 409) {
          setMessage({
            text: "Sync Error: This profile was modified by another session. Reloading...",
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

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl text-xs font-black uppercase tracking-widest text-center border ${
              message.isError
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-pink-500/10 border-pink-500/20 text-pink-400"
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-5">
        <div className="space-y-2 opacity-60">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] ml-1">
            <Mail className="w-3 h-3" /> System ID & Email
          </label>
          <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-zinc-400 text-sm italic">
            {user.email}{" "}
            <span className="ml-2 text-zinc-600 text-[10px]">#{user.id}</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] ml-1">
            <User className="w-3 h-3" /> Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isSaving}
            className="w-full p-4 rounded-2xl bg-zinc-900/50 text-white border border-white/10 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] ml-1">
            <Phone className="w-3 h-3" /> Phone Number
          </label>
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={isSaving}
            placeholder="No phone registered"
            className="w-full p-4 rounded-2xl bg-zinc-900/50 text-white border border-white/10 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-zinc-700"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase text-pink-500 tracking-[0.2em] ml-1">
            <Shield className="w-3 h-3" /> Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isSaving}
            className="w-full p-4 rounded-2xl bg-zinc-900/50 text-white border border-white/10 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="User" className="bg-zinc-950">
              Standard User
            </option>
            <option value="Admin" className="bg-zinc-950 text-amber-500">
              Administrator
            </option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all ${
            isSaving
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              : "bg-pink-500 text-white shadow-[0_10px_30px_-10px_rgba(236,72,153,0.5)] hover:bg-pink-400"
          }`}
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" /> Update User
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};
