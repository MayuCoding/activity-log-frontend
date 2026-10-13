/** A single activity-log row with points badge and edit/delete actions. */
export default function RecordCard({ title, detail, tags = [], points, onEdit, onDelete }) {
  const negative = points < 0;
  return (
    <div className="record">
      <div className="meta">
        <span className="title">{title}</span>
        <span className="detail">{detail}</span>
        {tags.length > 0 && (
          <span style={{ display: "flex", gap: 6, marginTop: 4 }}>
            {tags.map((t) => (
              <span key={t.label} className={`tag${t.late ? " late" : ""}`}>
                {t.label}
              </span>
            ))}
          </span>
        )}
      </div>
      <div className="right">
        <span className={`points-badge${negative ? " negative" : ""}`}>
          {negative ? "" : "+"}
          {points} pts
        </span>
        {onEdit && (
          <button className="btn btn-ghost btn-sm" onClick={onEdit} title="Edit">
            ✏️
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger btn-sm" onClick={onDelete} title="Delete">
            🗑
          </button>
        )}
      </div>
    </div>
  );
}
