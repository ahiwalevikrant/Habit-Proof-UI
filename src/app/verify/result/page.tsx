"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(
    searchParams.get("success") !== "false"
  );

  const toggleState = () => {
    setIsSuccess((prev) => !prev);
  };

  return (
    <>
      {isSuccess ? (
        /* Success View */
        <section className="w-full flex flex-col items-center space-y-5 animate-slide-up">
          {/* Central Shield Icon */}
          <div className="relative flex items-center justify-center w-32 h-32 my-2">
            <div className="absolute inset-0 bg-[#4edea3]/10 rounded-full blur-2xl" />
            <div className="shield-pulse flex items-center justify-center w-28 h-28 bg-[#00a572]/20 rounded-full border-4 border-[#4edea3] shadow-[0_0_30px_rgba(78,222,163,0.3)]">
              <span className="material-symbols-outlined text-[#4edea3] text-[52px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
            </div>
          </div>

          {/* Header Text */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-[#4edea3] tracking-tight">
              Proof Verified!
            </h1>
            <p className="text-xs text-[#e5beb2]">
              Verification engine confirmed your identity.
            </p>
          </div>

          {/* Details Card */}
          <div className="glass-card w-full rounded-2xl p-4 space-y-3 border border-[#353437]/60 bg-[#201f21]/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#e5beb2] font-bold uppercase tracking-wider text-[10px]">
                Habit Title
              </span>
              <span className="text-white font-bold">
                5AM Run & Prep
              </span>
            </div>
            <div className="h-[1px] bg-[#353437]/50 w-full" />
            <div className="flex justify-between items-center text-xs">
              <div className="flex flex-col">
                <span className="text-[#e5beb2] font-bold uppercase tracking-wider text-[10px]">
                  Face Match Score
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-20 h-1.5 bg-[#353437] rounded-full overflow-hidden">
                    <div className="bg-[#4edea3] h-full w-[98%]" />
                  </div>
                  <span className="text-[#4edea3] font-bold text-xs">98%</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#e5beb2] font-bold uppercase tracking-wider text-[10px] block">
                  Status
                </span>
                <span className="text-[#4edea3] font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Streak Reward Card */}
          <div className="animate-streak-pulse bg-[#ff570e] text-[#511500] w-full p-4 rounded-2xl flex items-center justify-between overflow-hidden relative group shadow-[0_4px_20px_rgba(255,87,14,0.4)]">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[70px]">
                local_fire_department
              </span>
            </div>
            <div className="flex items-center gap-2.5 relative z-10">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-tight">
                  Streak Upgraded!
                </span>
                <span className="text-[#511500]/80 text-[10px] font-bold">
                  6 day streak
                </span>
              </div>
            </div>
            <div className="relative z-10 flex items-center bg-[#511500]/15 px-2.5 py-0.5 rounded-full border border-[#511500]/20">
              <span className="text-xl font-extrabold text-[#511500]">+1</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#ff570e] text-[#511500] text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-[0_4px_16px_rgba(255,87,14,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </section>
      ) : (
        /* Failure View */
        <section className="w-full flex flex-col items-center space-y-5 animate-slide-up">
          {/* Central Shield Icon */}
          <div className="relative flex items-center justify-center w-32 h-32 my-2">
            <div className="absolute inset-0 bg-[#ffb4ab]/10 rounded-full blur-2xl" />
            <div className="flex items-center justify-center w-28 h-28 bg-[#93000a]/40 rounded-full border-4 border-[#ffb4ab] shadow-[0_0_30px_rgba(255,180,171,0.3)]">
              <span className="material-symbols-outlined text-[#ffb4ab] text-[52px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
            </div>
          </div>

          {/* Header Text */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-[#ffb4ab] tracking-tight">
              Verification Failed
            </h1>
            <p className="text-xs text-[#e5beb2]">
              Biometric markers did not match profile.
            </p>
          </div>

          {/* Details Card */}
          <div className="glass-card w-full rounded-2xl p-4 space-y-3 border border-[#ffb4ab]/20 bg-[#201f21]/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#e5beb2] font-bold uppercase tracking-wider text-[10px]">
                Reason
              </span>
              <span className="text-[#ffb4ab] font-bold">Identity Mismatch</span>
            </div>
            <div className="h-[1px] bg-[#353437]/50 w-full" />
            <div className="flex justify-between items-center text-xs">
              <div className="flex flex-col">
                <span className="text-[#e5beb2] font-bold uppercase tracking-wider text-[10px]">
                  Match Confidence
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-20 h-1.5 bg-[#353437] rounded-full overflow-hidden">
                    <div className="bg-[#ffb4ab] h-full w-[14%]" />
                  </div>
                  <span className="text-[#ffb4ab] font-bold text-xs">14%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Risk Alert */}
          <div className="bg-[#93000a]/20 text-[#ffdad6] w-full p-3.5 rounded-2xl flex items-center gap-2.5 border border-[#ffb4ab]/30">
            <span className="material-symbols-outlined text-[#ffb4ab] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
            <span className="text-xs text-[#e5e1e4]">
              Streak is at risk! Attempt verification again in 30:00.
            </span>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => router.push("/verify")}
            className="w-full bg-[#353437] text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl border border-[#ac897e]/20 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-[#39393b]"
          >
            Try Again
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        </section>
      )}

      {/* State Preview Toggle */}
      <div className="pt-4 flex flex-col items-center">
        <button
          onClick={toggleState}
          className="text-[#e5beb2] text-[10px] font-bold uppercase tracking-widest border border-[#353437] px-3.5 py-1.5 rounded-full hover:bg-[#2a2a2c] transition-colors"
        >
          {isSuccess ? "Preview Failure State" : "Reset to Success"}
        </button>
      </div>
    </>
  );
}

export default function VerificationResultPage() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#353437] overflow-hidden border border-[#ffb59d]/20">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtFCp4xzUV5vHcpXjxCbJBv3o7CSO_VR_qTopcSy8CIKFiEOmJTqyNJjpNB2zPjGmyrF7Sl0DjsPxNeWYws5BQFSvdU4ah5pLY2r0B8ob9GBB-4Pbgruui3SDX_SLiYoInI766mGkCp5K0U43tJwWZiMx9tGD3muaKoRzPkw4U-uF3EVbrGHkaIyUrxSleSikV-e8rMiwf9dtQ0dn0Alq6ctZAHjplpFNR8LPNkM3AN1oBvcPBvCPSl8MyKzE13ILxIatPoBsqvJU"
              alt="Profile"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#ffb59d]">
            Habit-proof
          </span>
        </div>
        <button onClick={() => setShowSettings(true)} className="text-[#e5beb2] hover:opacity-80 p-1">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 px-4 pt-4 pb-28 flex flex-col items-center justify-center space-y-4 w-full">
        <Suspense fallback={<div className="text-xs text-[#e5beb2]">Loading verification details...</div>}>
          <ResultContent />
        </Suspense>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
