import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ScriptCard from '../components/ScriptCard';
import styles from './ScriptPage.module.css'; 

const ScriptsPage = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const currentUserId = 1; 

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await api.get(`/scripts?user_id=${currentUserId}`);
        setScripts(response.data ?? []);
      } catch (err) {
        console.error("Failed to fetch scripts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScripts();
  }, []);

  if (loading) return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Opening the Archives...</p>
    </div>
  );

  {Array.isArray(scripts) && scripts.length > 0 ? (
    scripts.map(script => (
            <ScriptCard 
              key={script.script_id} 
              script={script} 
              userId={currentUserId} 
            />
          ))
  ) : (
    <div>No scripts found</div>
  )}

  return (
    <div className={styles.libraryWrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Script Library</h1>
        <p className={styles.subtitle}>Explore curated scripts for your next performance</p>
      </header>

      <div className={styles.scriptGrid}>
        {scripts.length > 0 ? (
          scripts.map(script => (
            <ScriptCard 
              key={script.script_id} 
              script={script} 
              userId={currentUserId} 
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>No scripts found in the library.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptsPage;