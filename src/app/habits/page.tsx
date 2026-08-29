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
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
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

  const filteredHabits = activeFilter === "ALL" 
    ? habits 
    : habits.filter((h) => h.category === activeFilter);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Mobile Top App Bar (Hidden on Desktop) */}
      <header className="lg:hidden sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">Habit-proof</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettings(true)} className="p-1 text-[#e5beb2] hover:opacity-80">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 lg:px-8 pt-4 lg:pt-8 pb-28 lg:pb-12 space-y-6 w-full">
        {/* Page Title & Controls */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">Consistency Protocols</span>
              <span className="text-xs text-[#ac897e]">• {habits.length} Total</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Active Habits</h2>
          </div>

          <button
            onClick={() => { setErrorMsg(""); setShowModal(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase active:scale-95 transition-all bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] shadow-[0_4px_16px_rgba(255,87,14,0.35)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add</span>
            New Habit Protocol
          </button>
        </section>

        {/* Category Filter Tabs */}
        <section className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer ${
              activeFilter === "ALL"
                ? "bg-[#ffb59d] text-[#511500] shadow-sm font-black"
                : "bg-[#201f21] text-[#e5beb2] hover:text-white border border-[#353437]/60"
            }`}
          >
            All Habits ({habits.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = habits.filter((h) => h.category === cat.key).length;
            const isSelected = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-[#2a2a2c] text-white border-2 border-[#ff570e] shadow-sm"
                    : "bg-[#201f21] text-[#e5beb2] hover:text-white border border-[#353437]/60"
                }`}
              >
                <span className="material-symbols-outlined text-sm" style={{ color: cat.color }}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-60 ml-0.5">({count})</span>
              </button>
            );
          })}
        </section>

        {/* Habits Grid - 3 columns on large desktop, 2 on tablet, 1 on mobile */}
        {loading ? (
          <div className="p-16 text-center glass-card rounded-2xl border border-[#353437]/40 text-[#e5beb2] text-xs space-y-2">
            <span className="material-symbols-outlined animate-spin text-3xl mb-2 text-[#ff570e]">sync</span>
            <p className="font-semibold text-white">Loading habits repository...</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-[#353437]/40 space-y-4 bg-[#201f21]/40">
            <div className="w-16 h-16 rounded-2xl bg-[#2a2a2c] flex items-center justify-center mx-auto border border-[#353437]">
              <span className="material-symbols-outlined text-4xl text-[#ffb59d]">playlist_add</span>
            </div>
            <div className="max-w-md mx-auto">
              <p className="text-base font-bold text-white">No habits found in this category</p>
              <p className="text-xs text-[#e5beb2] mt-1">Create a new habit or adjust your filter selection to track your routines.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-[#ff570e] text-[#511500] hover:bg-[#ff6f30] shadow-[0_4px_16px_rgba(255,87,14,0.4)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create Habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHabits.map((habit) => {
              const meta = getCategoryMeta(habit.category);
              const todayStr = new Date().toISOString().split("T")[0];
              const isDoneToday = habit.lastCheckInDate === todayStr;

              return (
                <div
                  key={habit.id}
                  className="glass-card p-5 rounded-2xl relative overflow-hidden border border-[#353437]/60 bg-[#201f21]/80 hover:border-[#5c4037] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category Icon & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                          style={{ background: meta.bg }}
                        >
                          <span className="material-symbols-outlined" style={{ color: meta.color, fontSize: 22 }}>
                            {meta.icon}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">
                            {meta.label}
                          </span>
                          <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                            {habit.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#ac897e] hover:text-red-400 hover:bg-red-950/40 transition-all"
                        title="Delete habit"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>

                    {/* Description */}
                    {habit.description && (
                      <p className="text-xs text-[#e5beb2] line-clamp-2 leading-relaxed">
                        {habit.description}
                      </p>
                    )}

                    {/* Biometric Badge */}
                    <div className="flex items-center gap-2">
                      {habit.requiresSelfie ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#ff570e]/15 border border-[#ff570e]/30 text-[10px] font-bold text-[#ffb59d] uppercase tracking-wider">
                          <span className="material-symbols-outlined text-xs">center_focus_strong</span>
                          Biometric Proof Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#2a2a2c] text-[10px] font-bold text-[#ac897e] uppercase tracking-wider">
                          Manual Check-In
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Stats & Check-in status */}
                  <div className="pt-4 mt-4 border-t border-[#353437]/50 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-[#ffb59d]">local_fire_department</span>
                        <span className="font-extrabold text-white">{habit.currentStreak}d</span>
                      </div>
                      <div className="text-[#ac897e] text-[11px]">
                        Best: <strong className="text-[#e5beb2]">{habit.longestStreak}d</strong>
                      </div>
                    </div>

                    {isDoneToday ? (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">check</span>
                        Done Today
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffb59d]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* New Habit Creation Modal / Drawer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-[540px] glass-card rounded-3xl p-6 lg:p-8 border border-[#5c4037]/60 bg-[#1b1b1d] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#353437]/50 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Create New Habit Protocol</h3>
                <p className="text-xs text-[#e5beb2]">Define target habits for daily biometric tracking</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#2a2a2c] hover:bg-[#353437] text-white flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d] mb-1.5">
                  Habit Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5:00 AM Gym Session, 30 Min Reading..."
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#131315] border border-[#353437] text-white text-sm focus:outline-none focus:border-[#ff570e] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d] mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Complete chest workout & 15m cardio"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#131315] border border-[#353437] text-white text-sm focus:outline-none focus:border-[#ff570e] transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d] mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                        selectedCategory === cat.key
                          ? "bg-[#2a2a2c] border-[#ff570e] shadow-[0_0_12px_rgba(255,87,14,0.3)]"
                          : "bg-[#131315] border-[#353437] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ color: cat.color }}>
                        {cat.icon}
                      </span>
                      <span className="text-[10px] font-bold text-white">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Biometric Toggle */}
              <div className="p-4 rounded-xl bg-[#131315] border border-[#353437] flex items-center justify-between">
                <div className="space-y-0.5 pr-3">
                  <p className="text-xs font-bold text-white">Require Biometric Facial Proof</p>
                  <p className="text-[10px] text-[#e5beb2]">Enforces AI facial validation & liveness check before logging streak</p>
                </div>
                <input
                  type="checkbox"
                  checked={newHabit.selfieRequired}
                  onChange={(e) => setNewHabit({ ...newHabit, selfieRequired: e.target.checked })}
                  className="w-5 h-5 accent-[#ff570e] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#2a2a2c] text-white text-xs font-bold uppercase hover:bg-[#353437] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveHabit}
                disabled={isSaving || !newHabit.name.trim()}
                className="flex-1 py-3 rounded-xl bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] text-xs font-bold uppercase transition-all shadow-[0_4px_16px_rgba(255,87,14,0.4)] disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Creating..." : "Save Protocol"}
              </button>
            </div>
          </div>
        </div>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
