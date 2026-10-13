/** Login screen — centered glass card with Google sign-in. */
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";

const CHIPS = ["⏱ Log study time", "🏅 Earn awards", "📝 Track grades", "🏆 Climb the board", "💬 Get motivated"];

export default function Login() {
  const { loginWithGoogle } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setBusy(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      toast(err?.message || "Google sign-in failed", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="logo" aria-hidden>✨</div>
        <h1>StudySpark</h1>
        <p>Log your study time, bank the points and out-shine your cohort.</p>
        <button className="btn btn-google" onClick={handleLogin} disabled={busy}>
          {busy ? "Signing in…" : "Continue with Google"}
        </button>
        <div className="feature-chips">
          {CHIPS.map((c) => (
            <span key={c} className="pill">
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
