"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const u = api.auth.getCurrentUser();
      setUser(u || { name: "Vikrant Ahiwale", email: "athlete@habitproof.com" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    api.auth.logout();
    onClose();
    router.push("/auth");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[440px] rounded-t-3xl sm:rounded-3xl p-5 pb-8 bg-[#1b1b1d] border border-[#5c4037]/40 shadow-2xl relative space-y-5 text-[#e5e1e4]">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-[#353437]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 22 }}>settings</span>
            <h2 className="text-lg font-bold text-white tracking-tight">System Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2a2a2c] flex items-center justify-center text-[#e5beb2] hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-3.5 rounded-2xl bg-[#201f21] border border-[#353437]/60 flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-[#ffb59d] overflow-hidden flex-shrink-0 bg-[#353437] flex items-center justify-center">
            <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 24 }}>person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name || "Vikrant Ahiwale"}</p>
            <p className="text-xs text-[#e5beb2] truncate">{user?.email || "athlete@habitproof.com"}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#ff570e]/20 text-[#ffb59d]">
              Pro Athlete License
            </span>
          </div>
        </div>

        {/* Settings Options */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0e10] border border-[#353437]/40">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 20 }}>photo_camera</span>
              <div>
                <p className="text-xs font-bold text-white">Camera & Biometrics</p>
                <p className="text-[10px] text-[#e5beb2]">Enable camera feed for verification</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={cameraEnabled}
                onChange={(e) => setCameraEnabled(e.target.checked)}
              />
              <div
                className="w-9 h-5 rounded-full relative transition-colors"
                style={{ background: cameraEnabled ? "#ff570e" : "#353437" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                  style={{ left: cameraEnabled ? "calc(100% - 18px)" : "2px" }}
                />
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0e10] border border-[#353437]/40">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 20 }}>notifications</span>
              <div>
                <p className="text-xs font-bold text-white">Daily Habit Reminders</p>
                <p className="text-[10px] text-[#e5beb2]">Push alerts for check-in deadlines</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <div
                className="w-9 h-5 rounded-full relative transition-colors"
                style={{ background: notifications ? "#ff570e" : "#353437" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                  style={{ left: notifications ? "calc(100% - 18px)" : "2px" }}
                />
              </div>
            </label>
          </div>

          <button
            onClick={() => { onClose(); router.push("/face-enroll"); }}
            className="w-full p-3 rounded-xl bg-[#0e0e10] border border-[#353437]/40 flex items-center justify-between text-left hover:bg-[#201f21] transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#ffb59d]" style={{ fontSize: 20 }}>fingerprint</span>
              <div>
                <p className="text-xs font-bold text-white">Re-enroll Biometric Face ID</p>
                <p className="text-[10px] text-[#e5beb2]">Update your face verification profile</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-[#e5beb2]">chevron_right</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            Log Out Account
          </button>
        </div>
      </div>
    </div>
  );
}
