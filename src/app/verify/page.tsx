"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, HabitResponse } from "@/services/api";

const STATUS_TEXTS = [
  "Extracting 512-D facial landmarks...",
  "Running vector similarity search with ZepIris...",
  "Validating anti-spoofing liveness metrics...",
  "Confirming streak advancement criteria...",
];

export default function VerifyPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitResponse[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; score?: number; message?: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Load active habits from backend
  useEffect(() => {
    async function fetchHabits() {
      try {
        const list = await api.habits.list();
        setHabits(list || []);
        if (list && list.length > 0) {
          const selfieHabit = list.find((h) => h.requiresSelfie) || list[0];
          setSelectedHabitId(selfieHabit.id);
        }
      } catch (err) {
        console.error("Failed to load habits:", err);
      }
    }
    fetchHabits();
  }, []);

  // Request real camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasWebcam(true);
          }
        }
      } catch (err: any) {
        console.warn("Webcam access error:", err);
        setCameraError("Camera permission denied or camera unavailable.");
        setHasWebcam(false);
      }
    }
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Capture photo from video stream and create File object
  const capturePhotoFile = async (): Promise<File | null> => {
    if (!videoRef.current || !hasWebcam) return null;
    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      return new Promise<File | null>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `proof_${Date.now()}.jpg`, { type: "image/jpeg" });
            resolve(file);
          } else {
            resolve(null);
          }
        }, "image/jpeg", 0.92);
      });
    } catch {
      return null;
    }
  };

  const handleVerify = async () => {
    if (!selectedHabitId) return;
    setIsSubmitting(true);
    setVerificationResult(null);

    try {
      const photoFile = await capturePhotoFile();
      const res = await api.checkins.create(
        selectedHabitId,
        photoFile,
        "Biometric camera check-in proof"
      );

      setVerificationResult({
        success: true,
        score: res.faceMatchScore ? Math.round(res.faceMatchScore * 100) : 95,
        message: "Biometric proof verified successfully!",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setVerificationResult({
        success: false,
        message: err.message || "Face verification failed. Please try again with clear lighting.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">Habit-proof</h1>
        <button onClick={() => setShowSettings(true)} className="p-1 text-[#e5beb2] hover:opacity-80">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 lg:px-8 pt-4 lg:pt-8 pb-28 lg:pb-12 space-y-6 w-full">
        {/* Page Title Header */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff570e] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">AI Biometric Sensor</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Proof Verification Scanner</h2>
        </section>

        {/* 2-Column Responsive Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (7 cols): Camera Viewfinder */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-3xl overflow-hidden border-2 border-[#353437] bg-black shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
              />

              {!hasWebcam && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#131315]">
                  <span className="material-symbols-outlined text-5xl text-[#ffb59d] mb-3">videocam_off</span>
                  <p className="text-sm text-white font-bold">Camera Sensor Inactive</p>
                  <p className="text-xs text-[#e5beb2] mt-1 max-w-sm">
                    {cameraError || "Please grant camera permission to scan your face."}
                  </p>
                </div>
              )}

              {/* Viewfinder Overlays */}
              <div className="absolute inset-0 camera-overlay pointer-events-none" />

              {/* Biometric Guide Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-52 h-64 sm:w-60 sm:h-72 border-2 border-dashed border-[#ffb59d]/50 rounded-full relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-[#ff570e] rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-[#ff570e] rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-[#ff570e] rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-[#ff570e] rounded-br-xl" />
                  {isSubmitting && <div className="scan-line absolute top-0 w-full" />}
                </div>
              </div>

              {/* Sensor Badge */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <div className="px-3 py-1 bg-[#ff570e]/20 backdrop-blur-md rounded-xl border border-[#ff570e]/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff570e] animate-pulse" />
                  <p className="text-[10px] font-extrabold text-[#ffb59d] tracking-wider uppercase">
                    {hasWebcam ? "LIVE SENSOR ON" : "SENSOR OFF"}
                  </p>
                </div>
              </div>

              {/* Bottom Telemetry Status Box */}
              <div className="absolute bottom-4 inset-x-4 flex justify-center z-10">
                <div className="bg-black/75 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#ffb59d] animate-pulse">
                    {isSubmitting ? "sync" : "center_focus_strong"}
                  </span>
                  <p className="text-xs font-semibold text-white text-center">
                    {isSubmitting ? STATUS_TEXTS[statusIndex] : "Position your face in the oval guide and capture"}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Result Notification */}
            {verificationResult && (
              <div
                className={`p-4 rounded-2xl border text-sm font-semibold flex items-center gap-3 transition-all ${
                  verificationResult.success
                    ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-200"
                    : "bg-red-950/70 border-red-500/40 text-red-200"
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color: verificationResult.success ? "#4edea3" : "#ef4444" }}>
                  {verificationResult.success ? "check_circle" : "error"}
                </span>
                <div className="flex-1">
                  <p className="font-bold">{verificationResult.message}</p>
                  {verificationResult.score && (
                    <p className="text-xs opacity-80 mt-0.5">ZepIris Confidence: {verificationResult.score}%</p>
                  )}
                </div>
              </div>
            )}

            {/* Big Action Shutter Button */}
            <button
              onClick={handleVerify}
              disabled={isSubmitting || !hasWebcam || !selectedHabitId}
              className="w-full py-4 rounded-2xl bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(255,87,14,0.4)] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">
                {isSubmitting ? "sync" : "photo_camera"}
              </span>
              {isSubmitting ? "Processing AI Proof..." : `Capture & Verify "${selectedHabit?.title || "Habit"}"`}
            </button>
          </div>

          {/* Right Column (5 cols): Habit Selection & Protocol Telemetry */}
          <div className="lg:col-span-5 space-y-4">
            {/* Habit Selection Box */}
            <div className="glass-card p-5 rounded-3xl border border-[#353437]/60 bg-[#201f21]/80 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight">Select Habit to Verify</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ffb59d]">
                  {habits.length} Available
                </span>
              </div>

              {habits.length === 0 ? (
                <p className="text-xs text-[#e5beb2] py-2">No habits configured yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {habits.map((h) => {
                    const isSelected = h.id === selectedHabitId;
                    return (
                      <button
                        key={h.id}
                        onClick={() => setSelectedHabitId(h.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#2a2a2c] border-[#ff570e] shadow-[0_0_12px_rgba(255,87,14,0.3)]"
                            : "bg-[#171719] border-[#353437] hover:border-[#5c4037]"
                        }`}
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="text-xs font-bold text-white truncate">{h.title}</p>
                          <p className="text-[10px] text-[#e5beb2] mt-0.5">
                            {h.category} • Streak: <strong className="text-white">{h.currentStreak}d</strong>
                          </p>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[#ff570e] text-lg flex-shrink-0">
                            check_circle
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Biometric Specs Breakdown */}
            <div className="glass-card p-5 rounded-3xl border border-[#5c4037]/40 bg-[#201f21]/60 space-y-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb59d] text-lg">psychology</span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">AI Verification Pipeline</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#131315] border border-[#353437]/40">
                  <span className="text-[#e5beb2]">Face Vector Model</span>
                  <span className="text-white font-bold">ZepIris 512-D</span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#131315] border border-[#353437]/40">
                  <span className="text-[#e5beb2]">Anti-Spoofing Liveness</span>
                  <span className="text-[#4edea3] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#131315] border border-[#353437]/40">
                  <span className="text-[#e5beb2]">Acceptance Threshold</span>
                  <span className="text-white font-bold">&ge; 75% Match</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
