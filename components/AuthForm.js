import styles from './AuthForm.module.css';

export default function AuthForm({ 
  mode, 
  onSubmit, 
  onModeChange, 
  loading = false,
  error = null 
}) {
  const isSignUp = mode === 'signup';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName')
    };
    onSubmit(data);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.authIcon}>
            ✨
          </div>
          <h1 className={styles.authTitle}>
            {isSignUp ? 'Join Team Pulse' : 'Welcome Back'}
          </h1>
          <p className={styles.authSubtitle}>
            {isSignUp 
              ? 'Create your account to start tracking team wellness' 
              : 'Sign in to your Team Pulse dashboard'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {isSignUp && (
            <div className={styles.inputGroup}>
              <label htmlFor="fullName" className={styles.label}>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                className={styles.input}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              className={styles.input}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.switchText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            {' '}
            <button 
              type="button"
              onClick={() => onModeChange(isSignUp ? 'signin' : 'signup')}
              className={styles.switchButton}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}