import { useState } from 'react';
import styles from './AuthForm.module.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Component from './Button.jsx';
import PasswordComponent from './PasswordComponent.jsx';
// import Logo from './asset/Logo.png';
// import Image from "next/image";

export default function AuthForm({
  mode,
  onSubmit,
  onModeChange,
  loading = false,
  error = null
}) {
  const isSignUp = mode === 'signup';
  const [selectedRole, setSelectedRole] = useState('member');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      fullName: formData.get('fullName'),
      ...(isSignUp && { role: selectedRole })
    };
    onSubmit(data);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          {/* <Image src={Logo} alt="Team Pulse Logo" width={50} height={50} /> */}
          <h1 className={styles.authTitle}>
            {isSignUp ? "Join Team Pulse" : "Welcome Back"}
          </h1>
          <p className={styles.authSubtitle}>
            {isSignUp
              ? "Create your account to start tracking team wellness"
              : "Sign in to your Team Pulse dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {isSignUp && (
            <>
              <div className={styles.inputGroup}>
                <Label htmlFor="fullName" className={styles.label}>
                  Full Name
                </Label>
                <Input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  className={styles.input}
                  placeholder="Enter your full name"
                />
              </div>

              <div className={styles.inputGroup}>
                <Label htmlFor="role" className={styles.label}>
                  Role
                </Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className={styles.input}>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className={styles.inputGroup}>
            <Label htmlFor="email" className={styles.label}>
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              className={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <PasswordComponent
              id="password"
              name="password"
              placeholder="Enter your password"
              required={true}
              minLength={6}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <Component
            type="submit"
            variant="destructive"
            size="lg"
            className="w-full mt-6"
            disabled={loading}
          >
            {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
            </Component>
        </form>

        <div className={styles.authFooter}>
          <p className={styles.switchText}>
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button
              variant="link"
              onClick={() => onModeChange(isSignUp ? "signin" : "signup")}
              className="p-0 h-auto font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}