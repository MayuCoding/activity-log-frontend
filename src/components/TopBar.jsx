/** Top bar: avatar + greeting, live points pills and logout. */
import { useAuth } from "../context/AuthContext";
import { usePoints } from "./usePoints";
import PointsPill from "./PointsPill";

export default function TopBar() {
  const { user, logout } = useAuth();
  const { summary } = usePoints();

  const name = user?.displayName || user?.email || "Student";
  const photo = user?.photoURL;

  return (
    <header className="topbar">
      <div className="who">
        {photo ? (
          <img className="avatar" src={photo} alt={name} referrerPolicy="no-referrer" />
        ) : (
          <span className="avatar" aria-hidden>🎓</span>
        )}
        <div>
          <div className="hello">Welcome back</div>
          <div className="name">{name}</div>
        </div>
      </div>

      <div className="stats">
        <PointsPill variant="weekly" icon="⚡" label="Week" value={summary?.weekly_points ?? "–"} />
        <PointsPill variant="yearly" icon="🌟" label="Year" value={summary?.yearly_points ?? "–"} />
        <PointsPill variant="rank" icon="🏅" label="Rank" value={summary?.rank ? `#${summary.rank}` : "–"} />
        <button className="btn btn-ghost btn-sm" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
