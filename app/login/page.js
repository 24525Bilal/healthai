// app/login/page.js
// Admin Login Page — Credentials: admin / admin

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, Lock, User, LogIn, AlertTriangle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsLoading(true);

    // Simulated auth delay for realism
    await new Promise((r) => setTimeout(r, 800));

    if (username === "admin" && password === "admin") {
      // Store auth in sessionStorage
      sessionStorage.setItem("hs_auth", "true");
      router.push("/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="app-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="login-card" id="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="header-logo" style={{ width: 56, height: 56, margin: "0 auto 16px" }}>
            <ShieldAlert size={30} color="white" />
          </div>
          <h1 className="login-title">HealthSentinel AI</h1>
          <p className="login-subtitle">Admin Dashboard Access</p>
        </div>

        {/* Error */}
        {error && (
          <div className="doctor-error" style={{ marginBottom: 16 }}>
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="doctor-form">
          <div className="doctor-field">
            <label className="doctor-label">
              <User size={14} /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="doctor-input"
              id="login-username"
              autoComplete="username"
            />
          </div>

          <div className="doctor-field">
            <label className="doctor-label">
              <Lock size={14} /> Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="doctor-input"
                id="login-password"
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="analyze-btn" id="login-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spinner" />
                Authenticating...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In to Dashboard
              </>
            )}
          </button>
        </form>

        <p className="login-footer-text">
          Authorized personnel only. All access is logged and monitored.
        </p>
      </div>
    </div>
  );
}
