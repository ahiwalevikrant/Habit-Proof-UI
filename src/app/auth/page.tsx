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
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleFillDemo = () => {
    setName("Vikrant Ahiwale");
    setEmail("athlete@habitproof.com");
    setPassword("demo123");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      if (tab === "login") {
        await api.auth.login(email || "athlete@habitproof.com", password || "demo123");
      } else {
        await api.auth.signup(name || "Vikrant Ahiwale", email || "athlete@habitproof.com", password || "demo123");
      }
      setDone(true);
      setTimeout(() => router.push("/"), 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      await api.auth.googleAuth();
      setDone(true);
      setTimeout(() => router.push("/"), 600);
    } catch (err: any) {
      setErrorMsg(err.message || "Google authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden bg-[#131315] text-[#e5e1e4]">
      {/* Atmospheric glow blobs */}
      <div className="glow-accent" style={{ top: -100, left: -100 }} />
      <div className="glow-accent" style={{ bottom: -100, right: -100 }} />

      {/* Logo */}
      <header className="mb-5 flex flex-col items-center animate-fade-in z-10 text-center">
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
        <div className="flex border-b border-[#353437]/50 mb-2">
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

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading || loading}
          className="w-full py-2.5 px-4 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] border border-[#353437] text-white text-xs font-bold flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
        >
          {googleLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Connecting Google...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{tab === "login" ? "Continue with Google" : "Sign Up with Google"}</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-[#353437]/60" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2]/50">Or Passcode</span>
          <div className="h-px flex-1 bg-[#353437]/60" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === "signup" && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vikrant Ahiwale"
                className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#e5beb2] mb-1 block">Athlete Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-3.5 py-2.5 text-xs bg-[#0e0e10] border border-[#5c4037]/30 text-[#e5e1e4] focus:outline-none focus:border-[#ff570e]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full py-3 mt-1 rounded-xl text-xs font-bold tracking-wider uppercase active:scale-[0.98] transition-all bg-[#ff570e] text-[#511500] shadow-[0_2px_14px_rgba(255,87,14,0.4)] flex items-center justify-center gap-2 disabled:opacity-50"
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
        </form>

        {/* Demo Credentials Box */}
        <div className="pt-2">
          <div className="p-3 rounded-xl bg-[#131315] border border-[#ff570e]/30 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#ff570e] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">key</span>
                Demo Credentials
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#ff570e]/20 text-[#ffb59d] hover:bg-[#ff570e]/40 transition-colors"
              >
                Auto Fill
              </button>
            </div>
            <div className="text-[11px] text-[#e5beb2] space-y-0.5">
              <p><span className="text-white font-medium">Email:</span> athlete@habitproof.com</p>
              <p><span className="text-white font-medium">Password:</span> demo123</p>
            </div>
          </div>
        </div>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={() => router.push("/verify")}
            className="text-[10px] text-[#e5beb2] hover:text-[#ffb59d] transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <span className="material-symbols-outlined text-sm text-[#ffb59d]">fingerprint</span>
            Biometric Fast Pass Demo
          </button>
        </div>
      </main>
    </div>
  );
}
