import React from 'react';
import styles from 'NavBarList.module.css';

const NavItem = ({userId}) => {
    const user_ID = userId;
    return (
    <div className={styles.navbar-nav}>
        <a className={styles.nav-item}>Home</a>
        <a className={styles.nav-item}>Scripts</a>
        <a className={styles.nav-item}>Comic Dubbing</a>
        <a className={styles.nav-item}></a>

    </div>);

}

export default NavItem;