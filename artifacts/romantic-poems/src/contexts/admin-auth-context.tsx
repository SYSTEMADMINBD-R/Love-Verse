import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface AdminAuthContextValue {
  authenticated: boolean;
  configured: boolean;
  loading: boolean;
  statusError: string | null;
  refresh: () => Promise<void>;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthStatusResponse {
  configured: boolean;
  authenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

async function responseError(response: Response): Promise<string> {
  const payload = (await response.json().catch(() => null)) as
    | { error?: unknown }
    | null;
  return typeof payload?.error === "string"
    ? payload.error
    : `Request failed (${response.status})`;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/status", {
        cache: "no-store",
        credentials: "same-origin",
      });
      if (!response.ok) {
        throw new Error(await responseError(response));
      }
      const status = (await response.json()) as AuthStatusResponse;
      setConfigured(status.configured === true);
      setAuthenticated(status.authenticated === true);
      setStatusError(null);
    } catch {
      setAuthenticated(false);
      setStatusError("Could not connect to the poem server. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      throw new Error(await responseError(response));
    }
    setAuthenticated(true);
    setConfigured(true);
    setStatusError(null);
  }, []);

  const logout = useCallback(async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    if (!response.ok) {
      throw new Error(await responseError(response));
    }
    setAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        authenticated,
        configured,
        loading,
        statusError,
        refresh,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
}