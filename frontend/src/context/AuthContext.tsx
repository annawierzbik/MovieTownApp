import React, { createContext, useState, ReactNode } from "react";

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

const getInitialToken = () => localStorage.getItem("token");
const getInitialFullName = () => localStorage.getItem("fullName");
const getInitialRole = () => localStorage.getItem("role");

export const AuthContext = createContext<AuthContextType>({
  token: null,
  fullName: null,
  role: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getInitialToken());
  const [fullName, setFullName] = useState<string | null>(getInitialFullName());
  const [role, setRole] = useState<string | null>(getInitialRole());

  const saveToken = (
    t: string | null,
    name: string | null = null,
    r: string | null = null
  ) => {
    if (t) {
      localStorage.setItem("token", t);
    } else {
      localStorage.removeItem("token");
    }
    setToken(t);

    if (name) {
      localStorage.setItem("fullName", name);
    } else {
      localStorage.removeItem("fullName");
    }
    setFullName(name);

    if (r) {
      localStorage.setItem("role", r);
    } else {
      localStorage.removeItem("role");
    }
    setRole(r);
  };

  return (
    <AuthContext.Provider
      value={{ token, fullName, role, setToken: saveToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
