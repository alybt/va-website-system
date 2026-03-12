import { useState } from "react";
import ActorCard from "../components/ActorCard"; 
const DEMO_ART = [
  {
    art_id: 1,
    title: "Celestial Blade",
    genre: "Action / Fantasy",
    type: "Manhwa",
    characters: [
      { character_id: 1, name: "Kael Dawnborn",  gender: "Male",   role: "Main Cast",   assigned_actor: null },
      { character_id: 2, name: "Seraphine",       gender: "Female", role: "Main Cast",   assigned_actor: null },
      { character_id: 3, name: "Elder Voss",      gender: "Male",   role: "Supporting",  assigned_actor: null },
      { character_id: 4, name: "Child Wanderer",  gender: "Other",  role: "Extra",       assigned_actor: null },
    ],
  },
  {
    art_id: 2,
    title: "Neon Requiem",
    genre: "Cyberpunk / Drama",
    type: "Webtoon",
    characters: [
      { character_id: 5, name: "Aria-7",          gender: "Female", role: "Main Cast",   assigned_actor: null },
      { character_id: 6, name: "Dirk Hollowell",  gender: "Male",   role: "Supporting",  assigned_actor: null },
    ],
  },
];

const DEMO_ACTORS = [
  { actor_id: 1, name: "Elena Marchetti",  gender: "Female", category: "Main Cast"  },
  { actor_id: 2, name: "James Whitmore",   gender: "Male",   category: "Minor Role" },
  { actor_id: 3, name: "Sam Reyes",        gender: "Other",  category: "Extra"      },
  { actor_id: 4, name: "Olivia Chen",      gender: "Female", category: "Kid"        },
  { actor_id: 5, name: "Daniel Brooks",    gender: "Male",   category: "Main Cast"  },
  { actor_id: 6, name: "Mira Santos",      gender: "Female", category: "Extra"      },
];

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

// ── CharacterRow ──────────────────────────────────────────────────────────────
function CharacterRow({ character, actors, onAssign, onUnassign, dragOverId, setDragOverId }) {
  const roleStyle = ROLE_COLORS[character.role] || ROLE_COLORS["Extra"];
  const assigned = character.assigned_actor
    ? actors.find(a => a.actor_id === character.assigned_actor)
    : null;
  const isOver = dragOverId === character.character_id;

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragOverId(character.character_id); }}
      onDragLeave={() => setDragOverId(null)}
      onDrop={e => {
        e.preventDefault();
        setDragOverId(null);
        const actorId = parseInt(e.dataTransfer.getData("actorId"));
        onAssign(character.character_id, actorId);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 10,
        border: isOver
          ? "1.5px dashed var(--accent)"
          : "1px solid var(--border-card)",
        background: isOver ? "rgba(212,175,95,0.06)" : "var(--bg-card)",
        transition: "border 0.18s, background 0.18s",
        marginBottom: 8,
      }}
    >
      {/* Character info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 13.5,
            fontWeight: 700,
            color: "var(--text-body)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{character.name}</span>
          <span style={{ color: "var(--text-meta)", flexShrink: 0 }}>
            {GENDER_ICONS[character.gender]}
          </span>
        </div>
        <span style={{
          display: "inline-block",
          background: roleStyle.bg,
          border: `1px solid ${roleStyle.border}`,
          color: roleStyle.text,
          borderRadius: 20,
          padding: "1px 8px",
          fontSize: 10.5,
          fontFamily: "'Lora', serif",
          fontWeight: 600,
          letterSpacing: "0.03em",
        }}>{character.role}</span>
      </div>

      {/* Assignment slot */}
      <div style={{ flexShrink: 0, minWidth: 140 }}>
        {assigned ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg-footer)",
            border: "1px solid var(--border-footer)",
            borderRadius: 8,
            padding: "5px 10px",
          }}>
            <span style={{
              fontFamily: "'Lora', serif",
              fontSize: 12,
              color: "var(--text-body)",
              flex: 1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>{assigned.name}</span>
            <button
              onClick={() => onUnassign(character.character_id)}
              title="Remove assignment"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-meta)",
                padding: 0,
                lineHeight: 1,
                fontSize: 14,
                flexShrink: 0,
              }}
            >×</button>
          </div>
        ) : (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            border: "1.5px dashed var(--border-card)",
            borderRadius: 8,
            padding: "6px 12px",
            color: "var(--text-meta)",
            fontFamily: "'Lora', serif",
            fontSize: 11,
            letterSpacing: "0.04em",
            opacity: isOver ? 1 : 0.6,
            transition: "opacity 0.18s",
          }}>
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

// ── DraggableActorCard ────────────────────────────────────────────────────────
function DraggableActorCard({ actor, isAssigned, onEdit, onDelete }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData("actorId", actor.actor_id);
        setDragging(true);
      }}
      onDragEnd={() => setDragging(false)}
      style={{
        opacity: dragging ? 0.45 : isAssigned ? 0.55 : 1,
        cursor: "grab",
        transition: "opacity 0.18s",
        position: "relative",
      }}
    >
      {isAssigned && (
        <div style={{
          position: "absolute",
          top: 8, right: 8,
          background: "rgba(90,170,136,0.2)",
          border: "1px solid rgba(90,170,136,0.5)",
          color: "#5aaa88",
          borderRadius: 20,
          padding: "1px 8px",
          fontSize: 9.5,
          fontFamily: "'Lora', serif",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          zIndex: 2,
        }}>Assigned</div>
      )}
      <ActorCard actor={actor} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

// ── Main DubbingPage ──────────────────────────────────────────────────────────
export default function DubbingPage() {
  const [artList] = useState(DEMO_ART);
  const [actors, setActors] = useState(DEMO_ACTORS);
  const [selectedArtId, setSelectedArtId] = useState(DEMO_ART[0].art_id);
  const [assignments, setAssignments] = useState({}); // { character_id: actor_id }
  const [actorSearch, setActorSearch] = useState("");
  const [dragOverId, setDragOverId] = useState(null);

  const selectedArt = artList.find(a => a.art_id === selectedArtId);
  const assignedActorIds = new Set(Object.values(assignments));

  const filteredActors = actors.filter(a =>
    a.name.toLowerCase().includes(actorSearch.toLowerCase()) ||
    a.category.toLowerCase().includes(actorSearch.toLowerCase()) ||
    a.gender.toLowerCase().includes(actorSearch.toLowerCase())
  );

  const handleAssign = (characterId, actorId) => {
    setAssignments(prev => ({ ...prev, [characterId]: actorId }));
  };

  const handleUnassign = (characterId) => {
    setAssignments(prev => {
      const next = { ...prev };
      delete next[characterId];
      return next;
    });
  };

  const handleClearAll = () => setAssignments({});

  const charactersWithAssignments = selectedArt?.characters.map(c => ({
    ...c,
    assigned_actor: assignments[c.character_id] ?? null,
  })) || [];

  const assignedCount = charactersWithAssignments.filter(c => c.assigned_actor).length;
  const totalCount = charactersWithAssignments.length;

  return (
    <div className="app-container" style={{ padding: "36px 32px", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28,
          fontWeight: 700,
          color: "var(--text-body)",
          lineHeight: 1.2,
          marginBottom: 4,
        }}>Dubbing Session</div>
        <div style={{
          fontFamily: "'Lora', serif",
          fontSize: 13,
          color: "var(--text-meta)",
          letterSpacing: "0.01em",
        }}>Drag actors onto character roles to assign them temporarily</div>
      </div>

      {/* ── Art Selector Tabs ── */}
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 28,
        flexWrap: "wrap",
      }}>
        {artList.map(art => (
          <button
            key={art.art_id}
            onClick={() => { setSelectedArtId(art.art_id); setAssignments({}); }}
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 13,
              fontWeight: selectedArtId === art.art_id ? 700 : 400,
              padding: "8px 18px",
              borderRadius: 20,
              border: selectedArtId === art.art_id
                ? "1.5px solid var(--accent)"
                : "1px solid var(--border-card)",
              background: selectedArtId === art.art_id
                ? "var(--btn-bg)"
                : "var(--bg-card)",
              color: selectedArtId === art.art_id
                ? "var(--btn-text)"
                : "var(--text-meta)",
              cursor: "pointer",
              transition: "all 0.18s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 10,
              background: TYPE_BADGE[art.type]
                ? `${TYPE_BADGE[art.type]}22`
                : "rgba(140,110,80,0.1)",
              border: `1px solid ${TYPE_BADGE[art.type] || "#8a7a65"}55`,
              color: TYPE_BADGE[art.type] || "#8a7a65",
              letterSpacing: "0.04em",
            }}>{art.type}</span>
            {art.title}
          </button>
        ))}
      </div>

      {/* ── Two-Column Layout ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        alignItems: "start",
      }}>

        {/* ── LEFT: Sequential Art Info + Character Roles ── */}
        <div>
          {/* Art info card */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: 14,
            padding: "20px 22px",
            marginBottom: 18,
            boxShadow: "var(--shadow-card)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "var(--text-body)",
                  marginBottom: 4,
                }}>{selectedArt?.title}</div>
                <div style={{
                  fontFamily: "'Lora', serif",
                  fontSize: 12.5,
                  color: "var(--text-meta)",
                  fontStyle: "italic",
                }}>{selectedArt?.genre}</div>
              </div>
              <span style={{
                fontFamily: "'Lora', serif",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
                background: `${TYPE_BADGE[selectedArt?.type] || "#8a7a65"}18`,
                border: `1px solid ${TYPE_BADGE[selectedArt?.type] || "#8a7a65"}50`,
                color: TYPE_BADGE[selectedArt?.type] || "#8a7a65",
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}>{selectedArt?.type}</span>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 14 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
                fontFamily: "'Lora', serif",
                fontSize: 11,
                color: "var(--text-meta)",
                letterSpacing: "0.04em",
              }}>
                <span>ROLES FILLED</span>
                <span style={{ color: "var(--text-body)", fontWeight: 600 }}>{assignedCount} / {totalCount}</span>
              </div>
              <div style={{
                height: 5,
                borderRadius: 3,
                background: "var(--border-card)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: `${totalCount > 0 ? (assignedCount / totalCount) * 100 : 0}%`,
                  background: "linear-gradient(90deg, var(--btn-bg), var(--accent))",
                  borderRadius: 3,
                  transition: "width 0.4s ease",
                }} />
              </div>
            </div>
          </div>

          {/* Characters list */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: 14,
            padding: "18px 18px",
            boxShadow: "var(--shadow-card)",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 15,
                fontWeight: 700,
                color: "var(--text-body)",
              }}>Characters & Roles</div>
              {assignedCount > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 11,
                    color: "#c47a7a",
                    background: "none",
                    border: "1px solid rgba(196,122,122,0.3)",
                    borderRadius: 6,
                    padding: "3px 10px",
                    cursor: "pointer",
                    letterSpacing: "0.03em",
                  }}
                >Clear all</button>
              )}
            </div>

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

        {/* ── RIGHT: Actor Pool ── */}
        <div>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: 14,
            padding: "18px 18px",
            boxShadow: "var(--shadow-card)",
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-body)",
              marginBottom: 14,
            }}>Actor Pool</div>

            {/* Search */}
            <div style={{
              position: "relative",
              marginBottom: 16,
            }}>
              <svg
                width="13" height="13"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-meta)" }}
              >
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search actors…"
                value={actorSearch}
                onChange={e => setActorSearch(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "var(--bg-footer)",
                  border: "1px solid var(--border-card)",
                  borderRadius: 8,
                  padding: "8px 12px 8px 30px",
                  fontFamily: "'Lora', serif",
                  fontSize: 13,
                  color: "var(--text-body)",
                  outline: "none",
                }}
              />
            </div>

            {/* Hint */}
            <div style={{
              fontFamily: "'Lora', serif",
              fontSize: 11,
              color: "var(--text-meta)",
              marginBottom: 14,
              fontStyle: "italic",
              letterSpacing: "0.02em",
            }}>Drag a card onto a character role to assign</div>

            {/* Actor cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 14,
            }}>
              {filteredActors.map(actor => (
                <DraggableActorCard
                  key={actor.actor_id}
                  actor={actor}
                  isAssigned={assignedActorIds.has(actor.actor_id)}
                  onEdit={(a) => alert(`Edit: ${a.name}`)}
                  onDelete={(id) => setActors(prev => prev.filter(a => a.actor_id !== id))}
                />
              ))}
              {filteredActors.length === 0 && (
                <div style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: "32px 0",
                  fontFamily: "'Lora', serif",
                  fontSize: 13,
                  color: "var(--text-meta)",
                  fontStyle: "italic",
                }}>No actors found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}