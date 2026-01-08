// src/context/AuthProvider.tsx
import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { setAuthToken } from "api";
import { setAuthToken as setRtkAuthToken } from "rtkApi";

interface JwtPayload {
  exp: number; // expiration timestamp
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "employee" | "manager";
  join_date: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  setAuth: (token: string | null, user: User | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setAuth: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isTokenExpired = (token: string) => {
    try {
      const { exp } = jwtDecode<JwtPayload>(token);
      if (!exp) return true;
      return Date.now() >= exp * 1000; // JWT exp is in seconds
    } catch {
      return true;
    }
  };

  const setAuth = (newToken: string | null, newUser: User | null) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken && newUser) {
      localStorage.setItem("authToken", newToken);
      localStorage.setItem("authUser", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
  };

  // initialize from localStorage if exists
  React.useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setAuthToken(storedToken);
      setRtkAuthToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
