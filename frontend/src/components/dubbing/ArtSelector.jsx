import styles from "./ArtSelector.module.css";

const TYPE_BADGE = {
  "Manhwa":         "#c49a48",
  "Manhua":         "#7a9acc",
  "Manga":          "#c47a8a",
  "Webtoon":        "#5aaa88",
  "Western Comics": "#8a7a65",
};

const ROLE_COLORS = {
  "Main Cast":  { bg: "rgba(212,175,95,0.15)",  border: "rgba(212,175,95,0.45)",  text: "#c49a48" },
  "Supporting": { bg: "rgba(100,120,180,0.12)", border: "rgba(100,120,180,0.4)",  text: "#7a9acc" },
  "Extra":      { bg: "rgba(130,100,160,0.12)", border: "rgba(130,100,160,0.4)",  text: "#a07acc" },
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

function CharacterSlot({ character, assignedActor, onAssign, onUnassign, dragOverId, setDragOverId }) {
  const roleStyle = ROLE_COLORS[character.role] || ROLE_COLORS["Extra"];
  const isOver    = dragOverId === character.character_id;

  return (
    <div
      className={`${styles.slot} ${isOver ? styles.slotOver : ""}`}
      onDragOver={e => { e.preventDefault(); setDragOverId(character.character_id); }}
      onDragLeave={() => setDragOverId(null)}
      onDrop={e => {
        e.preventDefault();
        setDragOverId(null);
        const actorId = parseInt(e.dataTransfer.getData("actorId"));
        if (!isNaN(actorId)) onAssign(character.character_id, actorId);
      }}
    >

      <div className={styles.slotCharInfo}>
        <div className={styles.slotNameRow}>
          <span className={styles.slotCharName}>{character.name}</span>
          <span className={styles.slotGender}>{GENDER_ICONS[character.gender]}</span>
          {character.age != null && (
            <span className={styles.slotAge}>·  Age {character.age}</span>
          )}
        </div>
        <span
          className={styles.slotRoleBadge}
          style={{
            background: roleStyle.bg,
            border: `1px solid ${roleStyle.border}`,
            color: roleStyle.text,
          }}
        >{character.role}</span>
      </div>

      <div className={styles.slotAssign}>
        {assignedActor ? (
          <div className={styles.assignedPill}>
            <span className={styles.assignedActorName}>{assignedActor.name}</span>
            <button
              className={styles.unassignBtn}
              onClick={() => onUnassign(character.character_id)}
              title="Remove"
            >x</button>
          </div>
        ) : (
          <div className={`${styles.dropZone} ${isOver ? styles.dropZoneOver : ""}`}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Drop actor
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtSelector({
  artList,
  selectedArtId,
  onSelectArt,
  selectedArt,
  characters,
  charsLoading,
  charsError,
  actors,
  assignments,
  assignedCount,
  totalCount,
  onAssign,
  onUnassign,
  onClearAll,
  dragOverId,
  setDragOverId,
}) {
  return (
    <div className={styles.panel}>

      <div className={styles.dropdownWrap}>
        <label className={styles.dropdownLabel}>Sequential Art</label>
        <div className={styles.selectWrap}>
          <select
            className={styles.select}
            value={selectedArtId ?? ""}
            onChange={e => onSelectArt(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">— Select a title —</option>
            {artList.map(art => (
              <option key={art.art_id} value={art.art_id}>
                [{art.type}] {art.title}
              </option>
            ))}
          </select>
          <svg className={styles.chevron} width="13" height="13" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {selectedArt && (
        <div className={styles.artMeta}>
          <div className={styles.artMetaLeft}>
            <span className={styles.artTitle}>{selectedArt.title}</span>
            {selectedArt.genre && (
              <span className={styles.artGenre}>{selectedArt.genre}</span>
            )}
          </div>
          <span
            className={styles.artTypeBadge}
            style={{
              background: `${TYPE_BADGE[selectedArt.type] || "#8a7a65"}18`,
              border: `1px solid ${TYPE_BADGE[selectedArt.type] || "#8a7a65"}50`,
              color: TYPE_BADGE[selectedArt.type] || "#8a7a65",
            }}
          >{selectedArt.type}</span>
        </div>
      )}

      {selectedArt && (
        <div className={styles.progress}>
          <div className={styles.progressMeta}>
            <span className={styles.progressLabel}>ROLES FILLED</span>
            <div className={styles.progressRight}>
              <span className={styles.progressCount}>{assignedCount} / {totalCount}</span>
              {assignedCount > 0 && (
                <button className={styles.clearBtn} onClick={onClearAll}>Clear all</button>
              )}
            </div>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${totalCount > 0 ? (assignedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {selectedArt && <div className={styles.divider} />}

      <div className={styles.charsHeader}>
        <h2 className={styles.charsTitle}>Characters</h2>
        {characters.length > 0 && (
          <span className={styles.charsCount}>{characters.length} roles</span>
        )}
      </div>

      {!selectedArt && (
        <div className={styles.emptyState}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ color: "var(--text-meta)", opacity: 0.35, marginBottom: 10 }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="13" x2="13" y2="13"/>
          </svg>
          <p className={styles.emptyMsg}>Select a sequential art above to load its characters</p>
        </div>
      )}

      {charsLoading && <p className={styles.stateMsg}>Loading characters…</p>}
      {charsError   && <p className={`${styles.stateMsg} ${styles.errorMsg}`}>{charsError}</p>}

      {selectedArt && !charsLoading && !charsError && characters.length === 0 && (
        <p className={styles.stateMsg}>No characters linked to this title yet.</p>
      )}

      {!charsLoading && !charsError && characters.length > 0 && (
        <div className={styles.slotList}>
          {characters.map(character => {
            const assignedActorId = assignments[character.character_id] ?? null;
            const assignedActor   = assignedActorId
              ? actors.find(a => a.actor_id === assignedActorId)
              : null;

            return (
              <CharacterSlot
                key={character.character_id}
                character={character}
                assignedActor={assignedActor}
                onAssign={onAssign}
                onUnassign={onUnassign}
                dragOverId={dragOverId}
                setDragOverId={setDragOverId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}