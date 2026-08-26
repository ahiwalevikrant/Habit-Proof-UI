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
      setTimeout(() => router.push("/"), 500);
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please check credentials or backend status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-[#131315] text-[#e5e1e4]">
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
      <main className="w-full glass-card rounded-2xl p-5 border border-[#353437]/60 bg-[#201f21]/80 z-10 space-y-4">
        {/* Tabs */}
        <div className="flex border-b border-[#353437]/50 mb-3">
          <button
            onClick={() => { setTab("login"); setErrorMsg(""); }}
            className="flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              color: tab === "login" ? "#ffb59d" : "#e5beb2",
              borderBottom: tab === "login" ? "2px solid #ffb59d" : "2px solid transparent",
            }}
          >
            Log In
          </button>
          <button
            onClick={() => { setTab("signup"); setErrorMsg(""); }}
            className="flex-1 pb-3 text-xs font-bold uppercase tracking-wider transition-all duration-200"
            style={{
              color: tab === "signup" ? "#ffb59d" : "#e5beb2",
              borderBottom: tab === "signup" ? "2px solid #ffb59d" : "2px solid transparent",
            }}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "signup" && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="athlete@example.com"
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2]">Password</label>
              {tab === "login" && (
                <a href="#" className="text-[9px] text-[#ffb59d] hover:underline">Forgot?</a>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl text-xs font-bold tracking-wider uppercase active:scale-[0.98] transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_14px_rgba(255,87,14,0.4)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                Authenticating...
              </>
            ) : done ? (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
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
  );
}
