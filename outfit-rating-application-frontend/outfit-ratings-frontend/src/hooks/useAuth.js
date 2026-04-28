"use client";

import { useState, useEffect, useCallback } from "react";
import { getCurrentUser, logout as authLogout } from "@/services/authService";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const current = await getCurrentUser();
      setUser(current);
    } catch (err) {
      setError(err?.message || String(err));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    try {
      await authLogout();
      setUser(null);
    } catch (err) {
      setError(err?.message || String(err));
      throw err;
    }
  }

  return { user, loading, error, refresh: load, logout };
}
