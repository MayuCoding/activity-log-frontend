/** Small glass pill showing a label + value (weekly / yearly / rank). */
export default function PointsPill({ variant = "", label, value, icon }) {
  return (
    <span className={`pill ${variant}`}>
      {icon && <span aria-hidden>{icon}</span>}
      <span className="label">{label}</span>
      <span className="value">{value}</span>
    </span>
  );
}
