"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => router.push("/"), 600);
    }, 1500);
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden bg-[#131315] text-[#e5e1e4]">
      {/* Atmospheric glow blobs */}
      <div className="glow-accent" style={{ top: -100, left: -100 }} />
      <div className="glow-accent" style={{ bottom: -100, right: -100 }} />

      {/* Logo */}
      <header className="mb-6 flex flex-col items-center animate-fade-in z-10 text-center">
        <div className="mb-3 w-12 h-12 rounded-2xl flex items-center justify-center bg-[#ff570e] shadow-[0_0_20px_rgba(255,87,14,0.5)]">
          <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: 28 }}>bolt</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tighter uppercase text-white">
          HABIT<span className="text-[#ff570e]">PROOF</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest mt-0.5 text-[#e5beb2]/70 font-semibold">
          Elite Habit Engineering
        </p>
      </header>

      {/* Auth Card */}
      <main className="w-full glass-card rounded-2xl p-5 border border-[#353437]/60 bg-[#201f21]/80 z-10">
        {/* Tabs */}
        <div className="flex border-b border-[#353437]/50 mb-5">
          <button
            onClick={() => setTab("login")}
            className="flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              color: tab === "login" ? "#ffb59d" : "#e5beb2",
              borderBottom: tab === "login" ? "2px solid #ffb59d" : "2px solid transparent",
            }}
          >
            Log In
          </button>
          <button
            onClick={() => setTab("signup")}
            className="flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              color: tab === "signup" ? "#ffb59d" : "#e5beb2",
              borderBottom: tab === "signup" ? "2px solid #ffb59d" : "2px solid transparent",
            }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Full Name</label>
              <input
                type="text"
                required
                placeholder="Vikrant Ahiwale"
                className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Athlete Email</label>
            <input
              type="email"
              required
              placeholder="athlete@habitproof.com"
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2]">Passcode</label>
              {tab === "login" && (
                <a href="#" className="text-[9px] text-[#ffb59d] hover:underline">Forgot?</a>
              )}
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl text-xs font-bold tracking-wider uppercase active:scale-[0.98] transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_14px_rgba(255,87,14,0.4)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Authenticating...
              </>
            ) : done ? (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Verified
              </>
            ) : tab === "login" ? (
              "Enter System"
            ) : (
              "Create Account"
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => router.push("/verify")}
              className="text-[10px] text-[#e5beb2] hover:text-[#ffb59d] transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <span className="material-symbols-outlined text-sm text-[#ffb59d]">fingerprint</span>
              Biometric Fast Pass
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
