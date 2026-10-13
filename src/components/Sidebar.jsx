/** Left glass navigation sidebar. */
import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/activity", label: "Activity Log", icon: "📒" },
  { to: "/leaderboard", label: "Leaderboard", icon: "🏆" },
  { to: "/coach", label: "Coach", icon: "💬" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="spark">✨</span>
        <span className="name">StudySpark</span>
      </div>
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          <span className="ico" aria-hidden>{l.icon}</span>
          <span>{l.label}</span>
        </NavLink>
      ))}
      <div className="spacer" />
    </aside>
  );
}
