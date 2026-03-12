import { useState } from "react";

const GENDER_ICONS = {
  Male: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="14" r="6"/><line x1="19" y1="5" x2="14.65" y2="9.35"/><polyline points="15 5 19 5 19 9"/>
    </svg>
  ),
  Female: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/>
    </svg>
  ),
  Other: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="6"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    </svg>
  ),
};

const CATEGORY_COLORS = {
  "Main Cast":  { bg: "rgba(212,175,95,0.15)",  border: "rgba(212,175,95,0.5)",  text: "#c49a48" },
  "Extra":      { bg: "rgba(100,120,160,0.12)", border: "rgba(100,120,160,0.4)", text: "#7a9acc" },
  "Minor Role": { bg: "rgba(160,100,120,0.12)", border: "rgba(160,100,120,0.4)", text: "#c47a8a" },
  "Kid":        { bg: "rgba(80,160,120,0.12)",  border: "rgba(80,160,120,0.4)",  text: "#5aaa88" },
  "Any":        { bg: "rgba(140,110,80,0.12)",  border: "rgba(140,110,80,0.4)",  text: "#8a7a65" },
};

function ActorAvatar({ gender, size = 64 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg, var(--bg-poster-from), var(--bg-poster-to))",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      flexShrink: 0,
      border: "2px solid var(--border-card)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
    }}>
      <span style={{ color: "var(--text-poster)", lineHeight: 1 }}>
        {GENDER_ICONS[gender] || GENDER_ICONS["Other"]}
      </span>
      <span style={{
        fontFamily: "'Lora', serif",
        fontSize: 9,
        color: "var(--text-poster)",
        opacity: 0.75,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        lineHeight: 1,
      }}>{gender || "—"}</span>
    </div>
  );
}

export default function ActorCard({ actor, onEdit, onDelete }) {
  const { name, gender, category, actor_id } = actor;
  const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS["Any"];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        borderRadius: 14,
        boxShadow: hovered ? "var(--shadow-hover)" : "var(--shadow-card)",
        padding: "20px 20px 16px",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.28s ease, transform 0.22s ease",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        cursor: "default",
        minWidth: 220,
        maxWidth: 280,
        fontFamily: "'Lora', serif",
      }}
    >
      {/* Top row: avatar + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <ActorAvatar gender={gender} size={64} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text-body)",
            lineHeight: 1.3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{name}</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border-card)", marginBottom: 13 }} />

      {/* Category row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{
          fontSize: 11,
          color: "var(--text-meta)",
          textTransform: "uppercase",
          letterSpacing: "0.09em",
        }}>Category</span>

        <span style={{
          background: catStyle.bg,
          border: `1px solid ${catStyle.border}`,
          color: catStyle.text,
          borderRadius: 20,
          padding: "3px 11px",
          fontSize: 11.5,
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}>{category || "—"}</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => onEdit && onEdit(actor)}
          style={{
            flex: 1,
            background: "var(--btn-bg)",
            color: "var(--btn-text)",
            border: "none",
            borderRadius: 8,
            padding: "8px 0",
            fontFamily: "'Lora', serif",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: "background 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--btn-bg-hover)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--btn-bg)"}
        >Edit</button>

        <button
          onClick={() => onDelete && onDelete(actor_id)}
          style={{
            flex: 1,
            background: "transparent",
            color: "var(--text-meta)",
            border: "1px solid var(--border-card)",
            borderRadius: 8,
            padding: "8px 0",
            fontFamily: "'Lora', serif",
            fontSize: 12.5,
            fontWeight: 600,
            letterSpacing: "0.04em",
            cursor: "pointer",
            transition: "border-color 0.18s, color 0.18s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#c47a7a";
            e.currentTarget.style.color = "#c47a7a";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border-card)";
            e.currentTarget.style.color = "var(--text-meta)";
          }}
        >Delete</button>
      </div>
    </div>
  );
}