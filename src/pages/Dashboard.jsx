/** Dashboard — points summary, quick actions and recent activity. */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePoints } from "../components/usePoints";
import PointsPill from "../components/PointsPill";
import RecordCard from "../components/RecordCard";
import { listStudy, listAwards, listAssessments } from "../services/api";

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Dashboard() {
  const { user, idToken } = useAuth();
  const { summary } = usePoints();
  const [recent, setRecent] = useState(null);

  useEffect(() => {
    if (!idToken) return;
    (async () => {
      try {
        const [study, awards, assessments] = await Promise.all([
          listStudy(idToken),
          listAwards(idToken),
          listAssessments(idToken),
        ]);
        const merged = [
          ...study.map((r) => ({ ...r, kind: "study" })),
          ...awards.map((r) => ({ ...r, kind: "award" })),
          ...assessments.map((r) => ({ ...r, kind: "assessment" })),
        ]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);
        setRecent(merged);
      } catch {
        setRecent([]);
      }
    })();
  }, [idToken]);

  const name = user?.displayName?.split(" ")[0] || "there";

  return (
    <>
      <h1 className="section-title">Hey {name} 👋</h1>
      <p className="section-sub">Here's your momentum at a glance.</p>

      <div className="grid cols-3" style={{ marginBottom: 24 }}>
        <div className="card hoverable">
          <h2>⚡ This week</h2>
          <p className="sub">Resets Sunday night</p>
          <PointsPill variant="weekly" label="pts" value={summary?.weekly_points ?? "–"} />
        </div>
        <div className="card hoverable">
          <h2>🌟 Yearly</h2>
          <p className="sub">Includes rank bonuses</p>
          <PointsPill variant="yearly" label="pts" value={summary?.yearly_points ?? "–"} />
        </div>
        <div className="card hoverable">
          <h2>🏅 Your rank</h2>
          <p className="sub">Of {summary?.total_students ?? "–"} students</p>
          <PointsPill variant="rank" label="rank" value={summary?.rank ? `#${summary.rank}` : "–"} />
        </div>
      </div>

      <div className="grid cols-2">
        <div className="card">
          <h2>➕ Quick add</h2>
          <p className="sub">Jump straight into logging</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/activity" state={{ tab: "study" }} className="btn btn-primary btn-sm">
              ⏱ Study time
            </Link>
            <Link to="/activity" state={{ tab: "awards" }} className="btn btn-ghost btn-sm">
              🏅 Award
            </Link>
            <Link to="/activity" state={{ tab: "assessments" }} className="btn btn-ghost btn-sm">
              📝 Assessment
            </Link>
          </div>
        </div>

        <div className="card">
          <h2>📒 Recent activity</h2>
          <p className="sub">Your latest entries</p>
          {recent === null ? (
            <div className="skeleton" />
          ) : recent.length === 0 ? (
            <div className="empty">
              <span className="big">🌵</span>
              Nothing logged yet — add your first entry!
            </div>
          ) : (
            <div className="record-list">
              {recent.map((r) => (
                <RecordCard
                  key={r.id}
                  title={
                    r.kind === "study"
                      ? `${r.hours}h ${r.session_type}`
                      : r.kind === "award"
                        ? r.name
                        : r.subject
                  }
                  detail={fmt(r.created_at)}
                  points={r.points}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
