import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { api, setToken, getToken } from "./api.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then((u) => setAdmin(u))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, email: e } = await api.login(email, password);
    setToken(token);
    setAdmin({ email: e, role: "admin" });
  };
  const logout = () => {
    setToken(null);
    setAdmin(null);
  };
  return (
    <AuthCtx.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);

export function RequireAdmin({ children }) {
  const { admin, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <main className="container-page pt-32 pb-20 text-center text-gray-500">
        Checking session…
      </main>
    );
  }
  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}
