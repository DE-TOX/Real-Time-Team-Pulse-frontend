'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styles from './DashboardHeader.module.css';

// Page titles mapping
const pageTitles = {
  '/dashboard': 'Overview',
  '/dashboard/checkins': 'Check-ins',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/insights': 'Insights',
  '/dashboard/teams': 'Teams',
  '/dashboard/settings': 'Settings'
};

export default function DashboardHeader({ user, onMenuClick, sidebarOpen }) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState('');
  const [greeting, setGreeting] = useState('');

  // Update time and greeting
  useEffect(() => {
    const updateTimeAndGreeting = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const hour = now.getHours();
      let greetingText = '';
      if (hour < 12) greetingText = 'Good morning';
      else if (hour < 17) greetingText = 'Good afternoon';
      else greetingText = 'Good evening';

      setCurrentTime(timeString);
      setGreeting(greetingText);
    };

    updateTimeAndGreeting();
    const interval = setInterval(updateTimeAndGreeting, 1000);
    return () => clearInterval(interval);
  }, []);

  // Get current page title
  const pageTitle = pageTitles[pathname] || 'Dashboard';

  // Get user's display name
  const displayName = user?.user_metadata?.full_name ||
                     user?.email?.split('@')[0] ||
                     'Team Member';

  // Toggle theme function
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className={styles.menuButton}
          aria-label="Open navigation menu"
        >
          <span className={styles.menuIcon}>
            {sidebarOpen ? '✕' : '☰'}
          </span>
        </button>

        {/* Page Title & Breadcrumb */}
        <div className={styles.titleSection}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>
          {pathname !== '/dashboard' && (
            <div className={styles.breadcrumb}>
              <span>Dashboard</span>
              <span className={styles.breadcrumbDivider}>→</span>
              <span className={styles.breadcrumbCurrent}>{pageTitle}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.headerRight}>
        {/* Time & Greeting */}
        <div className={styles.timeSection}>
          <div className={styles.greeting}>
            {greeting}, {displayName.split(' ')[0]}!
          </div>
          <div className={styles.currentTime}>{currentTime}</div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={styles.themeToggle}
          aria-label="Toggle theme"
          title="Toggle dark/light mode"
        >
          <span className={styles.themeIcon}>🌙</span>
        </button>

        {/* Notifications Button */}
        <button
          className={styles.notificationButton}
          aria-label="View notifications"
          title="Notifications"
        >
          <span className={styles.notificationIcon}>🔔</span>
          <span className={styles.notificationBadge}>3</span>
        </button>

        {/* User Menu */}
        <div className={styles.userMenu}>
          <div className={styles.userAvatar}>
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userMenuDropdown}>
            <div className={styles.userMenuHeader}>
              <div className={styles.userMenuName}>{displayName}</div>
              <div className={styles.userMenuEmail}>{user?.email}</div>
            </div>
            <div className={styles.userMenuActions}>
              <button className={styles.userMenuAction}>Profile</button>
              <button className={styles.userMenuAction}>Settings</button>
              <button className={styles.userMenuAction}>Help</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

