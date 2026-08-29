"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Command Dashboard", subtitle: "Real-time habit execution telemetry" },
  "/habits": { title: "Habits Manager", subtitle: "Consistency protocols and objectives" },
  "/verify": { title: "Biometric Proof Scanner", subtitle: "AI landmark verification and liveness check" },
  "/face-enroll": { title: "Face Biometrics Profile", subtitle: "Reference template enrolled in ZepIris engine" },
  "/timeline": { title: "Verification Timeline", subtitle: "Immutable historical activity log" },
};

interface DesktopHeaderProps {
  onOpenSettings: () => void;
}

export default function DesktopHeader({ onOpenSettings }: DesktopHeaderProps) {
  const pathname = usePathname();
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const dash = await api.dashboard.get();
        if (dash) {
          setCurrentStreak(dash.bestStreak || 0);
        }
      } catch {
        // ignore
      }
    }
    if (pathname !== "/auth") {
      loadStats();
    }
  }, [pathname]);

  if (pathname === "/auth") return null;

  const currentMeta = PAGE_TITLES[pathname] || {
    title: "HabitProof",
    subtitle: "High performance habit system",
  };

  return (
    <header className="hidden lg:flex items-center justify-between px-8 h-20 bg-[#131315]/80 backdrop-blur-xl border-b border-[#353437]/50 sticky top-0 z-20 w-full">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">
          {currentMeta.title}
        </h2>
        <p className="text-xs text-[#e5beb2] mt-0.5">
          {currentMeta.subtitle}
        </p>
      </div>

      {/* Right Stats & Actions */}
      <div className="flex items-center gap-4">
        {/* Active Streak Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#201f21] border border-[#ff570e]/30 shadow-sm">
          <span className="material-symbols-outlined icon-fill text-[#ffb59d] text-lg animate-pulse">
            local_fire_department
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-extrabold text-white">{currentStreak}</span>
            <span className="text-[10px] font-bold text-[#ffb59d] uppercase">Day Streak</span>
          </div>
        </div>

        {/* Quick New Habit Button */}
        <Link
          href="/habits"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase bg-[#ff570e] text-[#511500] hover:bg-[#ff6f30] active:scale-95 transition-all shadow-[0_2px_12px_rgba(255,87,14,0.35)]"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Habit
        </Link>

        {/* Verify Shortcut */}
        <Link
          href="/verify"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase bg-[#2a2a2c] hover:bg-[#353437] text-[#e5beb2] hover:text-white border border-[#353437] transition-all"
        >
          <span className="material-symbols-outlined text-sm text-[#ffb59d]">photo_camera</span>
          Verify Proof
        </Link>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-9 h-9 rounded-xl bg-[#201f21] hover:bg-[#2a2a2c] border border-[#353437] text-[#e5beb2] hover:text-white flex items-center justify-center transition-colors"
          title="Open Settings"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
        </button>
      </div>
    </header>
  );
}
