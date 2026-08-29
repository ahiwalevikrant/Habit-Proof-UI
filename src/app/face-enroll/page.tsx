"use client";
import { useState, useEffect, useRef } from "react";
import BottomNav from "@/components/BottomNav";
import SettingsModal from "@/components/SettingsModal";
import { api } from "@/services/api";

export default function FaceEnrollPage() {
  const [status, setStatus] = useState<"required" | "registering" | "success">("required");
  const [showSettings, setShowSettings] = useState(false);
  const [hasWebcam, setHasWebcam] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Check initial face enrollment status from backend
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await api.face.getStatus();
        if (res && res.enrolled) {
          setStatus("success");
          setShowCamera(false);
        } else {
          setStatus("required");
          setShowCamera(true);
        }
      } catch (err) {
        console.warn("Could not check face status:", err);
      }
    }
    checkStatus();
  }, []);

  // Request camera stream when camera view is active
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
      } catch (err) {
        console.warn("Webcam access error:", err);
        setHasWebcam(false);
      }
    }

    if (showCamera || status === "required") {
      initCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [showCamera, status]);

  // Capture photo from video stream
  const capturePhotoFile = async (): Promise<File> => {
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video?.videoWidth || 640;
    canvas.height = video?.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx && video && hasWebcam) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    return new Promise<File>((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob || new Blob([])], `face_enroll_${Date.now()}.jpg`, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg", 0.95);
    });
  };

  const handleRegister = async () => {
    setStatus("registering");
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const file = await capturePhotoFile();
      await api.face.enroll(file);
      setStatus("success");
      setShowCamera(false);
      setSuccessMsg("Face profile successfully registered and active!");
    } catch (err: any) {
      setErrorMsg(err.message || "Face enrollment failed on backend.");
      setStatus("required");
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">
          Habit-proof
        </h1>
        <button onClick={() => setShowSettings(true)} className="text-[#e5beb2] hover:opacity-80 p-1">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 lg:px-8 pt-4 lg:pt-8 pb-28 lg:pb-12 space-y-6 w-full">
        {/* Header Title */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#ff570e] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#ffb59d]">Security & Biometrics</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Facial Landmark Profile</h2>
        </section>

        {/* 2-Column Responsive Layout on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column (7 cols): Active Enrolled Card OR Live Camera */}
          <div className="lg:col-span-7 space-y-4">
            {/* Status Banner */}
            <div
              className="flex items-center justify-between p-4 rounded-2xl border transition-all"
              style={{
                background: status === "success" ? "rgba(0,165,114,0.12)" : "#1b1b1d",
                borderColor: status === "success" ? "rgba(78,222,163,0.3)" : "rgba(92,64,55,0.3)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ color: status === "success" ? "#4edea3" : "#ffb95f" }}
                  >
                    {status === "success" ? "verified_user" : "fingerprint"}
                  </span>
                  {status === "required" && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#ff570e] rounded-full border-2 border-[#131315] animate-pulse" />
                  )}
                </div>
                <div>
                  <p
                    className="text-[9px] font-extrabold uppercase tracking-widest"
                    style={{ color: status === "success" ? "#4edea3" : "#ffb95f" }}
                  >
                    {status === "success" ? "Biometric Security Active" : "Profile Setup Required"}
                  </p>
                  <h3 className="text-xs sm:text-sm font-bold text-white">
                    {status === "required" && "Face ID Not Enrolled"}
                    {status === "registering" && "Enrolling Face in ZepIris AI..."}
                    {status === "success" && "Face is Enrolled (You can update anytime)"}
                  </h3>
                </div>
              </div>
              {status === "success" ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30">
                  OKAY
                </span>
              ) : (
                <span className="material-symbols-outlined text-[#ac897e]" style={{ fontSize: 18 }}>info</span>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                {successMsg}
              </div>
            )}

            {/* Enrolled Verified State OR Camera Frame */}
            {status === "success" && !showCamera ? (
              <div className="glass-card rounded-3xl p-8 border border-[#4edea3]/30 bg-[#201f21]/80 space-y-6 text-center shadow-xl">
                <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center bg-[#00a572]/20 border-2 border-[#4edea3] shadow-[0_0_30px_rgba(78,222,163,0.3)]">
                  <span className="material-symbols-outlined text-[#4edea3] text-5xl">check_circle</span>
                </div>

                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-white tracking-tight">Your Face Profile is Enrolled</h3>
                  <p className="text-xs text-[#e5beb2] leading-relaxed">
                    Your AI biometric facial landmarks are securely enrolled in ZepIris vector storage and ready for daily habit verification.
                  </p>
                </div>

                <button
                  onClick={() => setShowCamera(true)}
                  className="w-full max-w-sm mx-auto py-3.5 px-6 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] border border-[#5c4037]/50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <span className="material-symbols-outlined text-base text-[#ffb59d]">refresh</span>
                  Update / Re-Scan Face ID
                </button>
              </div>
            ) : (
              <div className="space-y-4">
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
                      <span className="material-symbols-outlined text-4xl text-[#ffb59d] mb-2">videocam_off</span>
                      <p className="text-xs text-white font-bold">Camera inactive</p>
                      <p className="text-[10px] text-[#e5beb2] mt-1">Please allow camera permissions to scan your face.</p>
                    </div>
                  )}

                  <div className="absolute inset-0 camera-overlay pointer-events-none" />

                  {/* Biometric Guide Lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-52 h-64 sm:w-60 sm:h-72 border-2 border-dashed border-[#ffb59d]/50 rounded-full relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-[#ff570e] rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-[#ff570e] rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-[#ff570e] rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-[#ff570e] rounded-br-xl" />
                      {status === "registering" && <div className="scan-line absolute top-0 w-full" />}
                    </div>
                  </div>

                  {status === "success" && (
                    <button
                      onClick={() => setShowCamera(false)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center z-20 hover:bg-black"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleRegister}
                  disabled={status === "registering" || !hasWebcam}
                  className="w-full py-4 rounded-2xl bg-[#ff570e] hover:bg-[#ff6f30] text-[#511500] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_6px_24px_rgba(255,87,14,0.4)] active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">
                    {status === "registering" ? "sync" : "center_focus_strong"}
                  </span>
                  {status === "required" && "Capture & Enroll Reference Face"}
                  {status === "registering" && "Enrolling in Backend..."}
                  {status === "success" && "Capture & Update Face ID"}
                </button>
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Guidelines & Specs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-card p-6 rounded-3xl border border-[#353437]/60 bg-[#201f21]/80 space-y-4">
              <h3 className="text-base font-bold text-white tracking-tight">Enrollment Guidelines</h3>
              <p className="text-xs text-[#e5beb2] leading-relaxed">
                For optimal verification accuracy, ensure your face is evenly lit and matches your daily routine appearance.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#171719] border border-[#353437]/40">
                  <span className="material-symbols-outlined text-[#ffb59d] text-xl">light_mode</span>
                  <div>
                    <p className="text-xs font-bold text-white">Direct Natural Lighting</p>
                    <p className="text-[11px] text-[#e5beb2]">Avoid strong backlight or deep shadows across the cheekbones.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#171719] border border-[#353437]/40">
                  <span className="material-symbols-outlined text-[#ffb59d] text-xl">no_photography</span>
                  <div>
                    <p className="text-xs font-bold text-white">Neutral Expression</p>
                    <p className="text-[11px] text-[#e5beb2]">Look straight into the lens without heavy tinted sunglasses.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#171719] border border-[#353437]/40">
                  <span className="material-symbols-outlined text-[#4edea3] text-xl">lock</span>
                  <div>
                    <p className="text-xs font-bold text-white">Encrypted Vector Storage</p>
                    <p className="text-[11px] text-[#e5beb2]">Raw images are isolated and transformed into mathematical embeddings.</p>
                  </div>
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
