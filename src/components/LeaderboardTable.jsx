/** Weekly leaderboard: top-3 podium plus the full ranked table. */
const MEDALS = ["🥇", "🥈", ""];

export default function LeaderboardTable({ entries = [], currentUid }) {
  const podium = entries.slice(0, 3);
  return (
    <>
      {podium.length > 0 && (
        <div className="podium">
          {podium.map((e) => (
            <div key={e.uid} className={`slot${e.rank === 1 ? " first" : ""}`}>
              <div className="medal" aria-hidden>{MEDALS[e.rank - 1]}</div>
              <div className="pname">{e.display_name || e.email || "Student"}</div>
              <div className="pts">{e.weekly_points} pts this week</div>
            </div>
          ))}
        </div>
      )}

      <table className="lb-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student</th>
            <th>Weekly</th>
            <th>Yearly</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.uid} className={e.uid === currentUid ? "me" : ""}>
              <td className="rank-cell">{e.rank}</td>
              <td>
                {e.display_name || e.email || "Student"}
                {e.uid === currentUid ? " (you)" : ""}
              </td>
              <td>{e.weekly_points}</td>
              <td>{e.yearly_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
