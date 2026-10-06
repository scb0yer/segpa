"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../_lib/api";
const StudentContext = createContext(null);
export function StudentProvider({ children }) {
  const [dashboard, setDashboard] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sessionError, setSessionError] = useState("");
  const [panel, setPanel] = useState(false);
  // Le hub fournit la fonction qui ouvre l'exercice : le dashboard conserve
  // ainsi les confirmations de sortie d'une série et le chargement à la demande.
  const activityLauncher = useRef(null);
  const registerActivityLauncher = useCallback((handler) => {
    activityLauncher.current = handler;
    return () => {
      if (activityLauncher.current === handler) activityLauncher.current = null;
    };
  }, []);
  const launchActivity = useCallback((exerciceId) => {
    return activityLauncher.current?.(exerciceId) || "unavailable";
  }, []);
  const revision = useRef(0);
  const refresh = useCallback(async (signal) => {
    const requestRevision = ++revision.current;
    try {
      const data = await api("/students/me/dashboard", { signal });
      if (requestRevision === revision.current) {
        setDashboard(data);
        setSessionError("");
      }
      return data;
    } catch (error) {
      if (requestRevision === revision.current && error.name !== "AbortError") {
        if (error.status === 401) setDashboard(null);
        else setSessionError(error.message);
      }
      throw error;
    }
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    refresh(controller.signal)
      .catch(() => {})
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });
    return () => controller.abort();
  }, [refresh]);
  // Actualise les jauges et le changement de semaine sur une page restée ouverte.
  useEffect(() => {
    if (!dashboard?.student?.id) return;
    const update = () => {
      if (!document.hidden) refresh().catch(() => {});
    };
    const timer = setInterval(update, 60000);
    document.addEventListener("visibilitychange", update);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, [dashboard?.student?.id, refresh]);
  async function login(name, password) {
    ++revision.current;
    await api("/auth/login", {
      method: "POST",
      body: { name: name.trim(), password },
    });
    try {
      await refresh();
    } catch (error) {
      setDashboard(null);
      if (error.status === 401)
        throw new Error(
          "Tes identifiants sont corrects, mais la session n'est pas reconnue. Vérifie le cookie et le proxy du serveur.",
        );
      throw error;
    }
  }
  async function logout() {
    await api("/auth/logout", { method: "POST", body: {} });
    ++revision.current;
    setDashboard(null);
    setSessionError("");
  }
  async function recordAttempt(payload) {
    try {
      return await api("/attempt", { method: "POST", body: payload });
    } catch (error) {
      if (error.status === 401) {
        ++revision.current;
        setDashboard(null);
        setPanel(true);
      }
      throw error;
    }
  }
  return (
    <StudentContext.Provider
      value={{
        student: dashboard?.student || null,
        dashboard,
        checking,
        sessionError,
        panel,
        openPanel: () => setPanel(true),
        closePanel: () => setPanel(false),
        login,
        logout,
        refresh,
        recordAttempt,
        registerActivityLauncher,
        launchActivity,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
export function useStudent() {
  const context = useContext(StudentContext);
  if (!context)
    throw new Error("useStudent doit être utilisé dans StudentProvider.");
  return context;
}
