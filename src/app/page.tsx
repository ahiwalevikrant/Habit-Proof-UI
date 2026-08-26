"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, HabitResponse, DashboardResponse } from "@/services/api";

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      // Check auth status
      if (!api.auth.isAuthenticated()) {
        router.push("/auth");
        return;
      }

      setUser(api.auth.getCurrentUser());

      try {
        const [dash, habitsList] = await Promise.all([
          api.dashboard.get(),
          api.habits.list(),
        ]);
        setDashboardData(dash);
        setHabits(habitsList || []);
      } catch (err) {
        console.error("Failed to load dashboard data from backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const verifyHabit = async (habit: HabitResponse) => {
    if (habit.requiresSelfie) {
      router.push("/verify");
      return;
    }

    setVerifyingId(habit.id);
    try {
      await api.checkins.create(habit.id, null, "Quick Dashboard Check-In");
      // Refresh dashboard data
      const [dash, habitsList] = await Promise.all([
        api.dashboard.get(),
        api.habits.list(),
      ]);
      setDashboardData(dash);
      setHabits(habitsList || []);
    } catch (err: any) {
      alert(err.message || "Verification failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const totalCount = dashboardData?.totalHabits ?? habits.length;
  const completedCount = dashboardData?.completedToday ?? 0;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentStreak = dashboardData?.bestStreak ?? (habits.length > 0 ? Math.max(...habits.map((h) => h.currentStreak)) : 0);
  const longestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.longestStreak)) : (dashboardData?.bestStreak ?? 0);
  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (completionPct / 100) * circumference;

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#ffb59d] flex-shrink-0 bg-[#2a2a2c] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 20 }}>person</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-[#e5beb2] leading-tight">Welcome back</span>
            <span className="text-[17px] font-bold text-white tracking-tight leading-tight">
              {user?.name ? user.name.split(" ")[0] : "Athlete"}!
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettings(true)} className="p-1.5 hover:opacity-80 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 24 }}>settings</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-5 w-full overflow-x-hidden">
        {/* Bento Stats Grid */}
        <section className="grid grid-cols-2 gap-3 w-full">
          {/* Daily Goal — full width */}
          <div className="col-span-2 glass-card p-5 rounded-2xl flex items-center justify-between overflow-hidden relative border border-[#353437]/60 bg-[#201f21]/80">
            <div className="flex flex-col z-10 flex-1 min-w-0 pr-2">
              <h2 className="text-lg font-bold text-white tracking-tight mb-0.5">Daily Goal</h2>
              <p className="text-xs text-[#e5beb2] mb-3 truncate">
                {completedCount} of {totalCount} habits completed today
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#ffb59d] tracking-tight">
                  {completionPct}
                </span>
                <span className="text-lg font-bold text-[#ffb59d]">%</span>
              </div>
            </div>
            {/* Circular Progress Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center z-10 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="44" fill="transparent" stroke="#353437" strokeWidth="7" />
                <circle
                  cx="48" cy="48" r="44" fill="transparent"
                  stroke="#ff570e"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px rgba(255,87,14,0.6))" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined icon-fill text-[#ffb59d]" style={{ fontSize: 26 }}>bolt</span>
              </div>
            </div>
            {/* Ambient glow */}
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 140, height: 140, background: "rgba(255,181,157,0.08)", filter: "blur(50px)" }}
            />
          </div>

          {/* Streak Counter */}
          <div className="glass-card p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 border border-[#353437]/60 bg-[#201f21]/80">
            <div className="streak-pulse">
              <span className="material-symbols-outlined icon-fill text-[#ffb59d]" style={{ fontSize: 32 }}>local_fire_department</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {currentStreak}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffb59d]">Active Streak</span>
          </div>

          {/* Longest Streak */}
          <div className="glass-card p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 border border-[#353437]/60 bg-[#201f21]/80">
            <div className="opacity-80">
              <span className="material-symbols-outlined text-[#ac897e]" style={{ fontSize: 32 }}>history</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {longestStreak}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2]">Longest Streak</span>
          </div>
        </section>

        {/* Daily Habits Section */}
        <section className="space-y-3 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white tracking-tight">Daily Habits</h3>
            <Link href="/habits" className="text-[11px] font-bold text-[#ffb59d] tracking-wider uppercase hover:underline">
              MANAGE
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center glass-card rounded-2xl border border-[#353437]/40 text-[#e5beb2] text-xs">
              <span className="material-symbols-outlined animate-spin text-2xl mb-1 text-[#ff570e]">sync</span>
              <p>Loading your active habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="p-6 text-center glass-card rounded-2xl border border-[#353437]/40 space-y-3">
              <span className="material-symbols-outlined text-4xl text-[#ffb59d]">checklist</span>
              <div>
                <p className="text-sm font-bold text-white">No habits created yet</p>
                <p className="text-xs text-[#e5beb2] mt-0.5">Start your routine by adding your first daily goal.</p>
              </div>
              <Link
                href="/habits"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase bg-[#ff570e] text-[#511500] shadow-[0_2px_12px_rgba(255,87,14,0.4)]"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Create First Habit
              </Link>
            </div>
          ) : (
            habits.map((habit) => {
              const todayStr = new Date().toISOString().split("T")[0];
              const isCompletedToday = habit.lastCheckInDate === todayStr;

              return (
                <div
                  key={habit.id}
                  className="glass-card p-4 rounded-2xl relative overflow-hidden group border border-[#353437]/60 bg-[#201f21]/80"
                  style={{
                    borderLeft: isCompletedToday ? "4px solid rgba(78,222,163,0.8)" : "4px solid #ff570e",
                    opacity: isCompletedToday ? 0.8 : 1,
                  }}
                >
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          background: isCompletedToday ? "#4edea3" : "#ff570e",
                          boxShadow: isCompletedToday ? "0 0 8px #4edea3" : "0 0 8px #ff570e",
                        }}
                      />
                      <h4
                        className="text-sm font-bold text-white truncate"
                        style={{ textDecoration: isCompletedToday ? "line-through" : "none" }}
                      >
                        {habit.title}
                      </h4>
                    </div>
                    {habit.requiresSelfie && !isCompletedToday && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ff570e]/15 border border-[#ff570e]/30 flex-shrink-0">
                        <span className="material-symbols-outlined icon-fill text-[#ffb59d]" style={{ fontSize: 12 }}>photo_camera</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#ffb59d]">Selfie ID</span>
                      </div>
                    )}
                    {isCompletedToday && (
                      <span className="text-[10px] font-bold tracking-wider text-[#4edea3] flex-shrink-0">COMPLETED</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 text-xs text-[#e5beb2]">
                      <span className="material-symbols-outlined text-sm text-[#ffb59d]">local_fire_department</span>
                      <span>Streak: <strong className="text-white">{habit.currentStreak}d</strong></span>
                    </div>

                    {!isCompletedToday && (
                      <button
                        onClick={() => verifyHabit(habit)}
                        disabled={verifyingId === habit.id}
                        className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all active:scale-95 bg-[#ffb59d] text-[#5d1900] shadow-[0_2px_10px_rgba(255,181,157,0.3)] cursor-pointer disabled:opacity-50"
                      >
                        {verifyingId === habit.id ? "LOGGING..." : habit.requiresSelfie ? "SCAN PHOTO" : "CHECK IN"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* Recent Verifications / Activity Feed */}
        {dashboardData?.recentCheckIns && dashboardData.recentCheckIns.length > 0 && (
          <section className="space-y-3 w-full">
            <h3 className="text-base font-bold text-white tracking-tight">Recent Proof Logs</h3>
            <div className="space-y-2">
              {dashboardData.recentCheckIns.slice(0, 5).map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="glass-card p-3 rounded-xl border border-[#353437]/50 bg-[#201f21]/70 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#2a2a2c] flex items-center justify-center flex-shrink-0 border border-[#5c4037]/30">
                      <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 18 }}>check_circle</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{checkIn.note || "Habit Check-In"}</p>
                      <p className="text-[10px] text-[#e5beb2]">{new Date(checkIn.checkInDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {checkIn.faceMatchScore > 0 && (
                    <span className="text-[10px] font-bold text-[#4edea3] bg-[#4edea3]/10 px-2 py-0.5 rounded border border-[#4edea3]/20">
                      {Math.round(checkIn.faceMatchScore * 100)}% Match
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
