import { useState } from "react";
import styles from "./ActorCard.module.css";

const GENDER_ICONS = {
    Male: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="10" cy="14" r="6"/><line x1="19" y1="5" x2="14.65" y2="9.35"/><polyline points="15 5 19 5 19 9"/>
        </svg>
    ),
    Female: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/>
        </svg>
    ),
    Other: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

export default function ActorCard({ actor, onEdit, onDelete }) {
    const { actor_id, name, gender, category } = actor;
    const catStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS["Extra"];
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Remove "${name}" from the roster?`)) return;
            setDeleting(true);
        try {
        await onDelete?.(actor_id);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={`${styles.card} ${deleting ? styles.deleting : ""}`}>

            <div className={styles.topRow}>
                <div className={styles.avatar}>
                    <span className={styles.avatarIcon}>
                        {GENDER_ICONS[gender] || GENDER_ICONS["Other"]}
                    </span>
                    <span className={styles.avatarLabel}>{gender || "—"}</span>
                </div> 

                <div className={styles.info}>
                    <div className={styles.name}>{name}</div>
                </div>
            </div>

            <div className={styles.divider} />
            
            <div className={styles.categoryRow}>
                <span className={styles.categoryLabel}>Category</span>
                <span
                    className={styles.categoryBadge}
                    style={{
                        background: catStyle.bg,
                        border: `1px solid ${catStyle.border}`,
                        color: catStyle.text,
                    }}
                >{category || "—"}</span>
            </div>

            <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => onEdit?.(actor)}>
                    Edit
                </button>
                <button
                    className={styles.btnDelete}
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "…" : "Delete"}
                </button>
            </div>
        </div>
    );
}