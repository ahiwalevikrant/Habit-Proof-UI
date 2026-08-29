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
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#0a0a0c] text-[#e5e1e4] relative overflow-hidden">
      {/* Background glow accents */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 450,
          height: 450,
          background: "radial-gradient(circle, rgba(255,87,14,0.15) 0%, rgba(0,0,0,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="w-full max-w-[440px] flex flex-col items-center z-10 space-y-6">
        {/* Brand Logo Header */}
        <header className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#ff570e] to-[#ff8c53] flex items-center justify-center shadow-[0_0_25px_rgba(255,87,14,0.5)]">
            <span className="material-symbols-outlined icon-fill text-white" style={{ fontSize: 32 }}>bolt</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase leading-none">
              HABIT<span className="text-[#ff570e]">PROOF</span>
            </h1>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d] mt-1">
              Biometric Habit Accountability
            </p>
          </div>
        </header>

        {/* Auth Glass Card */}
        <main className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-[#353437]/70 bg-[#1b1b1d]/90 shadow-2xl space-y-5">
          {/* Navigation Tabs */}
          <div className="flex border-b border-[#353437]/60 pb-1">
            <button
              type="button"
              onClick={() => { setTab("login"); setErrorMsg(""); }}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                tab === "login"
                  ? "text-[#ffb59d] border-b-2 border-[#ff570e]"
                  : "text-[#e5beb2] hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => { setTab("signup"); setErrorMsg(""); }}
              className={`flex-1 pb-3 text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                tab === "signup"
                  ? "text-[#ffb59d] border-b-2 border-[#ff570e]"
                  : "text-[#e5beb2] hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/30 text-red-300 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffb59d] mb-1.5 block">
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
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#ffb59d] mb-1.5 block">
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
              <div className="flex justify-between items-center mb-1.5">
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
                  Success
                </>
              ) : tab === "login" ? (
                "Sign In to HabitProof"
              ) : (
                "Create My Account"
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
