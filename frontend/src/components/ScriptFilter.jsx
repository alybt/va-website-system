import { useState, useEffect } from 'react';
import api from '../api/axios';
import styles from './ScriptFilter.module.css';


function RangeSlider({ min, max, value, onChange, format }) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className={styles.sliderWrap}>
            <span className={styles.sliderValue}>{format(value)}</span>
            <div className={styles.track}>
                <div className={styles.trackFill} style={{ width: `${pct}%` }} />
                <input
                    type="range" min={min} max={max} value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className={styles.rangeInput}
                />
                <div className={styles.thumb} style={{ left: `${pct}%` }} />
            </div>
            <div className={styles.trackLabels}>
                <span>{format(min)}</span>
                <span>{format(max)}</span>                
            </div>
        </div>
    );
}


export default function ScriptFilter({ onResults, onLoading, userId = 0 }) {
    const [search,     setSearch]     = useState('');
    const [debouncedQ, setDebouncedQ] = useState('');
    const [maxRuntime, setMaxRuntime] = useState(180);
    const [maxCast,    setMaxCast]    = useState(50);
    const [genre,      setGenre]      = useState('');
    const [authorId,   setAuthorId]   = useState(null);

    const [genres,     setGenres]     = useState([]);
    const [authors,    setAuthors]    = useState([]);
    const [isOpen,     setIsOpen]     = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedQ(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        api.get('/scripts/meta')
        .then(r => {
            setGenres(r.data.genres   ?? []);
            setAuthors(r.data.authors ?? []);
        })
        .catch(() => {});
    }, []);

    useEffect(() => {
        onLoading(true);

        const params = new URLSearchParams(); 
        if (debouncedQ)        params.set('search',      debouncedQ);
        if (genre)             params.set('genre',       genre);
        if (authorId)          params.set('created_by',  authorId);
        if (maxRuntime < 180)  params.set('max_runtime', maxRuntime);
        if (maxCast    < 50)   params.set('max_cast',    maxCast);

        api.get(`/scripts?${params.toString()}`)
            .then(r => onResults(r.data.data ?? r.data ?? []))
            .catch(() => onResults([]))
            .finally(() => onLoading(false));
    }, [debouncedQ, genre, authorId, maxRuntime, maxCast, userId]);

    const hasFilters = genre || authorId || maxRuntime < 180 || maxCast < 50 || search.trim();

    const clearAll = () => {
        setSearch(''); setGenre(''); setAuthorId(null);
        setMaxRuntime(180); setMaxCast(50);
    };

    const panel = (
        <div className={styles.panel}>

        <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Filters</span>
            {hasFilters && (
            <button className={styles.clearBtn} onClick={clearAll}>Clear all</button>
            )}
        </div>

        <div className={styles.section}>
            <label className={styles.sectionLabel}>Search</label>
            <input
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Title keyword…"
            />
        </div>

        <div className={styles.section}>
            <label className={styles.sectionLabel}>Max Runtime</label>
            <RangeSlider min={30} max={180} value={maxRuntime} onChange={setMaxRuntime} format={v => `${v} min`} />
        </div>

        <div className={styles.section}>
            <label className={styles.sectionLabel}>Max Cast Size</label>
            <RangeSlider min={1} max={50} value={maxCast} onChange={setMaxCast} format={v => `${v} roles`} />
        </div>

        {genres.length > 0 && (
            <div className={styles.section}>
                <label className={styles.sectionLabel}>Genre</label>
                <div className={styles.chipGrid}>
                    {genres.map(g => (
                        <button
                        key={g}
                        className={`${styles.chip} ${genre === g ? styles.chipActive : ''}`}
                        onClick={() => setGenre(prev => prev === g ? '' : g)}
                        >{g}</button>
                    ))}
                </div>
            </div>
        )}

        {authors.length > 0 && (
            <div className={styles.section}>
                <label className={styles.sectionLabel}>Author</label>
                    {authors.map(a => (
                        <label key={a.user_id} className={styles.checkRow}>
                        <span className={`${styles.checkbox} ${authorId === a.user_id ? styles.checkboxChecked : ''}`}>
                            {authorId === a.user_id && (
                                <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                                    <path d="M1 3.5L3 5.5L7 1" stroke="var(--btn-text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </span>
                        <input
                            type="checkbox"
                            checked={authorId === a.user_id}
                            onChange={() => setAuthorId(prev => prev === a.user_id ? null : a.user_id)}
                            className={styles.hiddenInput}
                        /> 
                        <span className={`${styles.checkLabel} ${authorId === a.user_id ? styles.checkLabelActive : ''}`}>
                            {a.username}
                        </span>
                </label>
            ))}
            </div>
        )} 
        </div>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <button
                className={styles.mobileToggle}
                onClick={() => setIsOpen(o => !o)}
            >
                {isOpen ? '✕ Close' : '⚙ Filters'}{hasFilters ? ' ·' : ''}
            </button>

            <aside className={styles.sidebar}>{panel}</aside>

            {isOpen && <div className={styles.drawer}>{panel}</div>}
        </>
    );
}