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
            video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
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
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">
          Habit-proof
        </h1>
        <button onClick={() => setShowSettings(true)} className="text-[#e5beb2] hover:opacity-80 p-1">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 pt-4 pb-28 space-y-4 w-full flex flex-col justify-between">
        <div className="space-y-3.5">
          {/* Status Indicator Banner */}
          <div
            className="flex items-center justify-between p-3.5 rounded-2xl border transition-all"
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
                <h2 className="text-xs font-bold text-white">
                  {status === "required" && "Face ID Not Enrolled"}
                  {status === "registering" && "Enrolling Face with AI..."}
                  {status === "success" && "Face is Enrolled (You can update anytime)"}
                </h2>
              </div>
            </div>
            {status === "success" ? (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00a572]/20 text-[#4edea3] border border-[#4edea3]/30">
                OKAY
              </span>
            ) : (
              <span className="material-symbols-outlined text-[#ac897e]" style={{ fontSize: 18 }}>info</span>
            )}
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
              {successMsg}
            </div>
          )}

          {/* Enrolled Status View OR Live Camera Scanner */}
          {status === "success" && !showCamera ? (
            <section className="glass-card rounded-2xl p-6 border border-[#4edea3]/30 bg-[#201f21]/80 space-y-4 text-center">
              {/* Green Verified Icon */}
              <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center bg-[#00a572]/20 border-2 border-[#4edea3] shadow-[0_0_24px_rgba(78,222,163,0.3)]">
                <span className="material-symbols-outlined text-[#4edea3] text-4xl">check_circle</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white tracking-tight">Your Face Profile is Enrolled</h3>
                <p className="text-xs text-[#e5beb2] leading-relaxed">
                  Your AI biometric facial landmarks are securely enrolled in ZepIris and ready for daily habit verification.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#131315]/70 border border-[#353437]/50 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e5beb2] text-[10px] font-bold uppercase tracking-wider">Status</span>
                  <span className="text-[#4edea3] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                    Active & Ready
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e5beb2] text-[10px] font-bold uppercase tracking-wider">AI Liveness Check</span>
                  <span className="text-white font-semibold">Enabled</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e5beb2] text-[10px] font-bold uppercase tracking-wider">Match Threshold</span>
                  <span className="text-white font-semibold">75% Confidence</span>
                </div>
              </div>

              <button
                onClick={() => setShowCamera(true)}
                className="w-full py-3 px-4 rounded-xl bg-[#2a2a2c] hover:bg-[#353437] border border-[#5c4037]/40 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#ffb59d]">refresh</span>
                Update / Re-Scan Face ID
              </button>
            </section>
          ) : (
            /* Camera Enrollment View */
            <section className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#353437] bg-black shadow-2xl">
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
                  <p className="text-xs text-white font-bold">Camera inactive</p>
                  <p className="text-[10px] text-[#e5beb2] mt-1">Please allow camera permissions to scan your face.</p>
                </div>
              )}

              {/* Camera Overlay Gradient */}
              <div className="absolute inset-0 camera-overlay pointer-events-none" />

              {/* Biometric Guide Lines */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="w-48 h-64 border-2 border-dashed border-[#ffb59d]/40 rounded-full relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-[#ffb59d] rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-[#ffb59d] rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-[#ffb59d] rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-[#ffb59d] rounded-br-lg" />
                  {status === "registering" && <div className="scan-line absolute top-0 w-full" />}
                </div>
              </div>

              {/* Focus Markers */}
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                <div className="px-2 py-0.5 bg-[#ff570e]/20 backdrop-blur-md rounded border border-[#ff570e]/30">
                  <p className="text-[9px] font-bold text-[#ffb59d]">{hasWebcam ? "LIVE SENSOR" : "CAMERA OFF"}</p>
                </div>
                <div className="px-2 py-0.5 bg-black/50 backdrop-blur-md rounded border border-white/10">
                  <p className="text-[9px] font-bold text-white">ISO AUTO</p>
                </div>
              </div>

              {/* Close Camera button if already enrolled */}
              {status === "success" && (
                <button
                  onClick={() => setShowCamera(false)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center z-20 hover:bg-black/80"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}

              {/* Capture Tips */}
              <div className="absolute bottom-4 inset-x-0 flex justify-center px-3 z-10">
                <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  <p className="text-[10px] font-medium text-white text-center">
                    {status === "registering"
                      ? "Hold still, extracting facial embeddings..."
                      : "Position face within the oval guide"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Step-by-Step Guide */}
          {(status !== "success" || showCamera) && (
            <section className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 text-center p-2.5 rounded-xl bg-[#2a2a2c]/50 border border-[#353437]/40">
                <span className="material-symbols-outlined text-[#ffb59d] text-lg">light_mode</span>
                <p className="text-[9px] font-bold text-[#e5beb2]">Bright Light</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center p-2.5 rounded-xl bg-[#2a2a2c]/50 border border-[#353437]/40">
                <span className="material-symbols-outlined text-[#ffb59d] text-lg">no_photography</span>
                <p className="text-[9px] font-bold text-[#e5beb2]">No Glasses</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center p-2.5 rounded-xl bg-[#2a2a2c]/50 border border-[#353437]/40">
                <span className="material-symbols-outlined text-[#ffb59d] text-lg">person_pin</span>
                <p className="text-[9px] font-bold text-[#e5beb2]">Level View</p>
              </div>
            </section>
          )}
        </div>

        {/* Action Button */}
        {(status !== "success" || showCamera) && (
          <div className="space-y-2 pt-2">
            <button
              onClick={handleRegister}
              disabled={status === "registering"}
              className="w-full text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer disabled:opacity-50 bg-[#ff570e] text-[#511500] shadow-[0_4px_16px_rgba(255,87,14,0.4)]"
            >
              <span className="material-symbols-outlined text-base">
                {status === "registering" ? "sync" : "center_focus_strong"}
              </span>
              {status === "required" && "Capture & Enroll Face"}
              {status === "registering" && "Enrolling in Backend..."}
              {status === "success" && "Capture & Update Face ID"}
            </button>
          </div>
        )}
      </main>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BottomNav />
    </div>
  );
}
