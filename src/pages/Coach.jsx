/** Coach page — wraps the motivation chat. */
import CoachChat from "../components/CoachChat";

export default function Coach() {
  return (
    <>
      <h1 className="section-title">💬 Motivation Coach</h1>
      <p className="section-sub">Two sparks a day keeps the procrastination away.</p>
      <CoachChat />
    </>
  );
}
