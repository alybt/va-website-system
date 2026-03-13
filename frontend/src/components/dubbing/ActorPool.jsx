import { useState } from "react";
import ActorCard from "../ActorCard";
import styles from "./ActorPool.module.css";

function DraggableActorCard({ actor, isParticipating, onDelete, onEdit }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData("actorId", String(actor.actor_id));
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      className={[
        styles.draggable,
        dragging        ? styles.dragging      : "",
        isParticipating ? styles.participating : "",
      ].join(" ")}
    >
      {isParticipating && (
        <span className={styles.participatingBadge}>Participating</span>
      )}
      <ActorCard actor={actor} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

export default function ActorPool({ actors, loading, error, participatingIds, onEdit, onDelete }) {
  const [search, setSearch] = useState("");

  const filtered = actors.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.category ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (a.gender   ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Actor Pool</h2>
        <span className={styles.count}>{actors.length} actors</span>
      </div>

      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search actors…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <p className={styles.hint}>Drag a card onto a character slot to assign</p>

      {loading && <p className={styles.stateMsg}>Loading actors…</p>}
      {error   && <p className={`${styles.stateMsg} ${styles.errorMsg}`}>{error}</p>}

      {!loading && !error && (
        <div className={styles.grid}>
          {filtered.map(actor => (
            <DraggableActorCard
              key={actor.actor_id}
              actor={actor}
              isParticipating={participatingIds.has(actor.actor_id)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {filtered.length === 0 && (
            <p className={`${styles.stateMsg} ${styles.empty}`}>No actors found</p>
          )}
        </div>
      )}
    </div>
  );
}