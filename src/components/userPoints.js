/**
 * Shared hook for the current student's points summary.
 * Pages dispatch `refreshPoints()` after any mutation so the top bar and
 * dashboard stay in sync without prop-drilling.
 */
import { useCallback, useEffect, useState } from "react";
import { myPoints } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const REFRESH_EVENT = "studyspark:refresh";

export function refreshPoints() {
  window.dispatchEvent(new Event(REFRESH_EVENT));
}

export function usePoints() {
  const { idToken } = useAuth();
  const [summary, setSummary] = useState(null);

  const reload = useCallback(async () => {
    if (!idToken) return;
    try {
      setSummary(await myPoints(idToken));
    } catch {
      // leave previous summary on transient failure
    }
  }, [idToken]);

  useEffect(() => {
    reload();
    window.addEventListener(REFRESH_EVENT, reload);
    return () => window.removeEventListener(REFRESH_EVENT, reload);
  }, [reload]);

  return { summary, reload };
}
