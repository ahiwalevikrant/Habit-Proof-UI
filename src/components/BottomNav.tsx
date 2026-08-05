"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/habits", icon: "checklist", label: "Habits" },
  { href: "/verify", icon: "center_focus_strong", label: "Verify", isFab: true },
  { href: "/face-enroll", icon: "fingerprint", label: "Biometrics" },
  { href: "/timeline", icon: "history", label: "History" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-50 rounded-t-2xl glass-nav shadow-[0_-4px_25px_rgba(0,0,0,0.6)] flex justify-between items-center px-1 py-2"
      style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        if (item.isFab) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 min-w-0 flex flex-col items-center justify-center -mt-6"
            >
              <div
                className="w-13 h-13 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-[0_4px_16px_rgba(252,82,0,0.6)]"
                style={{ background: "#ff570e", width: "52px", height: "52px" }}
              >
                <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: 26 }}>
                  {item.icon}
                </span>
              </div>
              <span
                className="font-bold uppercase tracking-tight text-[10px] mt-1 text-center truncate max-w-full"
                style={{ color: isActive ? "#ff570e" : "#e5beb2" }}
              >
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-transform active:scale-105"
          >
            <span
              className={`material-symbols-outlined transition-all ${isActive ? "icon-fill" : ""}`}
              style={{
                color: isActive ? "#ffb59d" : "#ac897e",
                filter: isActive ? "drop-shadow(0 0 6px rgba(255,87,14,0.6))" : "none",
                fontSize: 22,
              }}
            >
              {item.icon}
            </span>
            <span
              className="font-bold uppercase tracking-tight text-[10px] mt-0.5 text-center truncate max-w-full"
              style={{ color: isActive ? "#ffb59d" : "#ac897e" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
