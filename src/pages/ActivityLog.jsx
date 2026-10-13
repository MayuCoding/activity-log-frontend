/** Activity Log — tabbed Full CRUD for study time, awards and assessments. */
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import confetti from "canvas-confetti";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { refreshPoints } from "../components/usePoints";
import RecordCard from "../components/RecordCard";
import StudyForm from "../components/forms/StudyForm";
import AwardForm from "../components/forms/AwardForm";
import AssessmentForm from "../components/forms/AssessmentForm";
import {
  listStudy, listAwards, listAssessments,
  createStudy, updateStudy, deleteStudy,
  createAward, updateAward, deleteAward,
  createAssessment, updateAssessment, deleteAssessment,
} from "../services/api";

const TABS = [
  { key: "study", label: "⏱ Study Time" },
  { key: "awards", label: "🏅 Awards" },
  { key: "assessments", label: "📝 Assessments" },
];

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function celebrate() {
  confetti({ particleCount: 120, spread: 75, origin: { y: 0.65 } });
}

export default function ActivityLog() {
  const location = useLocation();
  const { idToken } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState(location.state?.tab || "study");
  const [lists, setLists] = useState(null);
  const [editing, setEditing] = useState(null); // { kind, record }
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (!idToken) return;
    try {
      const [study, awards, assessments] = await Promise.all([
        listStudy(idToken),
        listAwards(idToken),
        listAssessments(idToken),
      ]);
      setLists({ study, awards, assessments });
    } catch (err) {
      toast(err.message || "Could not load your activity", "error");
    }
  }, [idToken, toast]);

  useEffect(() => {
    load();
  }, [load]);

  async function run(fn, successMsg, points) {
    setSubmitting(true);
    try {
      const result = await fn();
      toast(successMsg, "success");
      if (points > 0) celebrate();
      refreshPoints();
      await load();
      setEditing(null);
      return result;
    } catch (err) {
      toast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const handlers = {
    study: {
      create: (p) => run(() => createStudy(idToken, p), "Study time logged — emails sent! 📧", p.hours),
      update: (id, p) => run(() => updateStudy(idToken, id, p), "Study record updated"),
      remove: (id) => run(() => deleteStudy(idToken, id), "Study record deleted"),
    },
    awards: {
      create: (p) => run(() => createAward(idToken, p), "Award added (+2 pts) 🏅", 2),
      update: (id, p) => run(() => updateAward(idToken, id, p), "Award updated"),
      remove: (id) => run(() => deleteAward(idToken, id), "Award deleted"),
    },
    assessments: {
      create: (p) => run(() => createAssessment(idToken, p), "Assessment added 📝", p.grade),
      update: (id, p) => run(() => updateAssessment(idToken, id, p), "Assessment updated"),
      remove: (id) => run(() => deleteAssessment(idToken, id), "Assessment deleted"),
    },
  };

  function startEdit(kind, record) {
    setEditing({ kind, record });
    setTab(kind);
  }

  function confirmDelete(kind, id) {
    if (!window.confirm("Delete this record? Its points will be removed.")) return;
    handlers[kind].remove(id);
  }

  const current = lists?.[tab] || [];
  const formProps = { submitting, initial: editing?.record };

  return (
    <>
      <h1 className="section-title">📒 Activity Log</h1>
      <p className="section-sub">Add, edit or remove your self-reported entries.</p>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab${tab === t.key ? " active" : ""}`}
            onClick={() => {
              setTab(t.key);
              setEditing(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Add / edit form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2>{editing ? `✏️ Edit ${tab === "study" ? "study time" : tab === "awards" ? "award" : "assessment"}` : "➕ Add new"}</h2>
        <p className="sub">
          {tab === "study"
            ? "1 hour = 1 point (tutoring = 0.5/hr). Late homework costs −1 point."
            : tab === "awards"
              ? "Each academic award earns +2 points."
              : "Grades are out of 9 — points equal your grade."}
        </p>

        {tab === "study" && (
          <StudyForm
            key={editing?.record?.id || "new-study"}
            {...formProps}
            onSubmit={(p) =>
              editing ? handlers.study.update(editing.record.id, p) : handlers.study.create(p)
            }
          />
        )}
        {tab === "awards" && (
          <AwardForm
            key={editing?.record?.id || "new-award"}
            {...formProps}
            onSubmit={(p) =>
              editing ? handlers.awards.update(editing.record.id, p) : handlers.awards.create(p)
            }
          />
        )}
        {tab === "assessments" && (
          <AssessmentForm
            key={editing?.record?.id || "new-assessment"}
            {...formProps}
            onSubmit={(p) =>
              editing
                ? handlers.assessments.update(editing.record.id, p)
                : handlers.assessments.create(p)
            }
          />
        )}

        {editing && (
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setEditing(null)}>
            Cancel edit
          </button>
        )}
      </div>

      {/* Records list */}
      {lists === null ? (
        <div className="skeleton" />
      ) : current.length === 0 ? (
        <div className="empty">
          <span className="big">🗒</span>
          No entries here yet — add your first above!
        </div>
      ) : (
        <div className="record-list">
          {current.map((r) => {
            if (tab === "study") {
              return (
                <RecordCard
                  key={r.id}
                  title={`${r.hours}h · ${r.session_type}`}
                  detail={`Logged ${fmt(r.created_at)} · ${r.name}`}
                  tags={[
                    { label: r.session_type },
                    ...(r.is_late ? [{ label: "Late", late: true }] : []),
                  ]}
                  points={r.points}
                  onEdit={() => startEdit("study", r)}
                  onDelete={() => confirmDelete("study", r.id)}
                />
              );
            }
            if (tab === "awards") {
              return (
                <RecordCard
                  key={r.id}
                  title={r.name}
                  detail={`Added ${fmt(r.created_at)}`}
                  points={r.points}
                  onEdit={() => startEdit("awards", r)}
                  onDelete={() => confirmDelete("awards", r.id)}
                />
              );
            }
            return (
              <RecordCard
                key={r.id}
                title={r.subject}
                detail={`Grade ${r.grade}/9 · ${fmt(r.created_at)}`}
                points={r.points}
                onEdit={() => startEdit("assessments", r)}
                onDelete={() => confirmDelete("assessments", r.id)}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
