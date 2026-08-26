"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, CheckInResponse, HabitResponse } from "@/services/api";

const FILTERS = ["ALL ACTIVITY", "FITNESS", "READING", "MEDITATION"];

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
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">
          Habit-proof
        </h1>
        <button onClick={() => setShowSettings(true)} className="text-[#ffb59d] hover:opacity-80 p-1">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-4 w-full">
        {/* Section Header */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mb-2">Activity History</h2>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    isActive
                      ? "bg-[#ff570e] text-[#511500] border-[#ff570e]"
                      : "bg-[#2a2a2c] border-[#353437] text-[#e5beb2] hover:bg-[#353437]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Content */}
        {loading ? (
          <div className="p-8 text-center glass-card rounded-2xl border border-[#353437]/40 text-[#e5beb2] text-xs">
            <span className="material-symbols-outlined animate-spin text-2xl mb-1 text-[#ff570e]">sync</span>
            <p>Loading your activity history...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-2xl border border-[#353437]/40 space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#ffb59d]">history</span>
            <p className="text-sm font-bold text-white">No activity records found</p>
            <p className="text-xs text-[#e5beb2]">Complete daily check-ins to view your verification timeline.</p>
          </div>
        ) : (
          <div className="space-y-3 relative">
            {/* Vertical timeline connector */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#353437]/60 -z-0" />

            {filteredEntries.map((entry) => {
              const habit = habitsMap[entry.habitId];
              const dateObj = new Date(entry.checkInDate);
              const dateFormatted = isNaN(dateObj.getTime())
                ? entry.checkInDate
                : dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

              return (
                <div
                  key={entry.id}
                  className="glass-card rounded-2xl p-4 ml-8 relative border border-[#353437]/60 bg-[#201f21]/80 space-y-2"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[29px] top-5 w-3.5 h-3.5 rounded-full bg-[#ff570e] border-2 border-[#131315] shadow-[0_0_8px_#ff570e]" />

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#ffb59d]">
                        {habit?.category || "HABIT PROOF"}
                      </span>
                      <h3 className="text-sm font-bold text-white">{habit?.title || "Daily Check-In"}</h3>
                    </div>
                    <span className="text-[10px] text-[#e5beb2]">{dateFormatted}</span>
                  </div>

                  {entry.note && (
                    <p className="text-xs text-[#e5beb2] bg-[#131315]/50 p-2 rounded-lg border border-[#353437]/30">
                      &ldquo;{entry.note}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-[#353437]/30 text-xs">
                    <div className="flex items-center gap-1 text-[#4edea3]">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span className="text-[10px] font-bold">
                        {entry.verificationStatus === "VERIFIED" ? "Verified" : "Pending"}
                      </span>
                    </div>

                    {entry.faceMatchScore > 0 && (
                      <span className="text-[10px] font-bold text-[#ffb59d]">
                        Match: {Math.round(entry.faceMatchScore * 100)}%
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
