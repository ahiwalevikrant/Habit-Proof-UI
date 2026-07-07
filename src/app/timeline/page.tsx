"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, HabitResponse, CheckInResponse } from "@/services/api";

interface ExtendedCheckIn extends CheckInResponse {
  habitTitle: string;
  category: string;
}

export default function TimelinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [timelineItems, setTimelineItems] = useState<ExtendedCheckIn[]>([]);
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | "all">("all");

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const habitsList = await api.habits.list();
      setHabits(habitsList);

      // Fetch timeline check-ins for all habits
      const allCheckins: ExtendedCheckIn[] = [];
      
      await Promise.all(
        habitsList.map(async (habit) => {
          try {
            const res = await api.checkins.list(habit.id);
            res.forEach((c) => {
              allCheckins.push({
                ...c,
                habitTitle: habit.title,
                category: habit.category,
              });
            });
          } catch (e) {
            console.error(`Failed to load checkins for habit ${habit.id}`, e);
          }
        })
      );

      // Sort by date desc
      allCheckins.sort(
        (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
      );

      setTimelineItems(allCheckins);
    } catch (err) {
      console.error("Failed to load timeline data", err);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredItems = selectedHabitId === "all"
    ? timelineItems
    : timelineItems.filter(item => item.habitId === Number(selectedHabitId));

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

  return (
    <div className="screen-content">
      <header className="page-header flex-row-center">
        <h2>Activity History</h2>
        
        {/* Habit filter selector */}
        <select 
          className="habit-filter-select"
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(e.target.value === "all" ? "all" : Number(e.target.value))}
        >
          <option value="all">All Habits</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.title}</option>
          ))}
        </select>
      </header>

      {/* Timeline items list */}
      <div className="timeline-container">
        {filteredItems.length === 0 ? (
          <div className="card flex-center empty-card">
            <p>No check-in proofs recorded yet.</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              Verify a habit activity to start building your timeline.
            </p>
          </div>
        ) : (
          <div className="timeline-thread">
            {filteredItems.map((item, idx) => {
              const isVerified = item.verificationStatus === "VERIFIED";
              const checkInDate = new Date(item.checkInDate);
              const formattedDate = checkInDate.toLocaleDateString([], {
                weekday: 'short', month: 'short', day: 'numeric'
              });
              const formattedTime = checkInDate.toLocaleTimeString([], {
                hour: '2-digit', minute: '2-digit'
              });

              return (
                <div key={item.id} className="timeline-node">
                  {/* Timeline branch connecting line */}
                  {idx < filteredItems.length - 1 && <div className="timeline-connector"></div>}

                  {/* Left Column: Date indicators */}
                  <div className="timeline-time-col">
                    <span className="date-tag">{formattedDate}</span>
                    <span className="time-tag">{formattedTime}</span>
                  </div>

                  {/* Right Column: Card proof detail */}
                  <div className="timeline-card-col">
                    <div className="card glass history-card">
                      <div className="card-top flex-row-center">
                        <div className="habit-header-wrap">
                          <span 
                            className="category-dot" 
                            style={{ background: getCategoryColor(item.category) }}
                          ></span>
                          <h3>{item.habitTitle}</h3>
                        </div>
                        <span className={`badge ${isVerified ? "badge-success" : "badge-danger"}`}>
                          {item.verificationStatus}
                        </span>
                      </div>

                      {item.proofUrl && (
                        <div className="history-photo-wrap">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.proofUrl} alt="Checkin Proof" className="history-photo" />
                          {item.faceMatchScore > 0 && (
                            <div className="biometric-badge glass">
                              👤 Match Score: {Math.round(item.faceMatchScore * 100)}%
                            </div>
                          )}
                        </div>
                      )}

                      {item.note && (
                        <p className="history-note">"{item.note}"</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .habit-filter-select {
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 13px;
          outline: none;
          max-width: 140px;
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='18' viewBox='0 0 24 24' width='18' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 8px center;
          padding-right: 28px;
        }

        .timeline-container {
          margin-bottom: 40px;
        }

        .empty-card {
          padding: 40px 20px;
          border-style: dashed;
          text-align: center;
        }

        .timeline-thread {
          display: flex;
          flex-direction: column;
          gap: 24px;
          position: relative;
        }

        .timeline-node {
          display: flex;
          gap: 16px;
          position: relative;
        }

        .timeline-connector {
          position: absolute;
          left: 60px;
          top: 36px;
          bottom: -36px;
          width: 2px;
          background: var(--border);
          z-index: 1;
        }

        .timeline-time-col {
          width: 60px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          text-align: right;
          padding-top: 14px;
          flex-shrink: 0;
          z-index: 2;
        }

        .date-tag {
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.2px;
        }

        .time-tag {
          font-size: 10px;
          color: var(--text-muted);
        }

        .timeline-card-col {
          flex: 1;
          z-index: 2;
        }

        .history-card {
          padding: 16px;
          gap: 12px;
        }

        .habit-header-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .habit-header-wrap h3 {
          font-size: 14px;
          color: #ffffff;
        }

        .history-photo-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #000;
        }

        .history-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .biometric-badge {
          position: absolute;
          bottom: 10px;
          left: 10px;
          font-size: 10px;
          font-weight: 600;
          color: #ffffff;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .history-note {
          font-size: 13px;
          font-style: italic;
          color: var(--text-muted);
          border-left: 2px solid var(--border);
          padding-left: 8px;
        }
      `}</style>
    </div>
  );
}
