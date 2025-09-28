'use client'
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { motion } from 'motion/react';
import ModeToggle from '../ModeToggle';
import styles from './Navbar.module.css';
import {
    Sparkles,
    Bell,
    ChevronDown,
    User,
    Settings,
    HelpCircle,
    LogOut,
    Menu
} from "lucide-react";

export default function Navbar() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Determine current page type
    const isLandingPage = pathname === '/';
    const isAuthPage = pathname === '/auth';
    const isDashboardPage = pathname?.startsWith('/dashboard');

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    const handleAuthAction = () => {
        if (user) {
            router.push('/dashboard');
        } else {
            router.push('/auth');
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.navbar}
        >
            <div className={styles.container}>
                {/* Logo/Brand */}
                <div className={styles.brand} onClick={() => router.push("/")}>
                    <div className={styles.brandIcon}><Sparkles size={20} /></div>
                    <span className={styles.brandText}>SyncUp</span>

                </div>

                {/* Navigation Content - varies by page */}
                <div className={styles.navContent}>
                    {isLandingPage && (
                        <>
                            <div className={styles.navLinks}>
                                <button className={styles.navLink}>Features</button>
                                <button className={styles.navLink}>Pricing</button>
                                <button className={styles.navLink}>About</button>
                            </div>
                            <div className={styles.navActions}>
                                <ModeToggle />
                                {!user && (
                                    <button
                                        onClick={handleAuthAction}
                                        className={styles.primaryButton}
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </>
                    )}



                    {isDashboardPage && (
                        <div className={styles.dashboardNav}>
                            <div className={styles.navActions}>
                                <ModeToggle />

                                {/* Notifications */}
                                <button className={styles.iconButton}>
                                    <Bell size={20} className={styles.notificationIcon} />
                                    <span className={styles.notificationBadge}>3</span>
                                </button>

                                {/* User Profile */}
                                <div className={styles.userMenu}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className={styles.userButton}
                                    >
                                        <Avatar className="rounded-md">
                                            <AvatarImage
                                                src={user?.user_metadata?.avatar_url}
                                                alt={user?.user_metadata?.full_name || user?.email}
                                            />
                                            <AvatarFallback className={styles.avatarFallback}>
                                                {getInitials(
                                                    user?.user_metadata?.full_name || user?.email
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>
                                                {user?.user_metadata?.full_name ||
                                                    user?.email?.split("@")[0]}
                                            </span>
                                            <span className={styles.userRole}>Team Member</span>
                                        </div>
                                        <ChevronDown size={16} className={styles.dropdownIcon} />
                                    </button>

                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={styles.userDropdown}
                                        >
                                            <div className={styles.dropdownHeader}>
                                                <Avatar className="rounded-md">
                                                    <AvatarImage
                                                        src={user?.user_metadata?.avatar_url}
                                                        alt={user?.user_metadata?.full_name || user?.email}
                                                    />
                                                    <AvatarFallback className={styles.avatarFallback}>
                                                        {getInitials(
                                                            user?.user_metadata?.full_name || user?.email
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className={styles.dropdownName}>
                                                        {user?.user_metadata?.full_name ||
                                                            user?.email?.split("@")[0]}
                                                    </div>
                                                    <div className={styles.dropdownEmail}>
                                                        {user?.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.dropdownDivider} />
                                            <button className={styles.dropdownItem}>
                                                <User size={16} />
                                                Profile Settings
                                            </button>
                                            <button className={styles.dropdownItem}>
                                                <Settings size={16} />
                                                Preferences
                                            </button>
                                            <button className={styles.dropdownItem}>
                                                <HelpCircle size={16} />
                                                Help & Support
                                            </button>
                                            <div className={styles.dropdownDivider} />
                                            <button
                                                onClick={handleSignOut}
                                                className={styles.dropdownItem}
                                            >
                                                <LogOut size={16} />
                                                Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile menu for landing/auth pages */}
                {(isLandingPage || isAuthPage) && (
                    <button className={styles.mobileMenuButton}>
                        <Menu size={20} className={styles.hamburger} />
                    </button>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showUserMenu && (
                <div
                    className={styles.overlay}
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </motion.nav>
    );
}