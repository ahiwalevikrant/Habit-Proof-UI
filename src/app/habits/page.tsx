"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, HabitCategory, HabitResponse } from "@/services/api";

const CATEGORIES: { key: HabitCategory; label: string; icon: string; color: string; bg: string }[] = [
  { key: "FITNESS", label: "Fitness", icon: "fitness_center", color: "#ff570e", bg: "rgba(255,87,14,0.2)" },
  { key: "READING", label: "Reading", icon: "menu_book", color: "#3b82f6", bg: "rgba(59,130,246,0.2)" },
  { key: "MEDITATION", label: "Meditation", icon: "self_improvement", color: "#a855f7", bg: "rgba(168,85,247,0.2)" },
  { key: "STUDY", label: "Study", icon: "school", color: "#eab308", bg: "rgba(234,179,8,0.2)" },
  { key: "COOKING", label: "Nutrition", icon: "restaurant", color: "#22c55e", bg: "rgba(34,197,94,0.2)" },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>("FITNESS");
  const [newHabit, setNewHabit] = useState({ name: "", description: "", selfieRequired: true });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadHabits = async () => {
    try {
      setLoading(true);
      const data = await api.habits.list();
      setHabits(data || []);
    } catch (err: any) {
      console.error("Failed to load habits from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const saveHabit = async () => {
    if (!newHabit.name.trim()) return;
    setIsSaving(true);
    setErrorMsg("");
    try {
      const created = await api.habits.create(
        newHabit.name.trim(),
        newHabit.description.trim(),
        selectedCategory,
        newHabit.selfieRequired,
        new Date().toISOString().split("T")[0]
      );
      setHabits((prev) => [created, ...prev]);
      setShowModal(false);
      setNewHabit({ name: "", description: "", selfieRequired: true });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create habit on backend.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteHabit = async (id: number) => {
    if (!confirm("Are you sure you want to remove this habit?")) return;
    try {
      await api.habits.delete(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete habit");
    }
  };

  const getCategoryMeta = (cat: HabitCategory) => {
    return (
      CATEGORIES.find((c) => c.key === cat) || {
        key: "CUSTOM" as HabitCategory,
        label: "Habit",
        icon: "bolt",
        color: "#ff570e",
        bg: "rgba(255,87,14,0.2)",
      }
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">Habit-proof</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(true)} className="p-1 text-[#e5beb2] hover:opacity-80">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-5 w-full">
        {/* Header */}
        <section className="flex justify-between items-end gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffb59d] mb-0.5">Consistency engine</p>
            <h2 className="text-2xl font-bold text-white tracking-tight">My Habits</h2>
          </div>
          <button
            onClick={() => { setErrorMsg(""); setShowModal(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase active:scale-95 transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_12px_rgba(255,87,14,0.4)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            NEW HABIT
          </button>
        </section>

        {/* Habit List */}
        {loading ? (
          <div className="p-10 text-center glass-card rounded-2xl border border-[#353437]/40 text-[#e5beb2] text-xs">
            <span className="material-symbols-outlined animate-spin text-2xl mb-2 text-[#ff570e]">sync</span>
            <p>Loading your habits from backend...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-2xl border border-[#353437]/40 space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#ffb59d]">playlist_add</span>
            <div>
              <p className="text-sm font-bold text-white">No active habits</p>
              <p className="text-xs text-[#e5beb2] mt-0.5">Create your first habit to begin building daily momentum.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase bg-[#ff570e] text-[#511500] shadow-[0_2px_12px_rgba(255,87,14,0.4)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Add Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 w-full">
            {habits.map((habit) => {
              const meta = getCategoryMeta(habit.category);
              return (
                <div
                  key={habit.id}
                  className="glass-card rounded-2xl p-4 relative overflow-hidden group border border-[#353437]/60 bg-[#201f21]/80"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                      />
                      <h3 className="text-base font-bold text-white truncate">{habit.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {habit.requiresSelfie ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffb59d]/10 border border-[#ffb59d]/20 text-[#ffb59d] flex-shrink-0">
                          <span className="material-symbols-outlined icon-fill text-xs">face</span>
                          Selfie ID
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 flex-shrink-0">
                          Active
                        </span>
                      )}
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="text-[#ac897e] hover:text-red-400 p-0.5 transition-colors"
                        title="Delete Habit"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>

                  {habit.description && (
                    <p className="text-xs text-[#e5beb2] mb-3 line-clamp-2">{habit.description}</p>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#353437]/40">
                    <div className="flex items-center gap-1.5 text-xs text-[#e5beb2]">
                      <span className="material-symbols-outlined text-xs" style={{ color: meta.color }}>{meta.icon}</span>
                      <span className="text-[10px] font-semibold uppercase">{meta.label}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#ffb59d] flex-shrink-0">
                      <span className="material-symbols-outlined icon-fill text-base">local_fire_department</span>
                      <span className="text-sm font-extrabold">{habit.currentStreak} days</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Habit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/80 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-[440px] max-h-[88vh] overflow-y-auto rounded-t-3xl p-5 pb-12 shadow-2xl relative bg-[#1b1b1d] border-t border-[#5c4037]/50 no-scrollbar">
            {/* Drag handle */}
            <div
              className="w-10 h-1 rounded-full mx-auto mb-5 bg-[#353437] cursor-pointer"
              onClick={() => setShowModal(false)}
            />
            <header className="mb-4">
              <h2 className="text-xl font-bold text-white tracking-tight">Initialize Habit</h2>
              <p className="text-xs text-[#e5beb2] mt-0.5">Define your high-performance objective.</p>
            </header>

            {errorMsg && (
              <div className="p-2.5 mb-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-center">
                {errorMsg}
              </div>
            )}

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveHabit(); }}>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Habit Title</label>
                  <input
                    required
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
                    placeholder="e.g. Morning 5K Run"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Description</label>
                  <textarea
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e] resize-none"
                    placeholder="Specify daily routine details..."
                    rows={2}
                    value={newHabit.description}
                    onChange={(e) => setNewHabit((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-2 block">Category</label>
                <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className="px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all flex-shrink-0"
                      style={{
                        background: selectedCategory === cat.key ? cat.bg : "#201f21",
                        border: `1px solid ${selectedCategory === cat.key ? cat.color : "#353437"}`,
                        color: selectedCategory === cat.key ? cat.color : "#e5beb2",
                      }}
                    >
                      <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selfie Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0e10] border border-[#5c4037]/20">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 20 }}>fingerprint</span>
                  <div>
                    <p className="text-xs font-bold text-white">Require Selfie Verification</p>
                    <p className="text-[10px] text-[#e5beb2]">AI Biometric proof of execution</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={newHabit.selfieRequired}
                    onChange={(e) => setNewHabit((p) => ({ ...p, selfieRequired: e.target.checked }))}
                  />
                  <div
                    className="w-10 h-5 rounded-full relative transition-colors"
                    style={{ background: newHabit.selfieRequired ? "#ff570e" : "#353437" }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                      style={{ left: newHabit.selfieRequired ? "calc(100% - 18px)" : "2px" }}
                    />
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wider uppercase active:scale-[0.98] transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_14px_rgba(255,87,14,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                    Creating Habit...
                  </>
                ) : (
                  "Save Habit"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
