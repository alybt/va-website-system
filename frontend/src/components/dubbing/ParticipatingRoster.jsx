import { useState } from "react";
import styles from "./ParticipatingRoster.module.css";

const GENDER_ICONS = {
  Male: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="6"/><line x1="19" y1="5" x2="14.65" y2="9.35"/><polyline points="15 5 19 5 19 9"/>
    </svg>
  ),
  Female: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/>
    </svg>
  ),
  Other: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    </svg>
  ),
};

const CATEGORY_COLORS = {
  "Main Cast":  { bg: "rgba(212,175,95,0.15)",  border: "rgba(212,175,95,0.5)",  text: "#c49a48" },
  "Extra":      { bg: "rgba(100,120,160,0.12)", border: "rgba(100,120,160,0.4)", text: "#7a9acc" },
  "Minor Role": { bg: "rgba(160,100,120,0.12)", border: "rgba(160,100,120,0.4)", text: "#c47a8a" },
  "Kid":        { bg: "rgba(80,160,120,0.12)",  border: "rgba(80,160,120,0.4)",  text: "#5aaa88" },
};

export default function ParticipatingRoster({ actors, participatingIds, onAdd, onRemove }) {
  const [isOver, setIsOver] = useState(false);

  const participatingActors = actors.filter(a => participatingIds.has(a.actor_id));

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const actorId = parseInt(e.dataTransfer.getData("actorId"));
    if (!isNaN(actorId) && !participatingIds.has(actorId)) {
      onAdd(actorId);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Participating Actors</h2>
        <span className={styles.count}>{participatingActors.length}</span>
      </div>

      <div
        className={`${styles.dropZone} ${isOver ? styles.dropZoneOver : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {participatingActors.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
              className={styles.emptyIcon}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
            <p className={styles.emptyMsg}>Drop actors here to add them</p>
            <p className={styles.emptyHint}>Drag from Actor Pool above</p>
          </div>
        ) : (
          <div className={styles.list}>
            {participatingActors.map(actor => {
              const catStyle = CATEGORY_COLORS[actor.category] ?? CATEGORY_COLORS["Extra"];
              return (
                <div key={actor.actor_id} className={styles.row}>
                  <span className={styles.genderIcon}>
                    {GENDER_ICONS[actor.gender] ?? GENDER_ICONS["Other"]}
                  </span>

                  <span className={styles.name}>{actor.name}</span>

                  <span
                    className={styles.categoryBadge}
                    style={{
                      background: catStyle.bg,
                      border: `1px solid ${catStyle.border}`,
                      color: catStyle.text,
                    }}
                  >{actor.category ?? "—"}</span>

                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemove(actor.actor_id)}
                    title="Remove from roster"
                  >x</button>
                </div>
              );
            })}

            {isOver && (
              <div className={styles.dropMoreHint}>+ Drop to add</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}