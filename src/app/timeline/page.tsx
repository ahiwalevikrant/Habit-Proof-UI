"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, CheckInResponse, HabitResponse } from "@/services/api";

const FILTERS = ["ALL ACTIVITY", "FITNESS", "READING", "MEDITATION", "STUDY", "COOKING"];

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState("ALL ACTIVITY");
  const [showSettings, setShowSettings] = useState(false);
  const [checkIns, setCheckIns] = useState<CheckInResponse[]>([]);
  const [habitsMap, setHabitsMap] = useState<Record<number, HabitResponse>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        setLoading(true);
        const [dash, habits] = await Promise.all([
          api.dashboard.get(),
          api.habits.list(),
        ]);

        const map: Record<number, HabitResponse> = {};
        (habits || []).forEach((h) => {
          map[h.id] = h;
        });
        setHabitsMap(map);
        setCheckIns(dash?.recentCheckIns || []);
      } catch (err) {
        console.error("Failed to load timeline from backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  const filteredEntries = checkIns.filter((entry) => {
    if (activeFilter === "ALL ACTIVITY") return true;
    const habit = habitsMap[entry.habitId];
    return habit && habit.category === activeFilter;
  });

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">
          Habit-proof
        </h1>
        <button onClick={() => setShowSettings(true)} className="text-[#ffb59d] hover:opacity-80 p-1">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 lg:px-8 pt-4 lg:pt-8 pb-28 lg:pb-12 space-y-6 w-full max-w-5xl">
        {/* Header Section */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#ff570e]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">Audit Trail</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Execution Timeline</h2>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? "bg-[#ff570e] text-[#511500] border-[#ff570e] shadow-sm font-black"
                      : "bg-[#201f21] border-[#353437] text-[#e5beb2] hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </section>

        {/* Timeline Content */}
        {loading ? (
          <div className="p-16 text-center glass-card rounded-2xl border border-[#353437]/40 text-[#e5beb2] text-xs space-y-2">
            <span className="material-symbols-outlined animate-spin text-3xl mb-1 text-[#ff570e]">sync</span>
            <p className="font-semibold text-white">Loading activity history logs...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-[#353437]/40 space-y-3 bg-[#201f21]/40">
            <div className="w-14 h-14 rounded-2xl bg-[#2a2a2c] flex items-center justify-center mx-auto border border-[#353437]">
              <span className="material-symbols-outlined text-3xl text-[#ffb59d]">history</span>
            </div>
            <p className="text-base font-bold text-white">No activity records found</p>
            <p className="text-xs text-[#e5beb2] max-w-sm mx-auto">
              Complete daily habit check-ins with camera verification to build your historical streak audit trail.
            </p>
          </div>
        ) : (
          <div className="space-y-4 relative pl-4 sm:pl-6">
            {/* Vertical timeline line */}
            <div className="absolute left-6 sm:left-8 top-4 bottom-4 w-0.5 bg-[#353437]" />

            {filteredEntries.map((entry) => {
              const habit = habitsMap[entry.habitId];
              const dateObj = new Date(entry.checkInDate);
              const dateFormatted = isNaN(dateObj.getTime())
                ? entry.checkInDate
                : dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

              return (
                <div
                  key={entry.id}
                  className="glass-card rounded-2xl p-5 ml-8 relative border border-[#353437]/60 bg-[#201f21]/80 space-y-3 hover:border-[#5c4037] transition-all shadow-sm"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[37px] top-6 w-4 h-4 rounded-full bg-[#ff570e] border-3 border-[#131315] shadow-[0_0_10px_#ff570e]" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">
                        {habit?.category || "HABIT PROOF"}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">{habit?.title || "Daily Check-In"}</h3>
                    </div>
                    <span className="text-xs font-semibold text-[#e5beb2] bg-[#171719] px-3 py-1 rounded-lg border border-[#353437]/50 self-start sm:self-auto">
                      {dateFormatted}
                    </span>
                  </div>

                  {entry.note && (
                    <p className="text-xs text-[#e5beb2] bg-[#131315] p-3 rounded-xl border border-[#353437]/40 leading-relaxed">
                      &ldquo;{entry.note}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#353437]/40 text-xs">
                    <div className="flex items-center gap-1.5 text-[#4edea3] font-bold">
                      <span className="material-symbols-outlined text-base">verified</span>
                      <span>
                        {entry.verificationStatus === "VERIFIED" ? "Biometric Verified" : "Logged"}
                      </span>
                    </div>

                    {entry.faceMatchScore > 0 && (
                      <span className="text-[11px] font-extrabold text-[#ffb59d] bg-[#ff570e]/15 px-2.5 py-0.5 rounded-md border border-[#ff570e]/30">
                        {Math.round(entry.faceMatchScore * 100)}% Confidence Match
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
