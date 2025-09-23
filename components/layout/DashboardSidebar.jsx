'use client'
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import styles from './DashboardSidebar.module.css';
import {
  BarChart3,
  CheckCircle,
  TrendingUp,
  Brain,
  Users,
  Settings,
  Sparkles,
  X,
  User,
  LogOut
} from "lucide-react";

const navigationItems = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: <BarChart3 size={20} />,
    description: 'Team metrics overview'
  },
  {
    name: 'Check-ins',
    href: '/dashboard/checkins',
    icon: <CheckCircle size={20} />,
    description: 'Daily wellness check-ins'
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: <TrendingUp size={20} />,
    description: 'Detailed team analytics'
  },
  {
    name: 'Insights',
    href: '/dashboard/insights',
    icon: <Brain size={20} />,
    description: 'AI-powered insights'
  },
  {
    name: 'Teams',
    href: '/dashboard/teams',
    icon: <Users size={20} />,
    description: 'Manage your teams'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings size={20} />,
    description: 'Account & preferences'
  }
];

export default function DashboardSidebar({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleNavigation = (href) => {
    router.push(href);
    onClose(); // Close mobile sidebar after navigation
  };

  return (
    <>
      <aside className={styles.sidebar}>
        {/* Sidebar Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}><Sparkles size={24} /></div>
            <div className={styles.logoText}>
              <h2>Team Pulse</h2>
              <p>Dashboard</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className={styles.userProfile}>
          <div className={styles.userAvatar}>
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || <User size={20} />}
          </div>
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>
              {user?.user_metadata?.full_name || 'Team Member'}
            </h3>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <ul className={styles.navList}>
            {navigationItems.map((item) => (
              <li key={item.href}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`${styles.navItem} ${
                    pathname === item.href ? styles.active : ''
                  }`}
                  title={item.description}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <div className={styles.navContent}>
                    <span className={styles.navName}>{item.name}</span>
                    <span className={styles.navDescription}>{item.description}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={styles.sidebarFooter}>
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={styles.signOutButton}
            title="Sign out of your account"
          >
            <LogOut size={20} className={styles.signOutIcon} />
            <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>

          <div className={styles.versionInfo}>
            <p>Team Pulse v1.0</p>
            <p>Phase 4: Frontend</p>
          </div>
        </div>
      </aside>
    </>
  );
}