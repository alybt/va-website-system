
import { useState } from "react";
import styles from "./CharacterCard.module.css";

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

const ROLE_STYLES = {
    "Main Cast":  { bg: "rgba(212,175,95,0.15)",  border: "rgba(212,175,95,0.45)",  text: "#c49a48" },
    "Supporting": { bg: "rgba(100,120,180,0.12)", border: "rgba(100,120,180,0.4)",  text: "#7a9acc" },
    "Extra":      { bg: "rgba(130,100,160,0.12)", border: "rgba(130,100,160,0.4)",  text: "#a07acc" },
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function CharacterAvatar({ gender, pic }) {
    const [imgErr, setImgErr] = useState(false);
    const src = pic && !imgErr ? `${BASE_URL}/uploads/${pic}` : null;

    if (src) {
        return (
            <img
                src={src}
                alt=""
                className={styles.avatarImg}
                onError={() => setImgErr(true)}
            />
        );
    }

    return (
        <div className={styles.avatar}>
            <span className={styles.avatarIcon}>
                {GENDER_ICONS[gender] || GENDER_ICONS["Other"]}
            </span>
            <span className={styles.avatarLabel}>{gender || "—"}</span>
        </div>
    );
}

export default function CharacterCard({ character, onEdit, onDelete }) {
    const { character_id, name, gender, age, description, role, pic } = character;
    const roleStyle = ROLE_STYLES[role] || ROLE_STYLES["Extra"];
    const [expanded, setExpanded] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Remove character "${name}"?`)) return;
        setDeleting(true);
        try {
            await onDelete?.(character_id);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className={`${styles.card} ${deleting ? styles.deleting : ""}`}>
            <div className={styles.topRow}>
                <CharacterAvatar gender={gender} pic={pic} />
                <div className={styles.info}>
                    <div className={styles.name}>{name}</div>
                        {age != null && (
                            <div className={styles.ageBadge}>
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                </svg>
                                <span>Age {age}</span>
                            </div>
                        )}
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.roleRow}>
                <span className={styles.roleLabel}>Role</span>
                <span
                    className={styles.roleBadge}
                    style={{
                        background: roleStyle.bg,
                        border: `1px solid ${roleStyle.border}`,
                        color: roleStyle.text,
                    }}
                >{role || "—"}</span>
            </div>

            {description && (
                <div className={styles.descriptionWrap}>
                    <div className={`${styles.descriptionText} ${expanded ? styles.expanded : ""}`}>
                        "{description}"
                    </div>
                {description.length > 80 && (
                    <button
                        className={styles.readMore}
                        onClick={() => setExpanded(p => !p)}
                        >
                        {expanded ? "Show less" : "Read more"}
                    </button>
                )}
                </div>
            )}

            <div className={styles.actions}>
                <button className={styles.btnEdit} onClick={() => onEdit?.(character)}>
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