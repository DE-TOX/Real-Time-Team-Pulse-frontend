'use client'
import { useState } from 'react';
import AuthForm from '../../components/AuthForm';
import DashboardNavbar from '../../components/layout/DashboardNavbar';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import styles from './auth.module.css';
import Link from 'next/link';

export default function AuthPage() {
  const { user, signIn, signUp, signOut, loading: authLoading } = useAuth();
  const { success, error, info } = useToast();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleAuth = async (data) => {
    setLoading(true);
    setAuthError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await signUp(data.email, data.password, {
          full_name: data.fullName
        });
        if (signUpError) {
          setAuthError(signUpError);
          error({
            title: "Sign up failed",
            description: signUpError
          });
        } else {
          success({
            title: "Account created!",
            description: "Please check your email to verify your account."
          });
        }
      } else {
        const { error: signInError } = await signIn(data.email, data.password);
        if (signInError) {
          setAuthError(signInError);
          error({
            title: "Sign in failed",
            description: signInError
          });
        } else {
          success({
            title: "Welcome back!",
            description: "You have successfully signed in."
          });
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred';
      setAuthError(errorMessage);
      error({
        title: "Authentication error",
        description: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    const { error: signOutError } = await signOut();
    if (signOutError) {
      setAuthError(signOutError);
      error({
        title: "Sign out failed",
        description: signOutError
      });
    } else {
      success({
        title: "Signed out successfully",
        description: "You have been logged out of your account."
      });
    }
    setLoading(false);
  };

  // Show loading state
  if (authLoading) {
    return (
      <>
        <DashboardNavbar />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // Show authenticated state
  if (user) {
    return (
      <>
        <DashboardNavbar />
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
                Authentication successful! You're now logged into SyncUp.
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

            {authError && (
              <div className={styles.error}>
                {authError}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // Show authentication form
  return (
    <>
      <DashboardNavbar />
      <div>
        <AuthForm
          mode={mode}
          onSubmit={handleAuth}
          onModeChange={setMode}
          loading={loading}
          error={authError}
        />
      </div>
    </>
  );
}
