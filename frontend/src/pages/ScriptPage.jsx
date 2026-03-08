import React, { useState } from 'react';
import ScriptCard from '../components/ScriptCard';
import ScriptFilter from '../components/ScriptFilter';
import styles from './ScriptPage.module.css';

const ScriptsPage = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = 1;

  return (
    <div className={styles.libraryWrapper}>

      <header className={styles.header}>
        <h1 className={styles.title}>Script Library</h1>
        <p className={styles.subtitle}>Explore curated scripts for your next performance</p>
      </header>

      <div className={styles.contentRow}>

        {/* Filter sidebar — owns the fetch, pushes results up */}
        <ScriptFilter
          userId={currentUserId}
          onResults={setScripts}
          onLoading={setLoading}
        />

        {/* Main grid */}
        <div className={styles.main}>
          {loading ? (
            <div className={styles.scriptGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard} />
              ))}
            </div>
          ) : scripts.length > 0 ? (
            <div className={styles.scriptGrid}>
              {scripts.map(script => (
                <ScriptCard
                  key={script.script_id}
                  script={script}
                  userId={currentUserId}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p>No scripts found in the library.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ScriptsPage;