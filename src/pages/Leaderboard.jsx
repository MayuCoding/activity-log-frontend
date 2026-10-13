/** Leaderboard page — weekly ranking with podium. */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { leaderboard } from "../services/api";
import LeaderboardTable from "../components/LeaderboardTable";

export default function Leaderboard() {
  const { user, idToken } = useAuth();
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    if (!idToken) return;
    leaderboard(idToken).then(setEntries).catch(() => setEntries([]));
  }, [idToken]);

  return (
    <>
      <h1 className="section-title">🏆 Weekly Leaderboard</h1>
      <p className="section-sub">
        Top student each week banks +3 yearly points. Board resets Sunday night.
      </p>
      <div className="card">
        {entries === null ? (
          <div className="skeleton" />
        ) : entries.length === 0 ? (
          <div className="empty">
            <span className="big">🛋</span>
            No one on the board yet — be the first!
          </div>
        ) : (
          <LeaderboardTable entries={entries} currentUid={user?.uid} />
        )}
      </div>
    </>
  );
}
