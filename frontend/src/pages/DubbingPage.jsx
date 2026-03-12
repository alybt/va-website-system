import { useState } from "react";
import ActorCard from "../components/ActorCard";
import CharacterCard from "../components/CharacterCard";
import { useActors } from "../hooks/useActors";
import { useCharacters } from "../hooks/useCharacters";
import styles from "./DubbingPage.module.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const ROLE_COLORS = {
  "Main Cast":  { bg: "rgba(212,175,95,0.15)",  border: "rgba(212,175,95,0.45)",  text: "#c49a48" },
  "Supporting": { bg: "rgba(100,120,180,0.12)", border: "rgba(100,120,180,0.4)",  text: "#7a9acc" },
  "Extra":      { bg: "rgba(130,100,160,0.12)", border: "rgba(130,100,160,0.4)",  text: "#a07acc" },
};

const TYPE_BADGE = {
  "Manhwa":         "#c49a48",
  "Manhua":         "#7a9acc",
  "Manga":          "#c47a8a",
  "Webtoon":        "#5aaa88",
  "Western Comics": "#8a7a65",
};

const GENDER_ICONS = {
  Male: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="6"/><line x1="19" y1="5" x2="14.65" y2="9.35"/><polyline points="15 5 19 5 19 9"/>
    </svg>
  ),
  Female: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/>
    </svg>
  ),
  Other: (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    </svg>
  ),
};

// ── CharacterRow — drop zone that uses CharacterCard on hover/expand ──────────
function CharacterRow({ character, actors, onAssign, onUnassign, dragOverId, setDragOverId }) {
  const roleStyle = ROLE_COLORS[character.role] || ROLE_COLORS["Extra"];
  const assigned  = character.assigned_actor
    ? actors.find(a => a.actor_id === character.assigned_actor)
    : null;
  const isOver = dragOverId === character.character_id;

  return (
    <div
      className={`${styles.characterRow} ${isOver ? styles.characterRowOver : ""}`}
      onDragOver={e => { e.preventDefault(); setDragOverId(character.character_id); }}
      onDragLeave={() => setDragOverId(null)}
      onDrop={e => {
        e.preventDefault();
        setDragOverId(null);
        const actorId = parseInt(e.dataTransfer.getData("actorId"));
        onAssign(character.character_id, actorId);
      }}
    >
      {/* Character info — uses CharacterCard data shape */}
      <div className={styles.characterInfo}>
        <div className={styles.characterNameRow}>
          <span className={styles.characterName}>{character.name}</span>
          <span className={styles.characterGender}>
            {GENDER_ICONS[character.gender]}
          </span>
        </div>
        <span
          className={styles.roleBadge}
          style={{
            background: roleStyle.bg,
            border: `1px solid ${roleStyle.border}`,
            color: roleStyle.text,
          }}
        >{character.role}</span>
      </div>

      {/* Assignment slot */}
      <div className={styles.assignSlot}>
        {assigned ? (
          <div className={styles.assignedBox}>
            <span className={styles.assignedName}>{assigned.name}</span>
            <button
              className={styles.unassignBtn}
              onClick={() => onUnassign(character.character_id)}
              title="Remove assignment"
            >×</button>
          </div>
        ) : (
          <div className={`${styles.dropZone} ${isOver ? styles.dropZoneOver : ""}`}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Drop actor here
          </div>
        )}
      </div>
    </div>
  );
}

// ── DraggableActorCard — wraps ActorCard with drag behaviour ─────────────────
function DraggableActorCard({ actor, isAssigned, onEdit, onDelete }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData("actorId", actor.actor_id); setDragging(true); }}
      onDragEnd={() => setDragging(false)}
      className={`${styles.draggable} ${dragging ? styles.dragging : ""} ${isAssigned ? styles.dimmed : ""}`}
    >
      {isAssigned && (
        <div className={styles.assignedBadge}>Assigned</div>
      )}
      <ActorCard actor={actor} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

export default function DubbingPage() { 
  const {
    actors,
    loading: actorsLoading,
    error: actorsError,
    deleteActor,
    updateActor,
  } = useActors();

  // artList: you'll want a useSequentialArt() hook — for now seeded from
  // characters hook so we at least have the art selector working.
  // Replace `artList` & `selectedArtId` with your own useSequentialArt() hook.
  const [artList] = useState([]);          // ← swap: const { artList } = useSequentialArt()
  const [selectedArtId, setSelectedArtId] = useState(null);

  const {
    characters,
    loading: charsLoading,
    error: charsError,
  } = useCharacters(
    selectedArtId ? "art" : "all",
    selectedArtId ?? undefined
  );

  // ── Local session state ───────────────────────────────────────────────────
  const [assignments, setAssignments]   = useState({});   // { character_id: actor_id }
  const [actorSearch, setActorSearch]   = useState("");
  const [dragOverId, setDragOverId]     = useState(null);

  // ── Derived values ────────────────────────────────────────────────────────
  const selectedArt       = artList.find(a => a.art_id === selectedArtId) ?? null;
  const assignedActorIds  = new Set(Object.values(assignments));

  const filteredActors = actors.filter(a =>
    a.name.toLowerCase().includes(actorSearch.toLowerCase())     ||
    (a.category ?? "").toLowerCase().includes(actorSearch.toLowerCase()) ||
    (a.gender   ?? "").toLowerCase().includes(actorSearch.toLowerCase())
  );

  const charactersWithAssignments = characters.map(c => ({
    ...c,
    assigned_actor: assignments[c.character_id] ?? null,
  }));

  const assignedCount = charactersWithAssignments.filter(c => c.assigned_actor).length;
  const totalCount    = charactersWithAssignments.length;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAssign   = (characterId, actorId) =>
    setAssignments(prev => ({ ...prev, [characterId]: actorId }));

  const handleUnassign = (characterId) =>
    setAssignments(prev => { const n = { ...prev }; delete n[characterId]; return n; });

  const handleClearAll = () => setAssignments({});

  const handleSelectArt = (artId) => {
    setSelectedArtId(artId);
    setAssignments({});
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={`app-container ${styles.page}`}>

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dubbing Session</h1>
        <p className={styles.pageSubtitle}>Drag actors onto character roles to assign them temporarily</p>
      </div>

      {/* Art Selector Tabs */}
      {artList.length > 0 && (
        <div className={styles.artTabs}>
          {artList.map(art => (
            <button
              key={art.art_id}
              onClick={() => handleSelectArt(art.art_id)}
              className={`${styles.artTab} ${selectedArtId === art.art_id ? styles.artTabActive : ""}`}
            >
              <span
                className={styles.artTypeBadge}
                style={{
                  background: `${TYPE_BADGE[art.type] || "#8a7a65"}22`,
                  border: `1px solid ${TYPE_BADGE[art.type] || "#8a7a65"}55`,
                  color: TYPE_BADGE[art.type] || "#8a7a65",
                }}
              >{art.type}</span>
              {art.title}
            </button>
          ))}
        </div>
      )}

      {/* Two-Column Layout */}
      <div className={styles.grid}>

        {/* LEFT — Art info + Characters */}
        <div className={styles.leftCol}>

          {/* Art info card */}
          {selectedArt && (
            <div className={styles.artCard}>
              <div className={styles.artCardHeader}>
                <div>
                  <div className={styles.artTitle}>{selectedArt.title}</div>
                  <div className={styles.artGenre}>{selectedArt.genre}</div>
                </div>
                <span
                  className={styles.artTypePill}
                  style={{
                    background: `${TYPE_BADGE[selectedArt.type] || "#8a7a65"}18`,
                    border: `1px solid ${TYPE_BADGE[selectedArt.type] || "#8a7a65"}50`,
                    color: TYPE_BADGE[selectedArt.type] || "#8a7a65",
                  }}
                >{selectedArt.type}</span>
              </div>

              {/* Progress bar */}
              <div className={styles.progressWrap}>
                <div className={styles.progressMeta}>
                  <span>ROLES FILLED</span>
                  <span className={styles.progressCount}>{assignedCount} / {totalCount}</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${totalCount > 0 ? (assignedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Characters & Roles */}
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Characters &amp; Roles</span>
              {assignedCount > 0 && (
                <button className={styles.clearBtn} onClick={handleClearAll}>
                  Clear all
                </button>
              )}
            </div>

            {charsLoading && <p className={styles.stateMsg}>Loading characters…</p>}
            {charsError   && <p className={styles.stateMsg} style={{ color: "#c47a7a" }}>{charsError}</p>}

            {!charsLoading && !charsError && charactersWithAssignments.length === 0 && (
              <p className={styles.stateMsg}>
                {selectedArtId ? "No characters for this title." : "Select a title to see characters."}
              </p>
            )}

            {charactersWithAssignments.map(character => (
              <CharacterRow
                key={character.character_id}
                character={character}
                actors={actors}
                onAssign={handleAssign}
                onUnassign={handleUnassign}
                dragOverId={dragOverId}
                setDragOverId={setDragOverId}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — Actor Pool */}
        <div className={styles.rightCol}>
          <div className={styles.panel}>
            <div className={styles.panelTitle} style={{ marginBottom: 14 }}>Actor Pool</div>

            {/* Search */}
            <div className={styles.searchWrap}>
              <svg
                className={styles.searchIcon}
                width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="Search actors…"
                value={actorSearch}
                onChange={e => setActorSearch(e.target.value)}
              />
            </div>

            <p className={styles.dragHint}>Drag a card onto a character role to assign</p>

            {actorsLoading && <p className={styles.stateMsg}>Loading actors…</p>}
            {actorsError   && <p className={styles.stateMsg} style={{ color: "#c47a7a" }}>{actorsError}</p>}

            {/* Actor cards grid — uses ActorCard */}
            {!actorsLoading && !actorsError && (
              <div className={styles.actorGrid}>
                {filteredActors.map(actor => (
                  <DraggableActorCard
                    key={actor.actor_id}
                    actor={actor}
                    isAssigned={assignedActorIds.has(actor.actor_id)}
                    onEdit={a => updateActor(a.actor_id, a)}
                    onDelete={deleteActor}
                  />
                ))}
                {filteredActors.length === 0 && (
                  <p className={`${styles.stateMsg} ${styles.noResults}`}>No actors found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}