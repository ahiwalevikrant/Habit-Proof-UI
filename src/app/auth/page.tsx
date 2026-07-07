"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (api.auth.isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await api.auth.login(email, password);
      } else {
        if (!name) {
          setError("Name is required");
          setLoading(false);
          return;
        }
        await api.auth.signup(name, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container screen-content">
      <div className="brand-header float-anim">
        <div className="brand-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <h1 className="brand-title">HABIT<span>PROOF</span></h1>
        <p className="brand-subtitle">Level up your fitness. Prove your consistency.</p>
      </div>

      <div className="card glass auth-card">
        <div className="tabs-header">
          <button 
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Log In
          </button>
          <button 
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-banner">{error}</div>}

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <span className="spinner"></span>
            ) : isLogin ? (
              "Access Dashboard"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px 24px;
          background: radial-gradient(circle at top, rgba(252, 82, 0, 0.08) 0%, transparent 70%);
        }

        .brand-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .brand-logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--primary) 0%, #ff6b3d 100%);
          color: #ffffff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(252, 82, 0, 0.3);
          margin-bottom: 16px;
        }

        .brand-title {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #ffffff;
        }

        .brand-title span {
          color: var(--primary);
        }

        .brand-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .auth-card {
          width: 100%;
          max-width: 380px;
          padding: 24px;
        }

        .tabs-header {
          display: flex;
          background: var(--bg-input);
          padding: 4px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          margin-bottom: 24px;
        }

        .tab-btn {
          flex: 1;
          padding: 10px;
          font-weight: 600;
          font-size: 13px;
          border-radius: calc(var(--radius-md) - 2px);
          border: none;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: var(--transition);
        }

        .tab-btn.active {
          background: var(--bg-card);
          color: #ffffff;
          box-shadow: var(--shadow-sm);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 500;
        }

        .auth-submit {
          margin-top: 8px;
          height: 48px;
        }

        .spinner {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
