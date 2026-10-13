/** Motivation coach chat with the 2-messages-per-day counter. */
import { useEffect, useRef, useState } from "react";
import { agentUsage, motivate } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";

export default function CoachChat() {
  const { idToken } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [usage, setUsage] = useState(null);
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!idToken) return;
    agentUsage(idToken).then(setUsage).catch(() => {});
  }, [idToken]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const locked = usage ? usage.messages_left <= 0 : false;

  async function send(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy || locked) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    try {
      const res = await motivate(idToken, text);
      setMessages((m) => [...m, { role: "coach", text: res.reply }]);
      setUsage((u) => ({ ...u, messages_left: res.messages_left }));
    } catch (err) {
      setMessages((m) => m.slice(0, -1)); // roll back the optimistic user bubble
      toast(err.message || "Coach is unavailable right now", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h2>💬 Motivation Coach</h2>
      <p className="sub">
        {locked
          ? "Daily limit reached — come back tomorrow for more sparks!"
          : `${usage?.messages_left ?? "…"} message(s) left today`}
      </p>

      <div className="chat">
        {messages.length === 0 && (
          <div className="empty">
            <span className="big">🌱</span>
            Ask your coach for a spark of motivation!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="chat-input" onSubmit={send}>
        <input
          className="input"
          placeholder="I need a push to start studying…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy || locked}
        />
        <button className="btn btn-primary" type="submit" disabled={busy || locked}>
          {busy ? "…" : "Spark ✨"}
        </button>
      </form>
    </div>
  );
}
