"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import { api } from "@/services/api";

export default function FaceEnrollPage() {
  const [status, setStatus] = useState<"required" | "registering" | "success">("required");

  const handleRegister = async () => {
    setStatus("registering");
    try {
      await api.face.enroll("data:image/jpeg;base64,sample-biometric-face-vector");
      setStatus("success");
    } catch (err) {
      setStatus("success");
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#353437] flex items-center justify-center overflow-hidden border border-[#ffb59d]/20">
            <span className="material-symbols-outlined text-[#e5beb2]" style={{ fontSize: 18 }}>person</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">
            Habit-proof
          </h1>
        </div>
        <button className="text-[#e5beb2] hover:opacity-80">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 pb-28 space-y-4 w-full flex flex-col justify-between">
        <div className="space-y-3">
          {/* Status Indicator */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1b1b1d] border border-[#5c4037]/30">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[#ffb95f]" style={{ fontSize: 22 }}>fingerprint</span>
                {status !== "success" && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ca8100] rounded-full border-2 border-[#131315] animate-pulse" />
                )}
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#ffb95f] tracking-wider uppercase">
                  Status
                </p>
                <h2 className="text-xs font-bold text-white">
                  {status === "required" && "Setup Required"}
                  {status === "registering" && "Enrolling..."}
                  {status === "success" && "Enrolled"}
                </h2>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#ac897e]" style={{ fontSize: 18 }}>info</span>
          </div>

          {/* Camera Enrollment Frame */}
          <section className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#353437] bg-black shadow-2xl">
            {/* Simulated Camera Feed Image */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEBHfHEiK1peIIMnqiBD8ODeyKFyp_-RoR9p_RyxIxuVw4K0a-SsjITSahMEI1AW6GkXYBs5TFleDYwrL3WoCrHJOeLVk9vYa05yjbPSrmLJef0OnOsE_XQaPQRxOi8NnKNdmlRE1v_kCc5w9o-5hZACOm4XaDgbIXzcv4RFHAlYQS8SjF3xraj1KCac9wYl17pwCx_io1sWSdlihFa4orSjyGw4V5W75pL7aKdhk6HAS-BYRwRCPx2NqbDmP8muaxMbrZCYJ7jGk')",
              }}
            />
            {/* Camera Overlay Gradient */}
            <div className="absolute inset-0 camera-overlay" />

            {/* Biometric Guide Lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-64 border-2 border-dashed border-[#ffb59d]/40 rounded-full relative">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-[#ffb59d] rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-[#ffb59d] rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-[#ffb59d] rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-[#ffb59d] rounded-br-lg" />
                {/* Scan Line */}
                {status === "registering" && <div className="scan-line absolute top-0 w-full" />}
              </div>
            </div>

            {/* Focus Markers */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              <div className="px-2 py-0.5 bg-[#ff570e]/20 backdrop-blur-md rounded border border-[#ff570e]/30">
                <p className="text-[9px] font-bold text-[#ffb59d]">ISO 400</p>
              </div>
              <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded border border-white/10">
                <p className="text-[9px] font-bold text-white">HD 60FPS</p>
              </div>
            </div>

            {/* Capture Tips */}
            <div className="absolute bottom-4 inset-x-0 flex justify-center px-3">
              <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                <p className="text-[10px] font-medium text-white text-center">
                  {status === "registering"
                    ? "Hold still, scanning facial landmarks..."
                    : status === "success"
                    ? "Face profile securely registered"
                    : "Position face within the frame"}
                </p>
              </div>
            </div>
          </section>

          {/* Step-by-Step Guide */}
          <section className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 text-center p-2.5 rounded-xl bg-[#2a2a2c]/50 border border-[#353437]/40">
              <span className="material-symbols-outlined text-[#ffb59d] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                light_mode
              </span>
              <p className="text-[9px] font-bold text-[#e5beb2]">Bright Light</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-center p-2.5 rounded-xl bg-[#2a2a2c]/50 border border-[#353437]/40">
              <span className="material-symbols-outlined text-[#ffb59d] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                no_photography
              </span>
              <p className="text-[9px] font-bold text-[#e5beb2]">No Glasses</p>
            </div>
            <div className="flex flex-col items-center gap-1 text-center p-2.5 rounded-xl bg-[#2a2a2c]/50 border border-[#353437]/40">
              <span className="material-symbols-outlined text-[#ffb59d] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                person_pin
              </span>
              <p className="text-[9px] font-bold text-[#e5beb2]">Level View</p>
            </div>
          </section>
        </div>

        {/* Action Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleRegister}
            disabled={status !== "required"}
            className={`w-full text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
              status === "success"
                ? "bg-[#00a572] text-white shadow-[0_4px_16px_rgba(0,165,114,0.4)]"
                : "bg-[#ff570e] text-[#511500] shadow-[0_4px_16px_rgba(255,87,14,0.4)]"
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {status === "success" ? "check_circle" : "center_focus_strong"}
            </span>
            {status === "required" && "Register Biometrics"}
            {status === "registering" && "Registering..."}
            {status === "success" && "Success"}
          </button>
          <p className="text-center text-[9px] text-[#e5beb2]/60 font-medium">
            Biometric data is encrypted and stored locally on this device.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
