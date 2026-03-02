import React, { useState, useEffect } from 'react';
import styles from './navbar.module.css';

const Navbar = ({ isLoggedIn, userPfp }) => {
  const [theme, setTheme] = useState('light');
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>LOGO</div>

      <div className={styles.navLinks}>
        <a href="/">Home</a>
        <a href="/scripts">Scripts</a>
        <a href="/dubbing">Dubbing</a>

        <div className={styles.userSection}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {isLoggedIn ? (
            <div className={styles.profileArea}>
              <img 
                src={userPfp} 
                className={styles.pfp} 
                onClick={() => setShowDropdown(!showDropdown)} 
                alt="Profile"
              />
              {showDropdown && (
                <div className={styles.dropdown}>
                  <a href="/settings">My Settings</a>
                  <a href="/logout">Logout</a>
                </div>
              )}
            </div>
          ) : (
            <a href="/login">Login</a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;