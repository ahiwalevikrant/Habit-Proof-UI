"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, DashboardResponse, HabitResponse } from "@/services/api";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Auth Guard check
    if (!api.auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }

    setUser(api.auth.getCurrentUser());

    // Fetch dashboard stats & habits
    const fetchData = async () => {
      try {
        const [statsData, habitsData] = await Promise.all([
          api.dashboard.get(),
          api.habits.list(),
        ]);
        setStats(statsData);
        setHabits(habitsData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    api.auth.logout();
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="screen-content flex-center" style={{ minHeight: "80vh" }}>
        <div className="spinner"></div>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid var(--border);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  // Get color for habit category
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "FITNESS": return "#fc5200";
      case "READING": return "#3b82f6";
      case "COOKING": return "#10b981";
      case "STUDY": return "#a855f7";
      case "MEDITATION": return "#ec4899";
      case "SKINCARE": return "#06b6d4";
      default: return "#6b7280";
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="screen-content">
      {/* Header section */}
      <header className="dash-header">
        <div>
          <span className="welcome-tag">WELCOME BACK</span>
          <h1 className="user-name">{user?.name || "Athlete"}</h1>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Sign Out">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </header>

      {/* Main Stats Card */}
      {stats && (
        <div className="card glass stats-card">
          <div className="progress-ring-section">
            <div className="progress-circle">
              <svg className="svg-circle" viewBox="0 0 100 100">
                <circle className="circle-bg" cx="50" cy="50" r="40" />
                <circle 
                  className="circle-progress" 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  style={{
                    strokeDasharray: 251.2,
                    strokeDashoffset: 251.2 - (251.2 * stats.overallCompletionRate) / 100
                  }}
                />
              </svg>
              <div className="progress-text-container">
                <span className="percent">{stats.overallCompletionRate}%</span>
                <span className="label">Today</span>
              </div>
            </div>
            <div className="progress-numbers">
              <h3>Target Completed</h3>
              <p>{stats.completedTodayCount} of {stats.totalHabits} habits checked-in</p>
            </div>
          </div>

          <div className="stats-divider"></div>

          <div className="streaks-row">
            <div className="streak-box">
              <div className="streak-icon-wrap streak-flame">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fc5200" stroke="#fc5200" strokeWidth="2">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <div className="streak-info">
                <span className="value">{stats.currentStreak} Days</span>
                <span className="label">Active Streak</span>
              </div>
            </div>

            <div className="streak-box">
              <div className="streak-icon-wrap" style={{ background: "rgba(255,255,255,0.05)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="streak-info">
                <span className="value" style={{ color: "#ffffff" }}>{stats.longestStreak} Days</span>
                <span className="label">Longest Streak</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily checklist */}
      <section className="section-container">
        <div className="flex-row-center" style={{ marginBottom: "12px" }}>
          <h2>Today's Checklist</h2>
          <Link href="/habits" className="see-all-link">Manage</Link>
        </div>

        {habits.length === 0 ? (
          <div className="card flex-center empty-card">
            <p>No habits added yet.</p>
            <Link href="/habits" className="btn btn-secondary" style={{ marginTop: "12px", width: "auto" }}>
              Add Your First Habit
            </Link>
          </div>
        ) : (
          <div className="checklist-grid">
            {habits.map((habit) => {
              const isCheckedToday = habit.lastCheckInDate === todayStr;

              return (
                <div key={habit.id} className={`card checklist-item ${isCheckedToday ? "checked" : ""}`}>
                  <div className="item-left">
                    <span 
                      className="category-dot" 
                      style={{ background: getCategoryColor(habit.category) }}
                    ></span>
                    <div className="habit-info">
                      <h3 className="habit-title">{habit.title}</h3>
                      <div className="meta-row">
                        {habit.requiresSelfie && (
                          <span className="selfie-badge">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            Selfie ID
                          </span>
                        )}
                        <span className="streak-count-mini">
                          🔥 {habit.currentStreak}d
                        </span>
                      </div>
                    </div>
                  </div>

                  {isCheckedToday ? (
                    <div className="checked-badge">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Done
                    </div>
                  ) : (
                    <button 
                      onClick={() => router.push(`/verify?habitId=${habit.id}`)}
                      className="checkin-action-btn"
                    >
                      Verify
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Activity Feed */}
      <section className="section-container" style={{ marginBottom: "40px" }}>
        <h2>Proof Feed</h2>
        {stats && stats.recentCheckIns.length === 0 ? (
          <div className="card flex-center empty-card">
            <p>Upload a photo check-in to see it in the feed.</p>
          </div>
        ) : (
          <div className="feed-list">
            {stats?.recentCheckIns.map((check) => {
              const habit = habits.find((h) => h.id === check.habitId);
              const isVerified = check.verificationStatus === "VERIFIED";

              return (
                <div key={check.id} className="card feed-card">
                  <div className="feed-card-header">
                    <div className="user-avatar-placeholder">
                      {user?.name?.slice(0, 2).toUpperCase() || "AT"}
                    </div>
                    <div>
                      <h3>{user?.name || "Athlete"}</h3>
                      <p style={{ fontSize: "11px" }}>
                        Checked in to <strong>{habit?.title || "Habit"}</strong> • {new Date(check.checkInDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {check.proofUrl && (
                    <div className="feed-photo-container">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={check.proofUrl} alt="Check-In Proof" className="feed-photo" />
                      
                      <div className="feed-face-overlay glass">
                        <span className={`badge ${isVerified ? "badge-success" : "badge-danger"}`}>
                          {check.verificationStatus}
                        </span>
                        {check.faceMatchScore > 0 && (
                          <span className="face-score">
                            Match: {Math.round(check.faceMatchScore * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {check.note && (
                    <p className="feed-note">"{check.note}"</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <style jsx>{`
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }

        .welcome-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: var(--primary);
        }

        .user-name {
          font-size: 26px;
        }

        .logout-btn {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .logout-btn:hover {
          color: var(--error);
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        /* Stats Card Styles */
        .stats-card {
          padding: 22px;
        }

        .progress-ring-section {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .progress-circle {
          width: 80px;
          height: 80px;
          position: relative;
        }

        .svg-circle {
          transform: rotate(-90deg);
          width: 100%;
          height: 100%;
        }

        .circle-bg {
          fill: none;
          stroke: var(--border);
          stroke-width: 8px;
        }

        .circle-progress {
          fill: none;
          stroke: var(--primary);
          stroke-width: 8px;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.8s ease-in-out;
        }

        .progress-text-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .progress-text-container .percent {
          font-size: 16px;
          font-weight: 700;
          color: #ffffff;
        }

        .progress-text-container .label {
          font-size: 8px;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .progress-numbers h3 {
          font-size: 16px;
          color: #ffffff;
        }

        .stats-divider {
          height: 1px;
          background: var(--border);
          width: 100%;
        }

        .streaks-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .streak-box {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .streak-icon-wrap {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          background: rgba(252, 82, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .streak-info {
          display: flex;
          flex-direction: column;
        }

        .streak-info .value {
          font-size: 15px;
          font-weight: 700;
          color: var(--primary);
        }

        .streak-info .label {
          font-size: 10px;
          color: var(--text-muted);
        }

        /* Checklist Styles */
        .section-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .see-all-link {
          font-size: 13px;
          font-weight: 600;
          color: var(--primary);
        }

        .checklist-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .checklist-item {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          gap: 12px;
        }

        .checklist-item.checked {
          background: rgba(28, 28, 31, 0.4);
          opacity: 0.8;
          border-color: rgba(255, 255, 255, 0.02);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .habit-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .habit-title {
          font-size: 15px;
          color: #ffffff;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .selfie-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 9px;
          font-weight: 600;
          background: rgba(252, 82, 0, 0.08);
          color: var(--primary);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(252, 82, 0, 0.15);
        }

        .streak-count-mini {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .checkin-action-btn {
          background: var(--primary);
          color: #ffffff;
          border: none;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .checkin-action-btn:active {
          transform: scale(0.95);
        }

        .checked-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: var(--success);
          background: var(--success-glow);
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .empty-card {
          padding: 30px;
          text-align: center;
          border-style: dashed;
        }

        /* Feed Styles */
        .feed-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feed-card {
          padding: 16px;
          gap: 12px;
        }

        .feed-card-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-placeholder {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-input);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          color: var(--primary);
        }

        .feed-photo-container {
          position: relative;
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000000;
          aspect-ratio: 4/3;
        }

        .feed-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .feed-face-overlay {
          position: absolute;
          bottom: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
        }

        .face-score {
          font-size: 11px;
          font-weight: 600;
          color: #ffffff;
        }

        .feed-note {
          font-size: 13px;
          font-style: italic;
          color: #ffffff;
          border-left: 3px solid var(--border);
          padding-left: 8px;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}
