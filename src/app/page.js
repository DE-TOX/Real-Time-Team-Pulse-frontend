import { Sun, Zap, HeartPulse, TrendingUp, TrendingDown } from 'lucide-react';
import styles from './HomePage.module.css';

// This will be your public landing page
export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <div className={styles.headerIconWrapper}>
              <Zap size={24} />
            </div>
            <h1>Team Pulse Dashboard</h1>
          </div>
          <p className={styles.headerSubtitle}>
            Your team's wellness, refactored with CSS Modules.
          </p>
        </header>

        <div className={styles.cardGlass}>
          <div className={styles.glowEffect} aria-hidden="true" />
          <div className={styles.cardContent}>
            <h2 className={styles.headerTitle}>
              <HeartPulse color="var(--primary)" />
              Today's Vibe
            </h2>
            
            <div className={styles.metricGrid}>
              <div className={`${styles.metric} ${styles.positive}`}>
                <div className={`${styles.metricTitle} ${styles.positive}`}>
                  <TrendingUp size={16} />
                  Positive Sentiment
                </div>
                <p className={styles.metricValue}>82%</p>
              </div>

              <div className={`${styles.metric} ${styles.negative}`}>
                <div className={`${styles.metricTitle} ${styles.negative}`}>
                  <TrendingDown size={16} />
                  Stress Signals
                </div>
                <p className={styles.metricValue}>4%</p>
              </div>
            </div>

            <button className={styles.button}>
              <Sun size={18} />
              Sign In to Submit Check-in
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}