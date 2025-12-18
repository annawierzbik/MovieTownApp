import React, { useState } from "react";
import { Save, Loader2 } from "lucide-react";

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
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [role, setRole] = useState(user.role);
  const [isSaving, setIsSaving] = useState(false);
  const [xmin, setXmin] = useState(user.xmin);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = async () => {
    if (!token) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`http://localhost:5081/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phoneNumber, role, xmin }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Update failed");
      }

      onUpdate({ ...user, fullName, phoneNumber, role });
      setMessage({ text: "User updated successfully!", isError: false });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `${err}`, isError: true });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6 space-y-4">
      {message && (
        <div
          className={`p-3 rounded font-semibold text-center ${
            message.isError
              ? "bg-red-900 border-l-4 border-red-500 text-red-300"
              : "bg-green-900 border-l-4 border-green-500 text-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block mb-1 text-sm text-gray-400">
          Email (ID: {user.id})
        </label>
        <input
          value={user.email}
          disabled
          className="w-full p-3 rounded bg-white/10 text-gray-400 border border-white/20 cursor-not-allowed"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Full Name</label>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isSaving}
          className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Phone Number</label>
        <input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isSaving}
          className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm text-gray-400">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={isSaving}
          className="w-full p-3 rounded bg-white/10 text-white border border-white/20 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition ${
            isSaving
              ? "bg-pink-700 opacity-70 cursor-not-allowed"
              : "bg-pink-500 hover:bg-pink-600 text-white shadow-md shadow-pink-500/30"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Save
            </>
          )}
        </button>
      </div>
    </div>
  );
};
