'use client'
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import DashboardSidebar from '../../components/layout/DashboardSidebar';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
        </div>
        <p className={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Fixed Navbar at top */}
      <div className={styles.navbarContainer}>
        <DashboardNavbar
          userName={user?.user_metadata?.full_name}
          userEmail={user?.email}
          userAvatar={user?.user_metadata?.avatar_url}
          notificationCount={3}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onNavItemClick={(href) => router.push(href)}
          onInfoItemClick={(item) => console.log('Info item clicked:', item)}
          onNotificationItemClick={(item) => console.log('Notification clicked:', item)}
          onUserItemClick={(item) => {
            if (item === 'profile') router.push('/dashboard/profile');
            else if (item === 'settings') router.push('/dashboard/settings');
            else console.log('User item clicked:', item);
          }}
        />
      </div>

      {/* Main Layout with Sidebar and Content */}
      <div className={styles.mainLayout}>
        {/* Sidebar */}
        <div className={`${styles.sidebarContainer} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <DashboardSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className={styles.mobileOverlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className={styles.contentContainer}>
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}