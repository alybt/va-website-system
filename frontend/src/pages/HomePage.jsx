import React from 'react'
import styles from './HomePage.module.css'
import { Link } from 'lucide-react';

const Homepage = () => {
    return (
        <div className={styles.container}>
            {/* HERO SECTION */}
            <header className={styles.container}>
                <h1 className={styles.title}> Comic Dubbing And Scripts </h1>
                <p className={styles.subtitle}>
                    Sanctuary for the writers, and organize the chaos of story telling.
                </p>
                <div className={styles.buttonGroup}>
                    <Link title= "Go to Scripts" to="/scripts" className={styles.primaryBtn}>
                        View Scripts
                    </Link>
                    <Link title= "Learn More" to="/register" className={styles.secondaryBtn}>
                        Join Us
                    </Link>                    
                </div>
            </header>

            <section className= {styles.contentSection}>
                <div className= {styles.card}>
                    <h2 className= {styles.sectionHeading}> 
                        The Vision
                    </h2>
                    <p className= {styles.bodyText}>
                        I built this platform because most of the hosting that I'm in whenever doing a readings or just a basic comic dubbing. Sometimes they are unorganize and too many tabs.
                    </p>
                    <p className={styles.bodyText}>
                        Whether you are drafting a screenplay or managing theater scripts, 
                        the goal was to focus on the words, not the interface.
                    </p>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.featureItem}>
                    <h3>Elegant Design</h3>
                    <p>Carefully crafted sepia-toned UI to reduce eye strain during long writing sessions.</p>
                </div>
                <div className={styles.featureItem}>
                    <h3>Secure Storage</h3>
                    <p>Your narratives are private, encrypted, and safe within our digital vaults.</p>
                </div>
                <div className={styles.featureItem}>
                    <h3>Seamless Workflow</h3>
                    <p>Transition from a rough idea to a finished draft with intuitive navigation.</p>
                </div>
            </section>

            <footer className={styles.footer}>
                <p>© 2024 Script Vault | Designed for the Modern Storyteller</p>
            </footer>
        </div> 
    )
};

export default HomePage;
