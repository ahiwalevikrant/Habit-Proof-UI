"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const INITIAL_HABITS = [
  { id: 1, name: "6AM HIIT Session", description: "", category: "fitness", selfieRequired: false, streak: 14, status: "Active", color: "#ff570e", glow: "#ff570e" },
  { id: 2, name: "Philosophy Reading", description: "20 pages daily", category: "reading", selfieRequired: true, streak: 3, status: "Active", color: "#3b82f6", glow: "#3b82f6" },
  { id: 3, name: "Deep Breath Protocol", description: "", category: "mindfulness", selfieRequired: false, streak: 0, status: "Rest Day", progress: 80, color: "#a855f7", glow: "#a855f7" },
];

const CATEGORIES = [
  { key: "fitness", icon: "fitness_center", color: "#ff570e", bg: "rgba(255,87,14,0.2)", border: "rgba(255,87,14,0.4)" },
  { key: "reading", icon: "menu_book", color: "#3b82f6", bg: "rgba(59,130,246,0.2)", border: "rgba(59,130,246,0.4)" },
  { key: "mindfulness", icon: "self_improvement", color: "#a855f7", bg: "rgba(168,85,247,0.2)", border: "rgba(168,85,247,0.4)" },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("fitness");
  const [newHabit, setNewHabit] = useState({ name: "", description: "", selfieRequired: true });

  const saveHabit = () => {
    if (!newHabit.name.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newHabit.name,
        description: newHabit.description,
        category: selectedCategory,
        selfieRequired: newHabit.selfieRequired,
        streak: 0,
        status: "Active",
        color: "#ff570e",
        glow: "#ff570e",
      },
    ]);
    setShowModal(false);
    setNewHabit({ name: "", description: "", selfieRequired: true });
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">Habit-proof</h1>
        <div className="flex items-center gap-3">
          <button className="p-1 text-[#e5beb2] hover:opacity-80">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#ac897e]/30 bg-[#353437] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#e5beb2]" style={{ fontSize: 18 }}>person</span>
          </div>
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
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase active:scale-95 transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_12px_rgba(255,87,14,0.4)]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            NEW HABIT
          </button>
        </section>

        {/* Habit List */}
        <div className="grid grid-cols-1 gap-3.5 w-full">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="glass-card rounded-2xl p-4 relative overflow-hidden group border border-[#353437]/60 bg-[#201f21]/80"
            >
              {/* Neon scan line on hover */}
              <div className="neon-scan-line hidden group-hover:block" />

              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: habit.color, boxShadow: `0 0 8px ${habit.glow}` }}
                  />
                  <h3 className="text-base font-bold text-white truncate">{habit.name}</h3>
                </div>
                {habit.selfieRequired ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffb59d]/10 border border-[#ffb59d]/20 text-[#ffb59d] flex-shrink-0">
                    <span className="material-symbols-outlined icon-fill text-xs">face</span>
                    Selfie Required
                  </div>
                ) : (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: habit.status === "Active" ? "rgba(78,222,163,0.1)" : "#353437",
                      border: habit.status === "Active" ? "1px solid rgba(78,222,163,0.2)" : "1px solid rgba(172,137,126,0.1)",
                      color: habit.status === "Active" ? "#4edea3" : "#e5beb2",
                    }}
                  >
                    {habit.status}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2">
                {habit.description ? (
                  <p className="text-xs text-[#e5beb2] truncate flex-1 min-w-0">{habit.description}</p>
                ) : (
                  <div className="flex -space-x-1 flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-[#353437] border border-[#131315]" />
                    <div className="w-5 h-5 rounded-full bg-[#201f21] border border-[#131315]" />
                    <div className="w-5 h-5 rounded-full bg-[#ff570e]/20 border border-[#131315] text-[#ffb59d] text-[9px] font-bold flex items-center justify-center">
                      +12
                    </div>
                  </div>
                )}

                {habit.progress !== undefined ? (
                  <div className="flex items-center gap-2 flex-1 ml-3 min-w-0">
                    <div className="h-1.5 flex-1 rounded-full overflow-hidden bg-[#201f21]">
                      <div className="h-full bg-[#ff570e]" style={{ width: `${habit.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#ffb59d]">{habit.progress}%</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[#ffb59d] flex-shrink-0">
                    <span className="material-symbols-outlined icon-fill text-lg">local_fire_department</span>
                    <span className="text-xl font-extrabold">{String(habit.streak).padStart(2, "0")}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Habit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="w-full max-w-[440px] rounded-t-3xl p-5 pb-10 shadow-2xl relative bg-[#1b1b1d] border-t border-[#5c4037]/40">
            {/* Drag handle */}
            <div
              className="w-10 h-1 rounded-full mx-auto mb-6 bg-[#353437] cursor-pointer"
              onClick={() => setShowModal(false)}
            />
            <header className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">Initialize Habit</h2>
              <p className="text-xs text-[#e5beb2] mt-0.5">Define your high-performance objective.</p>
            </header>

            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); saveHabit(); }}>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Habit Title</label>
                  <input
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
                    placeholder="e.g. Morning Sprint"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Mission Parameters</label>
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-2 block">Neural Category</label>
                <div className="flex gap-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setSelectedCategory(cat.key)}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                      style={{
                        background: selectedCategory === cat.key ? cat.bg : "transparent",
                        border: `2px solid ${selectedCategory === cat.key ? cat.color : "rgba(92,64,55,0.3)"}`,
                        boxShadow: selectedCategory === cat.key ? `0 0 12px ${cat.color}40` : "none",
                      }}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ color: cat.color }}>{cat.icon}</span>
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
                    <p className="text-[10px] text-[#e5beb2]">Biometric proof of execution</p>
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
                className="w-full py-3 rounded-xl text-sm font-bold tracking-wider uppercase active:scale-[0.98] transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_14px_rgba(255,87,14,0.4)]"
              >
                Save Habit
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
