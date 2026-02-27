import React from 'react';
import styles from './ScriptCard.module.css';
import FavoriteButton from './FavoriteButton';
import { Clock, Music, ScrollText, Eye, User } from "lucide-react";

const GENRE_PALETTES = {
  Drama:    { bg: "#fff3e0", text: "#e65100", dot: "#ff6d00" },
  Comedy:   { bg: "#e8f5e9", text: "#1b5e20", dot: "#43a047" },
  Thriller: { bg: "#fce4ec", text: "#880e4f", dot: "#e91e63" },
  Default:  { bg: "#f3e5f5", text: "#4a148c", dot: "#9c27b0" },
};

const ScriptCard = ({ script = {}, userId }) => {
  const genre = script.genre || "Drama";
  const gStyle = GENRE_PALETTES[genre] || GENRE_PALETTES.Default;

  return (
    <div className={styles.card}> 
    
      <div className={styles.poster}>
        <div className={styles.paperOverlay} />
        <ScrollText size={60} color="rgba(212,175,95,0.2)" style={{ position: "absolute" }} />
        <h3 className={styles.posterTitle}>{script.title}</h3>

        <div className={styles.badgeContainer}>
          <span 
            className={styles.genreBadge} 
            style={{ backgroundColor: gStyle.bg, color: gStyle.text }}
          >
            <div className={styles.genreDot} style={{ backgroundColor: gStyle.dot }} />
            {genre}
          </span>
        </div>

        <div className={styles.favButton}>
          <FavoriteButton 
            scriptId={script.script_id} 
            userId={userId} 
            initialIsFavorited={script.is_user_favorite} 
          />
        </div>
      </div> 

      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className="flex items-center gap-1"><Clock size={13} /> {script.runtime_minutes}m</span>
          
          <span className={styles.divider}>|</span>
          <span className="flex items-center gap-1"><Music size={13} /> {script.recommended_music || "No Music"}</span>
          
          <span className={styles.divider}>|</span>
          <span className="flex items-center gap-1">Created by:  {script.created_by}</span>
        </div>

        <p className={styles.authorNote}>
          "{script.author_note || "No author notes available for this piece."}"
        </p>
      </div> 

      <div className={styles.footer}>
        <div className={styles.castInfo}>
          <User size={12} />
          <span>Cast: 1 Person</span>
        </div>

        <button 
          className={styles.readButton}
          onClick={() => window.location.href = `/scripts/${script.script_id}`}
        >
          READ SCRIPT <Eye size={14} />
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;