'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './page.module.css';

export default function AuraThemeDemo() {
  const [isDark, setIsDark] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
       // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={styles.main}>
      {/* Theme Toggle Button */}
      <button 
        className={styles.themeToggle} 
        onClick={toggleTheme}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Auth Button */}
      <div style={{ 
        position: 'fixed', 
        top: '2rem', 
        left: '2rem', 
        zIndex: 1000 
      }}>
        {user ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.875rem'
          }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              {user.email}
            </span>
            <button 
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--negative)',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <a 
            href="/auth" 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--primary)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: 'var(--radius-full)',
              fontWeight: '600',
              fontSize: '0.875rem',
              transition: 'var(--transition-fast)'
            }}
          >
            🔐 Sign In
          </a>
        )}
      </div>
            <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>
            <div className={styles.headerIconWrapper}>
              ✨
            </div>
            Team Pulse Dashboard
          </h1>
          <p className={styles.headerSubtitle}>
            Illuminating your team's wellness with light, clarity, and subtle energy. 
            Experience the weightless, transparent UI that makes insights glow.
            {user && (
              <span style={{ 
                display: 'block', 
                marginTop: '0.5rem',
                color: 'var(--positive)',
                fontWeight: '500'
              }}>
                ✅ Authentication working! Welcome, {user.email}
              </span>
            )}
          </p>
        </header>

        {/* Main Dashboard Card */}
        <div className={styles.cardGlass}>
          <div className={styles.glowEffect} />
          <div className={styles.cardContent}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '0.5rem',
              color: 'var(--text-primary)'
            }}>
              Real-Time Team Metrics
            </h2>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '1.5rem' 
            }}>
              Live insights into your team's wellness and productivity
            </p>

            {/* Metrics Grid */}
            <div className={styles.metricGrid}>
              <div className={`${styles.metric} ${styles.positive}`}>
                <div className={`${styles.metricTitle} ${styles.positive}`}>
                  <span>📈</span>
                  Team Happiness
                </div>
                <div className={styles.metricValue}>94%</div>
              </div>

              <div className={`${styles.metric} ${styles.positive}`}>
                <div className={`${styles.metricTitle} ${styles.positive}`}>
                  <span>⚡</span>
                  Energy Level
                </div>
                <div className={styles.metricValue}>87%</div>
              </div>

              <div className={`${styles.metric} ${styles.positive}`}>
                <div className={`${styles.metricTitle} ${styles.positive}`}>
                  <span>👥</span>
                  Participation
                </div>
                <div className={styles.metricValue}>12/14</div>
              </div>

              <div className={`${styles.metric} ${styles.negative}`}>
                <div className={`${styles.metricTitle} ${styles.negative}`}>
                  <span>⏰</span>
                  Burnout Risk
                </div>
                <div className={styles.metricValue}>Low</div>
              </div>
            </div>

            <button className={styles.button}>
              <span>📊</span>
              View Detailed Analytics
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ 
          marginTop: '3rem', 
          display: 'grid', 
          gap: '2rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
        }}>
          <div className={styles.cardGlass}>
            <div className={styles.glowEffect} />
            <div className={styles.cardContent}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--positive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  ✓
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  Quick Check-ins
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Submit daily mood and energy levels in seconds with voice or text input.
              </p>
            </div>
          </div>
          <div className={styles.cardGlass}>
            <div className={styles.glowEffect} />
            <div className={styles.cardContent}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                marginBottom: '1rem' 
              }}>
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  🤖
                </div>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  color: 'var(--text-primary)'
                }}>
                  AI Insights
                </h3>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Smart recommendations powered by advanced sentiment analysis and ML.
              </p>
            </div>
          </div>
        </div>

        {/* Auth Status Card */}
        <div className={styles.cardGlass} style={{ marginTop: '3rem' }}>
          <div className={styles.glowEffect} />
          <div className={styles.cardContent}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Authentication Status
            </h3>
            {user ? (
              <div>
                <p style={{ 
                  color: 'var(--positive)', 
                  marginBottom: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: '500'
                }}>
                  ✅ Successfully authenticated!
                </p>
                <div style={{ 
                  padding: '1rem',
                  backgroundColor: 'var(--positive-surface)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem'
                }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    <strong>Email:</strong> {user.email}<br/>
                    <strong>User ID:</strong> {user.id}<br/>
                    <strong>Verified:</strong> {user.email_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>
                <a href="/auth" style={{ 
                  color: 'var(--primary)', 
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  → View full auth details
                </a>
              </div>
            ) : (
              <div>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  marginBottom: '1rem' 
                }}>
                  Ready to test authentication! Click the button above to sign in or create an account.
                </p>
                <a href="/auth" className={styles.button}>
                  🔐 Test Authentication
                </a>
              </div>
            )}
          </div>
        </div>
        {/* Theme Demo Section */}
        <div className={styles.cardGlass} style={{ marginTop: '3rem' }}>
          <div className={styles.glowEffect} />
          <div className={styles.cardContent}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Aura Design System
            </h3>
            <p style={{ 
              color: 'var(--text-secondary)', 
              marginBottom: '2rem' 
            }}>
              A complete design system built around light, clarity, and subtle energy. 
              Toggle between light and dark modes to see the seamless transitions.
            </p>
<div style={{ 
              display: 'grid', 
              gap: '1rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              marginTop: '1.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  💎
                </div> 
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}> 
                  Glassmorphism 
                </h4>
                 <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)' 
                }}>
                  Frosted glass effects with backdrop blur
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  ✨
                </div>
                <h4 style={{ 
                  color: 'var(--text-primary)', 
                  marginBottom: '0.25rem' 
                }}>
                  Glow Effects
                </h4>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)' 
                }}>
                  Subtle glows behind key metrics
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '4rem',
                  height: '4rem',
                  margin: '0 auto 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--positive)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem'
                }}>
                  🔐
                </div>
                <h4 style={{ 
                  color: 'var(--text-primary)', 
                  marginBottom: '0.25rem' 
                }}>
                  Authentication
                </h4>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)' 
                }}>
                  Secure auth with Supabase integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}                  