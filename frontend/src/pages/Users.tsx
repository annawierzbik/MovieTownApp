import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AdminEditUserForm } from "../components/AdminEditUserForm";
import {
  Users as UsersIcon,
  Edit,
  X,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { LaserBackground } from "../components/LaserBackgroundHoriztontal";

interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  xmin: number;
}

interface AuthContextType {
  token: string | null;
  fullName: string | null;
  role: string | null;
  setToken: (
    token: string | null,
    fullName?: string | null,
    role?: string | null
  ) => void;
}

export const Users = () => {
  const { token, role } = useContext(AuthContext) as AuthContextType;

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5081/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setUsers([]);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch users");

      const data: User[] = await res.json();
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
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8 max-w-md text-center">
          <ShieldAlert className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-red-300">Access denied</h2>
          <p className="mt-2 text-sm text-red-400">
            You do not have administrative privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <Navbar />
      <LaserBackground />
      <div className="max-w-6xl mx-auto pt-28 px-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-xl bg-pink-600/20">
            <UsersIcon className="w-7 h-7 text-pink-500" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-gray-400">
              Manage application users and permissions
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-pink-400">
              <Loader2 className="animate-spin" />
              <span>Loading users...</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left text-gray-300">
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Full name</th>
                  <th className="px-5 py-4 hidden md:table-cell">Phone</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u.id}
                    className={`border-t border-white/5 hover:bg-white/5 transition \
                      ${
                        index % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                      }`}
                  >
                    <td className="px-5 py-4 text-gray-400">{u.id}</td>
                    <td className="px-5 py-4">{u.email}</td>
                    <td className="px-5 py-4 font-medium">{u.fullName}</td>
                    <td className="px-5 py-4 hidden md:table-cell text-gray-400">
                      {u.phoneNumber || "–"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedUserId(u.id)}
                        className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-xs font-semibold shadow shadow-pink-600/30 hover:bg-pink-500 transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedUserId !== null && (
          <>
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setSelectedUserId(null)}
            />

            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                  <h3 className="text-xl font-bold text-pink-400">
                    Edit user #{selectedUserId}
                  </h3>
                  <button
                    onClick={() => setSelectedUserId(null)}
                    className="rounded-lg p-2 text-gray-400 hover:text-white hover:bg-white/10 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <AdminEditUserForm
                    user={users.find((u) => u.id === selectedUserId)!}
                    token={token!}
                    onUpdate={async (updatedUser) => {
                      setUsers((prev) =>
                        prev.map((u) =>
                          u.id === updatedUser.id ? updatedUser : u
                        )
                      );
                      setSelectedUserId(null);
                    }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
