"use client";
import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, HabitResponse, CheckInResponse } from "@/services/api";

const FALLBACK_HABITS = [
  { id: 1, name: "Morning 5K Run", selfieRequired: true, days: [true, true, false, false, false], streak: 5, completed: false },
  { id: 2, name: "Cold Plunge - 3 Min", selfieRequired: false, days: [true, true, true, false, false], streak: 3, completed: true },
];

const FALLBACK_PROOF_FEED = [
  { id: 1, name: "Sarah K.", habit: "5 AM Deep Work", match: 94, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlnwlm3Z8qaobEPcJ8zGbgugL0ThLDjDRxFVFqPx4lSz_yW4oEtFBqJWpdHHDRq6LAOwyeMef6L7V9mLXKVg4XFurWIgA70--AQGz7Q_utFc_3QeJtAwyq_XF03LJm-nF3x2oSpFpwixM2KAzY_TjUUHb-uynK0VfQMss_MosnKNgWyoUReB23uoaYyBXkriNJdlis9JiEUYMLHyfcRK0wUWwQ_3pl__YtMLBjEnW-lPtBdF18T3S1aoE1kIFEcKtE5EvxRJGZXGo", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJo1eo5Ny_iQTq5g85ZXlbkp7U-cl1kuACcPREBXHfXfOgmfbP-c6g5smYIV8ZeJNy9f1VFomQaT8X_gBX-NwwaDYbPrrHx4GaaQeJ1QPg8H7S9slf-umA_cmGkpsM6G26zMAxYpIT5OxzKe6ox15mKKjAnedcRF5i3D28oPVTptVMd7Hl__nx317HX9QAyedOT7z_w7P-HSlJ92jXw3KiPw9WCPo95SGc9QklaSsmvTT-DPNw8hrBmEOBk9EqaOcK-J9yo0kBR0g" },
  { id: 2, name: "Marcus V.", habit: "Mobility Flow", match: 98, imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA31cMv8QnLJ--RlyoDAjofvyCtrXVe9tPwF_imI_M1O3JhaYikXVurpwiEhktf8yz8vOognPvnb5iUKoOvx0kdNCP3pG0gX550lnMMa1BnSz-ik7eNwADbhoIxWOznXgBMWBLCm2YXLDh40KtJX8UKr8ZY7vN_jT-Wl8BoaLjj3Q_xy3B-9fUOv3wy4gEBvqZklnZ37chqF56TTfl2-a-tPKC6W7TfEi3TZDT5-kzDbXVspMZeU1E5fbbltUcse-_fmmFF4pQpF40", avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2a_j9Wd0XG4nvxhMDS5xwxO8pXUzMkheMVi8JJmexq2bBrA07HE05KhxykoXHVq1VRUCOgbrhbgnnkOaGloYZ28faizlWluAISZ5imJAJhzsS81jY_Y-tqfK3squhRbZacYqBoxNZTs-zNwYm1UMB4_r6tj9E3h0txt8hWnCaAR6SM9BsKf7A0zfBwJeUywwDlci75v6uE8je77kZvCk9lUuIaWEG0JFI4EqysTjxGi_8JMBPdmIEFvMniFYgwcqLQIXQsF0mkfk" },
];

export default function DashboardPage() {
  const [habits, setHabits] = useState(FALLBACK_HABITS);
  const [showSettings, setShowSettings] = useState(false);
  const [stats, setStats] = useState({
    pct: 50,
    activeStreak: 5,
    longestStreak: 12,
    verifiedCount: 1,
    totalCount: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [dashData, habitsData] = await Promise.all([
          api.dashboard.get(),
          api.habits.list(),
        ]);
        if (habitsData && habitsData.length > 0) {
          setHabits(
            habitsData.map((h) => ({
              id: h.id,
              name: h.title,
              selfieRequired: h.requiresSelfie,
              days: [true, true, false, false, false],
              streak: h.currentStreak,
              completed: h.lastCheckInDate === new Date().toISOString().split("T")[0],
            }))
          );
        }
        if (dashData) {
          setStats({
            pct: dashData.overallCompletionRate || 50,
            activeStreak: dashData.currentStreak || 5,
            longestStreak: dashData.longestStreak || 12,
            verifiedCount: dashData.completedTodayCount || 1,
            totalCount: dashData.totalHabits || 2,
          });
        }
      } catch (err) {
        console.warn("Using mock fallback data for dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const circumference = 2 * Math.PI * 44;
  const offset = circumference - (stats.pct / 100) * circumference;

  const verifyHabit = async (id: number) => {
    try {
      await api.checkins.create(id, null, "Verified via Dashboard");
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, completed: true } : h)));
      setStats((prev) => ({
        ...prev,
        verifiedCount: prev.verifiedCount + 1,
        pct: Math.round(((prev.verifiedCount + 1) / prev.totalCount) * 100),
      }));
    } catch (err) {
      // Local optimistic update
      setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, completed: true } : h)));
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#ffb59d] flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center bg-[#2a2a2c]">
              <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 18 }}>person</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-[#e5beb2] leading-tight">Welcome back</span>
            <span className="text-[17px] font-bold text-white tracking-tight leading-tight">Vikrant!</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1.5 hover:opacity-80 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 24 }}>notifications</span>
          </button>
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
              <p className="text-xs text-[#e5beb2] mb-3 truncate">{stats.verifiedCount} of {stats.totalCount} habits verified</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-[#ffb59d] tracking-tight">{stats.pct}</span>
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
            <span className="text-2xl font-extrabold text-white tracking-tight">{stats.activeStreak}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffb59d]">Active Streak</span>
          </div>

          {/* Longest Streak */}
          <div className="glass-card p-3.5 rounded-2xl flex flex-col items-center justify-center text-center gap-0.5 border border-[#353437]/60 bg-[#201f21]/80">
            <div className="opacity-80">
              <span className="material-symbols-outlined text-[#ac897e]" style={{ fontSize: 32 }}>history</span>
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">{stats.longestStreak}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2]">Longest Streak</span>
          </div>
        </section>

        {/* Daily Habits */}
        <section className="space-y-3 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-white tracking-tight">Daily Habits</h3>
            <button className="text-[11px] font-bold text-[#ffb59d] tracking-wider uppercase">VIEW ALL</button>
          </div>

          {habits.map((habit) => (
            <div
              key={habit.id}
              className="glass-card p-4 rounded-2xl relative overflow-hidden group border border-[#353437]/60 bg-[#201f21]/80"
              style={{
                borderLeft: habit.completed ? "4px solid rgba(78,222,163,0.6)" : "4px solid #ff570e",
                opacity: habit.completed ? 0.75 : 1,
              }}
            >
              {/* Scan line on hover */}
              {!habit.completed && <div className="scan-line hidden group-hover:block opacity-50" />}

              <div className="flex justify-between items-center gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: habit.completed ? "#4edea3" : "#ff570e",
                      boxShadow: habit.completed ? "0 0 8px #4edea3" : "0 0 8px #ff570e",
                    }}
                  />
                  <h4
                    className="text-sm font-bold text-white truncate"
                    style={{ textDecoration: habit.completed ? "line-through" : "none" }}
                  >
                    {habit.name}
                  </h4>
                </div>
                {habit.selfieRequired && !habit.completed && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ff570e]/15 border border-[#ff570e]/30 flex-shrink-0">
                    <span className="material-symbols-outlined icon-fill text-[#ffb59d]" style={{ fontSize: 12 }}>photo_camera</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#ffb59d]">Selfie ID</span>
                  </div>
                )}
                {habit.completed && (
                  <span className="text-[10px] font-bold tracking-wider text-[#4edea3] flex-shrink-0">VERIFIED</span>
                )}
              </div>

              {!habit.completed && (
                <div className="flex justify-between items-center gap-2 pt-1">
                  {/* Day dots */}
                  <div className="flex -space-x-1.5">
                    {["M", "T", "W", "T", "F"].map((d, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: habit.days[i] ? "#ffb59d" : "#353437",
                          color: habit.days[i] ? "#5d1900" : "#e5e1e4",
                          border: "2px solid #131315",
                        }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => verifyHabit(habit.id)}
                    className="px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all active:scale-95 bg-[#ffb59d] text-[#5d1900] shadow-[0_2px_10px_rgba(255,181,157,0.3)]"
                  >
                    VERIFY
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Recent Verifications Proof Feed */}
        <section className="space-y-3 w-full">
          <h3 className="text-base font-bold text-white tracking-tight">Recent Verifications</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x no-scrollbar">
            {FALLBACK_PROOF_FEED.map((item) => (
              <div
                key={item.id}
                className="w-[240px] snap-start glass-card rounded-2xl overflow-hidden flex flex-col flex-shrink-0 border border-[#353437]/60 bg-[#201f21]/80"
              >
                <div className="relative h-36 w-full">
                  <img
                    src={item.imageUrl}
                    alt={item.habit}
                    className="w-full h-full object-cover"
                  />
                  {/* Verified badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase bg-[#00a572]/90 text-white">
                    VERIFIED
                  </div>
                  {/* User avatar */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-[#131315]/70 backdrop-blur-md border border-white/10">
                    <div className="w-5 h-5 rounded-full overflow-hidden border border-[#ffb59d]">
                      <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-medium text-white">{item.name}</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-white truncate max-w-[140px]">{item.habit}</span>
                  <div className="flex items-center gap-1 text-[#4edea3]">
                    <span className="text-[10px] font-bold">{item.match}%</span>
                    <span className="material-symbols-outlined text-[14px]">fingerprint</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
