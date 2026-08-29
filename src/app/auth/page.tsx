"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }
    if (tab === "signup" && !name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    try {
      if (tab === "login") {
        await api.auth.login(email.trim(), password.trim());
      } else {
        await api.auth.signup(name.trim(), email.trim(), password.trim());
      }
      setDone(true);
      setTimeout(() => router.push("/"), 400);
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please check credentials or backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0c] text-[#e5e1e4] flex items-center justify-center p-4 lg:p-12 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="glow-accent" style={{ top: -120, left: -120, width: 400, height: 400, opacity: 0.15 }} />
      <div className="glow-accent" style={{ bottom: -120, right: -120, width: 500, height: 500, opacity: 0.12 }} />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        {/* Left Side: Desktop Branding & Value Proposition (Hidden on small mobile, visible on lg) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col space-y-6 pr-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff570e] to-[#ff8c53] flex items-center justify-center shadow-[0_0_24px_rgba(255,87,14,0.5)]">
              <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: 28 }}>bolt</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white uppercase">
                HABIT<span className="text-[#ff570e]">PROOF</span>
              </h1>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">
                Biometric Habit Accountability Engine
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h2 className="text-4xl font-black text-white tracking-tight leading-tight">
              Stop faking streaks. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff570e] to-[#ffb59d]">
                Prove execution with AI.
              </span>
            </h2>
            <p className="text-sm text-[#e5beb2] leading-relaxed max-w-lg">
              HabitProof combines computer vision face landmark extraction with anti-spoofing liveness validation so you stay truly accountable to your goals.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-4 border-t border-[#353437]/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#201f21] border border-[#ff570e]/40 flex items-center justify-center text-[#ffb59d]">
                <span className="material-symbols-outlined text-base">center_focus_strong</span>
              </div>
              <p className="text-xs font-semibold text-white">512-D Facial Vector Biometrics with ZepIris AI</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#201f21] border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3]">
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
              <p className="text-xs font-semibold text-white">Real-Time Anti-Spoofing & Liveness Detection</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#201f21] border border-[#ffb59d]/40 flex items-center justify-center text-[#ffb59d]">
                <span className="material-symbols-outlined text-base">local_fire_department</span>
              </div>
              <p className="text-xs font-semibold text-white">Immutable Streak Tracking & Check-In History</p>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card Form */}
        <div className="w-full lg:col-span-5 max-w-md mx-auto">
          {/* Mobile-only brand badge */}
          <div className="lg:hidden mb-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#ff570e] flex items-center justify-center shadow-[0_0_20px_rgba(255,87,14,0.5)] mb-2">
              <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: 28 }}>bolt</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase text-white">
              HABIT<span className="text-[#ff570e]">PROOF</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#e5beb2]/70 font-semibold">
              Biometric Habit Accountability
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[#5c4037]/50 bg-[#1b1b1d]/90 shadow-2xl space-y-5">
            {/* Tabs */}
            <div className="flex border-b border-[#353437]/50 mb-4">
              <button
                type="button"
                onClick={() => { setTab("login"); setErrorMsg(""); }}
                className={`flex-1 pb-3 text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                  tab === "login"
                    ? "text-[#ffb59d] border-b-2 border-[#ff570e]"
                    : "text-[#e5beb2] hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setTab("signup"); setErrorMsg(""); }}
                className={`flex-1 pb-3 text-xs font-extrabold uppercase tracking-widest transition-all cursor-pointer ${
                  tab === "signup"
                    ? "text-[#ffb59d] border-b-2 border-[#ff570e]"
                    : "text-[#e5beb2] hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-center font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "signup" && (
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffb59d] mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl px-4 py-3 text-sm bg-[#131315] border border-[#353437] text-white focus:outline-none focus:border-[#ff570e] transition-colors"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffb59d] mb-1 block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="athlete@habitproof.com"
                  className="w-full rounded-xl px-4 py-3 text-sm bg-[#131315] border border-[#353437] text-white focus:outline-none focus:border-[#ff570e] transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffb59d]">
                    Password
                  </label>
                  {tab === "login" && (
                    <span className="text-[10px] text-[#ac897e] hover:text-[#ffb59d] cursor-pointer">
                      Forgot?
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-4 py-3 text-sm bg-[#131315] border border-[#353437] text-white focus:outline-none focus:border-[#ff570e] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 rounded-xl text-xs font-black tracking-widest uppercase active:scale-[0.98] transition-all bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] shadow-[0_4px_18px_rgba(255,87,14,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">sync</span>
                    Authenticating...
                  </>
                ) : done ? (
                  <>
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Authenticated
                  </>
                ) : tab === "login" ? (
                  "Sign In to HabitProof"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
