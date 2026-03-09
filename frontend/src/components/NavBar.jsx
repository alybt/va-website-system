import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

import styles from './navbar.module.css';

import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';  

const Navbar = () => {  
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();  
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>LOGO</div>

      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        <Link to="/scripts">Scripts</Link>
        <Link to="/dubbing">Dubbing</Link>

        <div className={styles.userSection}>
          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {user ? (
            <div className={styles.profileArea}>
              <img
                src={user?.pfp || 'https://via.placeholder.com/35'}
                className={styles.pfp}
                onClick={() => setShowDropdown(!showDropdown)}
                alt="Profile"
              />
              {showDropdown && (
                <div className={styles.dropdown}>
                  <a href="/settings">My Settings</a>
                  <button onClick={logout}>Logout</button>  
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