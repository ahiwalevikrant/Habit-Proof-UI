"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, HabitResponse, HabitCategory } from "@/services/api";

export default function HabitsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  
  // Modals / Detail Panel states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<HabitResponse | null>(null);

  // Form Fields for Create
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("FITNESS");
  const [requiresSelfie, setRequiresSelfie] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  // Form Fields for Edit
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState<HabitCategory>("FITNESS");
  const [editRequiresSelfie, setEditRequiresSelfie] = useState(true);
  const [editStatus, setEditStatus] = useState<"ACTIVE" | "COMPLETED" | "ARCHIVED">("ACTIVE");

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      router.push("/auth");
      return;
    }
    loadHabits();
  }, [router]);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await api.habits.list();
      setHabits(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    try {
      setFormLoading(true);
      setFormError("");
      await api.habits.create(title, description, category, requiresSelfie, startDate);
      setShowCreateModal(false);
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("FITNESS");
      setRequiresSelfie(true);
      loadHabits();
    } catch (err: any) {
      setFormError(err.message || "Failed to create habit");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHabit) return;
    if (!editTitle.trim()) {
      setFormError("Title is required");
      return;
    }
    try {
      setFormLoading(true);
      setFormError("");
      const updated = await api.habits.update(
        selectedHabit.id,
        editTitle,
        editDescription,
        editCategory,
        editRequiresSelfie,
        editStatus
      );
      setSelectedHabit(null);
      loadHabits();
    } catch (err: any) {
      setFormError(err.message || "Failed to update habit");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this habit? All check-in history will be lost.")) {
      return;
    }
    try {
      await api.habits.delete(id);
      setSelectedHabit(null);
      loadHabits();
    } catch (err) {
      alert("Failed to delete habit");
    }
  };

  const openEdit = (habit: HabitResponse) => {
    setSelectedHabit(habit);
    setEditTitle(habit.title);
    setEditDescription(habit.description || "");
    setEditCategory(habit.category);
    setEditRequiresSelfie(habit.requiresSelfie);
    setEditStatus(habit.status);
    setFormError("");
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
      {/* Page Header */}
      <header className="page-header flex-row-center">
        <h2>My Habits</h2>
        <button className="add-btnBtn btn-primary" onClick={() => { setShowCreateModal(true); setFormError(""); }}>
          + New Habit
        </button>
      </header>

      {/* Habit List */}
      <div className="habit-list-container">
        {habits.length === 0 ? (
          <div className="card flex-center empty-card">
            <p>You have no active habits yet.</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
              Click "+ New Habit" to create your tracking goals.
            </p>
          </div>
        ) : (
          <div className="habits-grid">
            {habits.map((habit) => (
              <div 
                key={habit.id} 
                className="card card-hover habit-card"
                onClick={() => openEdit(habit)}
              >
                <div className="habit-card-top flex-row-center">
                  <div className="habit-meta-wrap">
                    <span 
                      className="category-dot" 
                      style={{ background: getCategoryColor(habit.category) }}
                    ></span>
                    <span className="category-label">{habit.category}</span>
                  </div>
                  <span className={`badge ${habit.status === "ACTIVE" ? "badge-success" : "badge-muted"}`}>
                    {habit.status}
                  </span>
                </div>

                <div className="habit-card-body">
                  <h3>{habit.title}</h3>
                  {habit.description && <p className="desc">{habit.description}</p>}
                </div>

                <div className="habit-card-bottom flex-row-center">
                  <span className="streak-badge">
                    🔥 <strong>{habit.currentStreak}</strong> day streak
                  </span>
                  <span className="selfie-req-badge">
                    {habit.requiresSelfie ? "📷 Photo Proof Required" : "📝 Note Check-In"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Habit Modal */}
      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-content card glass">
            <div className="modal-header flex-row-center">
              <h3>Create New Habit</h3>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreate} className="modal-form">
              {formError && <div className="error-banner">{formError}</div>}

              <div className="input-group">
                <label className="input-label">Habit Title</label>
                <input
                  type="text"
                  placeholder="e.g. 5K Run, Drink 3L Water"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  placeholder="What is your routine details?"
                  className="input-field"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: "80px", resize: "none" }}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select 
                  className="input-field select-field" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HabitCategory)}
                >
                  <option value="FITNESS">Fitness</option>
                  <option value="READING">Reading</option>
                  <option value="COOKING">Cooking</option>
                  <option value="STUDY">Study</option>
                  <option value="MEDITATION">Meditation</option>
                  <option value="SKINCARE">Skincare</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Start Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={requiresSelfie}
                    onChange={(e) => setRequiresSelfie(e.target.checked)}
                  />
                  <span>Require Selfie Verification (Face Check-In)</span>
                </label>
                <p className="checkbox-hint">Requires capturing a photo proof with face biometric verification.</p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={formLoading}>
                {formLoading ? "Creating..." : "Save Habit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Habit Detail Panel */}
      {selectedHabit && (
        <div className="modal-backdrop">
          <div className="modal-content card glass">
            <div className="modal-header flex-row-center">
              <h3>Habit Details & Settings</h3>
              <button className="close-btn" onClick={() => setSelectedHabit(null)}>×</button>
            </div>

            <form onSubmit={handleUpdate} className="modal-form">
              {formError && <div className="error-banner">{formError}</div>}

              <div className="input-group">
                <label className="input-label">Habit Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ minHeight: "80px", resize: "none" }}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Category</label>
                <select 
                  className="input-field select-field" 
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as HabitCategory)}
                >
                  <option value="FITNESS">Fitness</option>
                  <option value="READING">Reading</option>
                  <option value="COOKING">Cooking</option>
                  <option value="STUDY">Study</option>
                  <option value="MEDITATION">Meditation</option>
                  <option value="SKINCARE">Skincare</option>
                  <option value="CUSTOM">Custom</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Status</label>
                <select 
                  className="input-field select-field" 
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editRequiresSelfie}
                    onChange={(e) => setEditRequiresSelfie(e.target.checked)}
                  />
                  <span>Require Selfie Verification</span>
                </label>
              </div>

              <div className="action-row">
                <button 
                  type="button" 
                  className="btn btn-secondary delete-action-btn"
                  onClick={() => handleDelete(selectedHabit.id)}
                >
                  Delete Habit
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header {
          margin-bottom: 8px;
        }

        .add-btnBtn {
          width: auto;
          padding: 8px 16px;
        }

        .habit-list-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
        }

        .habits-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .habit-card {
          cursor: pointer;
          gap: 12px;
        }

        .habit-card:active {
          transform: scale(0.98);
        }

        .habit-card-top {
          font-size: 12px;
        }

        .habit-meta-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .category-label {
          font-weight: 700;
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
        }

        .habit-card-body h3 {
          font-size: 18px;
          color: #ffffff;
        }

        .habit-card-body .desc {
          margin-top: 4px;
          font-size: 13px;
        }

        .habit-card-bottom {
          font-size: 12px;
        }

        .streak-badge {
          color: var(--primary);
          font-weight: 600;
        }

        .selfie-req-badge {
          color: var(--text-muted);
          font-size: 11px;
        }

        .empty-card {
          padding: 40px 20px;
          border-style: dashed;
          text-align: center;
        }

        /* Modal Settings */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-end; /* Slides from bottom */
          justify-content: center;
          z-index: 2000;
        }

        .modal-content {
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
          padding: 24px;
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          max-height: 90vh;
          overflow-y: auto;
          border-bottom: none;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .modal-header {
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .close-btn {
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-size: 28px;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .select-field {
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 40px;
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
        }

        .checkbox-hint {
          font-size: 11px;
          color: var(--text-muted);
          padding-left: 28px;
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .delete-action-btn {
          background: transparent;
          color: var(--error);
          border: 1px solid rgba(239, 68, 68, 0.25);
        }

        .delete-action-btn:hover {
          background: rgba(239, 68, 68, 0.08) !important;
          border-color: var(--error) !important;
        }

        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--error);
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
}
