'use client'
import { useState } from 'react';
import AuthForm from '../../../components/AuthForm';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './auth.module.css';
import Link from "next/link";

export default function AuthPage() {
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAuth = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(data.email, data.password, {
          full_name: data.fullName
        });
        if (error) {
          setError(error);
        } else {
          setSuccess('Account created! Please check your email to verify your account.');
        }
      } else {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          setError(error);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (error) {
      setError(error);
    }
    setLoading(false);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show authenticated state
  if (user) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardCard}>
          <div className={styles.dashboardHeader}>
            <div className={styles.welcomeIcon}>
              👋
            </div>
            <h1 className={styles.welcomeTitle}>
              Welcome, {user.email}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Authentication successful! You're now logged into Team Pulse.
            </p>
          </div>

          <div className={styles.userInfo}>
            <h3>User Information:</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>User ID:</span>
                <span className={styles.infoValue}>{user.id}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email Verified:</span>
                <span className={styles.infoValue}>
                  {user.email_confirmed_at ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Created:</span>
                <span className={styles.infoValue}>
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              onClick={handleSignOut}
              disabled={loading}
              className={styles.signOutButton}
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
            <Link href="/" className={styles.dashboardLink}>
              ← Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }
    // Show authentication form
  return (
    <AuthForm
      mode={mode}
      onSubmit={handleAuth}
      onModeChange={setMode}
      loading={loading}
      error={error}
      success={success}
    />
  );
}