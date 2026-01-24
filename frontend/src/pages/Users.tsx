import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AdminEditUserForm } from "../components/AdminEditUserForm";
import {
  Users as UsersIcon,
  Edit,
  X,
  Loader2,
  ShieldAlert,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";
import { motion, AnimatePresence } from "framer-motion";

const RoleBadge = ({ role }: { role: string }) => {
  const isAdmin = role === "Admin";
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        isAdmin
          ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          : "bg-pink-500/10 border-pink-500/50 text-pink-500"
      }`}
    >
      {role}
    </span>
  );
};

export const Users = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { token, role } = useContext(AuthContext) as any;
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403) {
        setUsers([]);
        return;
      }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  if (role !== "Admin" && !isLoading) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[35px] border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-12 max-w-md text-center"
        >
          <ShieldAlert className="mx-auto mb-6 text-red-500 w-16 h-16" />
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Access Denied
          </h2>
          <p className="mt-4 text-zinc-500 font-medium">
            You do not have administrative privileges to view this sector.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-[#050505] text-white selection:bg-pink-500/30 mt-10">
      <Navbar />
      <LaserBackground />

      <main className="max-w-7xl mx-auto pt-32 px-6 pb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20">
                <UsersIcon className="w-8 h-8 text-pink-500" />
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
                  Users <span className="text-pink-500">List</span>
                </h1>
                <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">
                  Info & Roles Management
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[40px] border border-white/5 bg-zinc-900/40 backdrop-blur-3xl shadow-2xl overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-pink-500">
              <Loader2 className="w-12 h-12 animate-spin" />
              <span className="font-black uppercase tracking-[0.3em] text-xs">
                Fetching users...
              </span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/[0.03] text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Identity</th>
                    <th className="px-8 py-6 hidden md:table-cell">Contact</th>
                    <th className="px-8 py-6">Roles</th>
                    <th className="px-8 py-6 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u, index) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-black text-pink-500 text-lg shadow-inner">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-lg tracking-tight leading-none mb-1">
                              {u.fullName}
                            </div>
                            <div className="text-zinc-500 text-xs flex items-center gap-1 font-medium italic">
                              <span className="text-pink-500/50 italic">#</span>
                              {u.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6 hidden md:table-cell">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-zinc-300">
                            <Mail className="w-3.5 h-3.5 text-pink-500/50" />
                            {u.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Phone className="w-3.5 h-3.5 text-pink-500/50" />
                            {u.phoneNumber || "No data"}
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-6">
                        <RoleBadge role={u.role} />
                      </td>

                      <td className="px-8 py-6 text-right">
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                            backgroundColor: "rgba(236,72,153,1)",
                          }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedUserId(u.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg border border-white/5 hover:border-pink-500/50"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedUserId !== null && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedUserId(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                className="relative z-10 w-full max-w-lg"
              >
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedUserId(null)}
                  className="absolute top-5 right-5 z-[130] p-3 rounded-3xl bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.4)]"
                >
                  <X className="w-4 h-4 stroke-[3px]" />
                </motion.button>

                <div className="rounded-[45px] overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_0_100px_rgba(236,72,153,0.15)]">
                  <div className="px-10 pt-10 pb-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="w-5 h-5 text-pink-500" />
                      <h3 className="text-2xl font-black uppercase italic text-white tracking-tighter">
                        Update <span className="text-pink-500">User</span>
                      </h3>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium mb-4">
                      Modifying credentials for #{selectedUserId}
                    </p>
                  </div>

                  <div className="p-10">
                    <AdminEditUserForm
                      user={users.find((u) => u.id === selectedUserId)!}
                      token={token!}
                      onUpdate={async (updatedUser) => {
                        setUsers((prev) =>
                          prev.map((u) =>
                            u.id === updatedUser.id ? updatedUser : u,
                          ),
                        );
                        setSelectedUserId(null);
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
