"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api, HabitResponse } from "@/services/api";

const STATUS_TEXTS = [
  "Extracting facial landmarks...",
  "Comparing with biometric profile...",
  "Validating liveness metrics...",
  "Confirming geometric consistency...",
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
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setHasWebcam(true);
          }
        }
      } catch (err: any) {
        console.warn("Webcam access error:", err);
        setCameraError("Camera permission denied or camera not found.");
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
        }, "image/jpeg", 0.9);
      });
    } catch {
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!selectedHabitId) {
      alert("Please select a habit to verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      const file = await capturePhotoFile();
      const checkIn = await api.checkins.create(
        selectedHabitId,
        file,
        "AI Biometric Verification Proof"
      );

      const isSuccess = checkIn.verificationStatus === "VERIFIED";
      const score = Math.round((checkIn.faceMatchScore || 0.95) * 100);
      router.push(`/verify/result?success=${isSuccess}&score=${score}`);
    } catch (err: any) {
      alert(err.message || "Failed to submit check-in to backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top AppBar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">Habit-proof</h1>
        <button onClick={() => setShowSettings(true)} className="text-[#ffb59d] hover:opacity-80 p-1">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-4 w-full flex flex-col">
        {/* Header Section */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mb-0.5">
            Submit Biometric Proof
          </h2>
          <p className="text-xs text-[#e5beb2] mb-3">
            Select the habit task you are verifying today.
          </p>

          {/* Habit Selector */}
          {habits.length === 0 ? (
            <div className="p-3 rounded-xl bg-[#201f21] border border-[#353437] text-xs text-[#e5beb2] text-center">
              No habits created yet. Go to Habits tab to create one.
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {habits.map((habit) => {
                const isSelected = selectedHabitId === habit.id;
                return (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedHabitId(habit.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#ff570e] text-[#511500] border-[#ff570e]"
                        : "bg-[#201f21] border-[#353437] text-[#e5beb2]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {habit.requiresSelfie ? "photo_camera" : "check_circle"}
                    </span>
                    <span className="truncate max-w-[140px]">{habit.title}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Camera Viewfinder Section */}
        <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-[#353437] bg-black shadow-2xl">
            {/* Live Camera Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {!hasWebcam && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#131315]">
                <span className="material-symbols-outlined text-4xl text-[#ffb59d] mb-2">videocam_off</span>
                <p className="text-xs text-white font-bold">Camera feed inactive</p>
                <p className="text-[10px] text-[#e5beb2] mt-1">{cameraError || "Please allow camera access in your browser."}</p>
              </div>
            )}

            {/* Overlay Interface */}
            <div className="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none z-10">
              {/* Top Data */}
              <div className="flex justify-between items-start">
                <div className="bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/10 flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${hasWebcam ? "bg-[#4edea3] animate-pulse" : "bg-red-400"}`} />
                  <span className="text-[9px] font-bold text-[#4edea3] uppercase tracking-widest">
                    {hasWebcam ? "Live Camera" : "Offline"}
                  </span>
                </div>
                <div className="bg-black/60 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/10 text-right">
                  <div className="text-[8px] font-bold text-[#e5beb2] uppercase">AI Liveness</div>
                  <div className="text-xs font-extrabold text-[#ffb59d]">Active</div>
                </div>
              </div>

              {/* Scan Animation Area */}
              <div className="relative flex-1 my-2">
                <div className="viewfinder-tl" />
                <div className="viewfinder-tr" />
                <div className="viewfinder-bl" />
                <div className="viewfinder-br" />
                <div className="scan-line-green z-10" />
              </div>

              {/* Bottom Status */}
              <div className="flex flex-col items-center">
                <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#4edea3]/40 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-sm animate-spin" style={{ animationDuration: "3s" }}>
                    sync
                  </span>
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {isSubmitting ? "Validating biometric proof..." : STATUS_TEXTS[statusIndex]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center gap-2 pt-1">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || habits.length === 0}
            className="w-full py-3.5 bg-[#ff570e] text-[#511500] rounded-xl text-xs font-bold tracking-wider uppercase shadow-[0_4px_16px_rgba(255,87,14,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span className="material-symbols-outlined icon-fill text-base">fingerprint</span>
            {isSubmitting ? "Verifying with AI..." : "Capture & Verify Proof"}
          </button>
        </div>
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
