import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { loginAdmin, logoutAdmin, getAdminSession } from "../api";
import { AdminApiError, setAdminUnauthorizedHandler } from "../api/client";

const AdminAuthContext = createContext(undefined);

function getRedirectPath(state) {
  const from = state?.from;
  if (typeof from === "string") return from;
  if (from?.pathname) {
    return `${from.pathname}${from.search || ""}${from.hash || ""}`;
  }
  return "/admin";
}

export function AdminAuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(
    (shouldRedirect = false) => {
      setSession(null);
      if (shouldRedirect && location.pathname !== "/admin/login") {
        navigate("/admin/login", {
          replace: true,
          state: { from: location },
        });
      }
    },
    [location, navigate],
  );

  const refreshSession = useCallback(async () => {
    try {
      const nextSession = await getAdminSession();
      setSession(nextSession?.authenticated ? nextSession : null);
      return nextSession;
    } catch (error) {
      if (error instanceof AdminApiError && error.status === 401) {
        setSession(null);
        return null;
      }
      throw error;
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      try {
        await refreshSession();
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      isActive = false;
    };
  }, [refreshSession]);

  useEffect(() => {
    return setAdminUnauthorizedHandler(() => {
      clearSession(true);
    });
  }, [clearSession]);

  const login = useCallback(async (username, password) => {
    const nextSession = await loginAdmin({ username, password });
    setSession(nextSession?.authenticated ? nextSession : null);
    return nextSession;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } finally {
      setSession(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      login,
      logout,
      refreshSession,
      clearSession,
      getRedirectPath,
    }),
    [session, loading, login, logout, refreshSession, clearSession],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function AdminAuthRoot() {
  return (
    <AdminAuthProvider>
      <Outlet />
    </AdminAuthProvider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider.");
  }
  return context;
}
