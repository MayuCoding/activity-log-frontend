/**
 * AuthContext — React context wrapping Firebase auth state.
 *
 * Provides:
 *   user               – the current Firebase User (or null)
 *   loading            – true while the initial auth check runs
 *   idToken            – the latest Firebase ID token string
 *   loginWithGoogle()  – triggers Google popup sign-in
 *   logout()           – signs the user out
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for Firebase auth state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          setIdToken(await firebaseUser.getIdToken());
        } catch {
          setIdToken(null);
        }
      } else {
        setUser(null);
        setIdToken(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Refresh the ID token every 50 minutes (Firebase tokens expire at 60).
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        setIdToken(await user.getIdToken(true));
      } catch {
        // refresh failed — the user will re-login if needed
      }
    }, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(result.user);
    setIdToken(await result.user.getIdToken());
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setIdToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, idToken, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
