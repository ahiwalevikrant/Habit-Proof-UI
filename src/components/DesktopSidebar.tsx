"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/services/api";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard", badge: null },
  { href: "/habits", icon: "checklist", label: "My Habits", badge: null },
  { href: "/verify", icon: "center_focus_strong", label: "Live Verify", badge: "AI" },
  { href: "/face-enroll", icon: "fingerprint", label: "Biometrics", badge: null },
  { href: "/timeline", icon: "history", label: "Activity History", badge: null },
];

interface DesktopSidebarProps {
  onOpenSettings?: () => void;
}

export default function DesktopSidebar({ onOpenSettings }: DesktopSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    setUser(api.auth.getCurrentUser());
  }, [pathname]);

  // Don't show sidebar on auth page
  if (pathname === "/auth") return null;

  const handleLogout = () => {
    api.auth.logout();
    router.push("/auth");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#131315] border-r border-[#353437]/60 flex-shrink-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#353437]/50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff570e] to-[#ff8c53] flex items-center justify-center shadow-[0_0_20px_rgba(255,87,14,0.4)] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: 24 }}>bolt</span>
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white uppercase leading-none">
              HABIT<span className="text-[#ff570e]">PROOF</span>
            </h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#ffb59d]/80 mt-1">
              Biometric Engine
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#ac897e]">
          Platform Navigation
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all group ${
                isActive
                  ? "bg-[#ff570e] text-[#511500] shadow-[0_4px_16px_rgba(255,87,14,0.35)]"
                  : "text-[#e5beb2] hover:text-white hover:bg-[#201f21] border border-transparent hover:border-[#353437]/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`material-symbols-outlined transition-transform group-hover:scale-110 ${
                    isActive ? "icon-fill" : ""
                  }`}
                  style={{ fontSize: 20 }}
                >
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-[#511500] text-[#ffb59d]"
                      : "bg-[#ff570e]/20 text-[#ffb59d] border border-[#ff570e]/30"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick Verify Banner in Sidebar */}
        <div className="pt-6 px-1">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#201f21] to-[#171719] border border-[#5c4037]/40 space-y-2.5">
            <div className="flex items-center gap-2 text-[#ffb59d]">
              <span className="material-symbols-outlined text-base">verified</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Proof Engine</span>
            </div>
            <p className="text-[11px] text-[#e5beb2] leading-relaxed">
              Maintain daily streaks with live facial verification.
            </p>
            <Link
              href="/verify"
              className="block w-full py-2 text-center rounded-xl bg-[#2a2a2c] hover:bg-[#353437] border border-[#353437] text-white text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              Open Camera
            </Link>
          </div>
        </div>
      </div>

      {/* User Profile & Actions Footer */}
      <div className="p-4 border-t border-[#353437]/50 bg-[#171719]/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full border-2 border-[#ffb59d] bg-[#2a2a2c] flex items-center justify-center flex-shrink-0 overflow-hidden">
              <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 20 }}>person</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || "Athlete User"}</p>
              <p className="text-[10px] text-[#e5beb2] truncate">{user?.email || "athlete@habitproof.com"}</p>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-lg text-[#e5beb2] hover:text-white hover:bg-[#2a2a2c] transition-colors"
            title="Settings"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-300 hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
