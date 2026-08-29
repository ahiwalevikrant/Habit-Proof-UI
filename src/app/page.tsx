"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, DashboardResponse, HabitResponse } from "@/services/api";

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
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
      router.push(`/verify?habitId=${habit.id}`);
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
      {/* Mobile Top App Bar (Hidden on Laptop/Desktop) */}
      <header className="lg:hidden sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
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

      {/* Main Content Area */}
      <main className="flex-1 px-4 lg:px-8 pt-4 lg:pt-8 pb-28 lg:pb-12 space-y-6 w-full">
        {/* Bento Stats Grid - 4 columns on desktop, 2 on mobile */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Daily Goal Card */}
          <div className="col-span-2 lg:col-span-2 glass-card p-5 lg:p-6 rounded-2xl flex items-center justify-between overflow-hidden relative border border-[#353437]/60 bg-[#201f21]/80">
            <div className="flex flex-col z-10 flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#ff570e] animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">Execution Rate</span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mb-1">Daily Completion</h2>
              <p className="text-xs text-[#e5beb2] mb-3 truncate">
                <strong className="text-white">{completedCount}</strong> of <strong className="text-white">{totalCount}</strong> habits verified today
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl lg:text-5xl font-black text-[#ffb59d] tracking-tight">
                  {completionPct}
                </span>
                <span className="text-xl font-bold text-[#ffb59d]">%</span>
              </div>
            </div>

            {/* Circular Progress Ring */}
            <div className="relative w-24 h-24 lg:w-28 lg:h-28 flex items-center justify-center z-10 flex-shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="44" fill="transparent" stroke="#353437" strokeWidth="7" />
                <circle
                  cx="48" cy="48" r="44" fill="transparent"
                  stroke="#ff570e"
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,87,14,0.6))" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined icon-fill text-[#ffb59d]" style={{ fontSize: 28 }}>bolt</span>
              </div>
            </div>

            {/* Ambient glow */}
            <div
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full pointer-events-none"
              style={{ width: 160, height: 160, background: "rgba(255,181,157,0.08)", filter: "blur(50px)" }}
            />
          </div>

          {/* Active Streak Card */}
          <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-[#353437]/60 bg-[#201f21]/80 hover:border-[#ff570e]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#ff570e]/15 border border-[#ff570e]/30 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined icon-fill text-[#ffb59d]" style={{ fontSize: 28 }}>local_fire_department</span>
            </div>
            <span className="text-3xl font-black text-white tracking-tight">
              {currentStreak}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">Active Streak</span>
            <span className="text-[10px] text-[#e5beb2]">Consecutive Days</span>
          </div>

          {/* Longest Streak / Biometric Shield */}
          <div className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-1 border border-[#353437]/60 bg-[#201f21]/80 hover:border-[#4edea3]/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#00a572]/15 border border-[#4edea3]/30 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 28 }}>verified_user</span>
            </div>
            <span className="text-3xl font-black text-white tracking-tight">
              {longestStreak}
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4edea3]">Peak Record</span>
            <span className="text-[10px] text-[#e5beb2]">Longest Streak</span>
          </div>
        </section>

        {/* 2-Column Responsive Desktop Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* Left Column: Today's Daily Habits List (7 cols on desktop) */}
          <section className="lg:col-span-7 space-y-4 w-full">
            <div className="flex justify-between items-center px-1">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Today&apos;s Execution Protocols</h3>
                <p className="text-xs text-[#e5beb2]">Complete and verify with AI camera proof</p>
              </div>
              <Link
                href="/habits"
                className="text-xs font-bold text-[#ffb59d] tracking-wider uppercase hover:text-white px-3 py-1.5 rounded-lg bg-[#201f21] border border-[#353437] transition-colors"
              >
                + Add Habit
              </Link>
            </div>

            {loading ? (
              <div className="p-12 text-center glass-card rounded-2xl border border-[#353437]/40 text-[#e5beb2] text-xs space-y-2">
                <span className="material-symbols-outlined animate-spin text-3xl text-[#ff570e]">sync</span>
                <p className="font-semibold">Loading your active protocols...</p>
              </div>
            ) : habits.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-2xl border border-[#353437]/40 space-y-3 bg-[#201f21]/50">
                <div className="w-14 h-14 rounded-2xl bg-[#ff570e]/15 border border-[#ff570e]/30 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl text-[#ffb59d]">checklist</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">No active habits yet</p>
                  <p className="text-xs text-[#e5beb2] mt-0.5">Define your daily workout, reading, or study routines to start tracking.</p>
                </div>
                <Link
                  href="/habits"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-[#ff570e] text-[#511500] hover:bg-[#ff6f30] shadow-[0_2px_12px_rgba(255,87,14,0.4)] transition-all"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Create First Habit
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {habits.map((habit) => {
                  const todayStr = new Date().toISOString().split("T")[0];
                  const isCompletedToday = habit.lastCheckInDate === todayStr;

                  return (
                    <div
                      key={habit.id}
                      className="glass-card p-4 lg:p-5 rounded-2xl relative overflow-hidden group border border-[#353437]/60 bg-[#201f21]/80 hover:border-[#5c4037]/70 transition-all shadow-sm"
                      style={{
                        borderLeft: isCompletedToday ? "4px solid rgba(78,222,163,0.8)" : "4px solid #ff570e",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              background: isCompletedToday ? "#4edea3" : "#ff570e",
                              boxShadow: isCompletedToday ? "0 0 10px #4edea3" : "0 0 10px #ff570e",
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              className="text-sm lg:text-base font-bold text-white truncate"
                              style={{ textDecoration: isCompletedToday ? "line-through" : "none", opacity: isCompletedToday ? 0.7 : 1 }}
                            >
                              {habit.title}
                            </h4>
                            {habit.description && (
                              <p className="text-xs text-[#e5beb2] truncate mt-0.5">{habit.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {habit.requiresSelfie && (
                            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#ff570e]/15 border border-[#ff570e]/30 text-[10px] font-extrabold uppercase tracking-wider text-[#ffb59d]">
                              <span className="material-symbols-outlined text-xs">center_focus_strong</span>
                              Biometric
                            </span>
                          )}
                          {isCompletedToday ? (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">done_all</span>
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => verifyHabit(habit)}
                              disabled={verifyingId === habit.id}
                              className="px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-95 bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] shadow-[0_2px_12px_rgba(255,87,14,0.35)] cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                            >
                              <span className="material-symbols-outlined text-sm">
                                {habit.requiresSelfie ? "photo_camera" : "check"}
                              </span>
                              {verifyingId === habit.id ? "Logging..." : habit.requiresSelfie ? "Verify Selfie" : "Check In"}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#353437]/40 text-xs text-[#e5beb2]">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-[#ffb59d]">local_fire_department</span>
                            Streak: <strong className="text-white ml-0.5">{habit.currentStreak} days</strong>
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1 text-[#ac897e]">
                            <span className="material-symbols-outlined text-sm">history</span>
                            Best: {habit.longestStreak}d
                          </span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffb59d]/80">
                          {habit.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Right Column: AI Telemetry & Proof Feed (5 cols on desktop) */}
          <section className="lg:col-span-5 space-y-4 w-full">
            {/* AI Security Banner Card */}
            <div className="glass-card p-5 rounded-2xl border border-[#5c4037]/50 bg-gradient-to-br from-[#201f21] to-[#171719] space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3]">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Biometric Proof Engine</h4>
                    <p className="text-[10px] text-[#4edea3] font-semibold">ZepIris AI Vector Matching</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse" />
              </div>

              <p className="text-xs text-[#e5beb2] leading-relaxed">
                HabitProof guarantees true personal accountability. Check-ins analyze 512 facial landmark points in real-time with zero spoofing.
              </p>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  href="/verify"
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] text-xs font-bold uppercase tracking-wider text-center transition-all shadow-[0_2px_10px_rgba(255,87,14,0.3)]"
                >
                  Launch Camera Scanner
                </Link>
                <Link
                  href="/face-enroll"
                  className="py-2.5 px-3 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] border border-[#353437] text-[#e5beb2] hover:text-white text-xs font-bold uppercase tracking-wider text-center transition-all"
                >
                  Face ID
                </Link>
              </div>
            </div>

            {/* Recent Verifications / Proof Logs */}
            <div className="glass-card p-5 rounded-2xl border border-[#353437]/60 bg-[#201f21]/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white tracking-tight">Recent Proof Feed</h4>
                <Link href="/timeline" className="text-[10px] font-bold text-[#ffb59d] uppercase hover:underline">
                  View All
                </Link>
              </div>

              {dashboardData?.recentCheckIns && dashboardData.recentCheckIns.length > 0 ? (
                <div className="space-y-2.5">
                  {dashboardData.recentCheckIns.slice(0, 4).map((checkIn) => (
                    <div
                      key={checkIn.id}
                      className="p-3 rounded-xl border border-[#353437]/50 bg-[#171719] flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#2a2a2c] flex items-center justify-center flex-shrink-0 border border-[#5c4037]/30">
                          <span className="material-symbols-outlined text-[#4edea3]" style={{ fontSize: 18 }}>
                            check_circle
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{checkIn.note || "Habit Verified"}</p>
                          <p className="text-[10px] text-[#e5beb2]">{new Date(checkIn.checkInDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {checkIn.faceMatchScore > 0 && (
                        <span className="text-[10px] font-bold text-[#4edea3] bg-[#00a572]/15 px-2 py-0.5 rounded border border-[#4edea3]/20 flex-shrink-0">
                          {Math.round(checkIn.faceMatchScore * 100)}% Match
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[#e5beb2] border border-dashed border-[#353437] rounded-xl space-y-1">
                  <span className="material-symbols-outlined text-2xl text-[#ac897e]">history_toggle_off</span>
                  <p className="font-semibold text-white">No proof logs yet today</p>
                  <p className="text-[11px]">Check in with your camera to populate this telemetry stream.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
