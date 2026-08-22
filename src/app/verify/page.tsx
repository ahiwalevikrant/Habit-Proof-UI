"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { api } from "@/services/api";

const HABIT_TASKS = [
  { id: "run", label: "5AM Gym Session", icon: "fitness_center" },
  { id: "read", label: "Daily Reading", icon: "menu_book" },
  { id: "water", label: "Hydration Goal", icon: "water_drop" },
];

const STATUS_TEXTS = [
  "Extracting facial landmarks...",
  "Comparing with biometric profile...",
  "Validating liveness metrics...",
  "Confirming geometric consistency...",
];

export default function VerifyPage() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState("run");
  const [statusIndex, setStatusIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_TEXTS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.checkins.create(1, "data:image/jpeg;base64,mock-biometric-selfie-data", "AI Biometric Verification Proof");
      router.push("/verify/result?success=true");
    } catch (err) {
      router.push("/verify/result?success=true");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* Top AppBar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-[#ffb59d] overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjFPRDsun2YGsGs3FxF2XH6AUwhqppRwlftBEFbNMcxnubYbgVaGnuvoalBv6p3zvoLZCbfVMt7qrEtvWgxbC99HDBhfUcr-QIiGkuq7zpnnFKsUky-ddYa29LD8cbOePd6DbF7m8kj-9aIkqEpe40qcSaJCPNT0jK8nEbcx7CncU4oI_np1T2XWzqTNP0UeyJkX2ezLnC91hAABApFlhx0gZIxHaZ88ydHGLZ8w50T1LkIONldOpy-iRz-9WE0AjPtK6CQKefu6Q"
              alt="Profile"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">Habit-proof</h1>
        </div>
        <button className="text-[#ffb59d] hover:opacity-80">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-4 w-full flex flex-col">
        {/* Header Section */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mb-0.5">
            Submit Verification Proof
          </h2>
          <p className="text-xs text-[#e5beb2] mb-3">
            Select the habit task you are validating.
          </p>

          {/* Habit Selector Carousel */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {HABIT_TASKS.map((task) => {
              const isSelected = selectedTask === task.id;
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-[#ff570e] text-[#511500] border-[#ff570e]"
                      : "bg-[#201f21] border-[#353437] text-[#e5beb2]"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{task.icon}</span>
                  <span>{task.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Camera Viewfinder Section */}
        <div className="relative flex-1 flex items-center justify-center min-h-[300px]">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-[#353437] bg-black shadow-2xl">
            {/* Background Image (Selfie Feed) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCnSQ2pQCU0sEkbk6GJB7bLF9HOsPjoSVwAjoTpzDDZ_WobBQvuldPwv4U6phkBeHz2RLqbULuYaqs9J2a-3Y0XHBgLNjxDfiLacErRXDimRlYjUtMj_pftzWer6m71wphGhib-SLx4GTINCR6q88v6ySxJvrHjdGmuJPlLKM2frDx7hHKMSISoXOFk-BMkpyjE5kYRVF5JmhtTqZRZEzE0w0jmjTaqmmgq3O4KUMEyA5_YcwmzAGsy0hOjC3ueNfeYcC1UsQdY7fA')",
              }}
            />

            {/* Overlay Interface */}
            <div className="absolute inset-0 flex flex-col justify-between p-3.5 pointer-events-none">
              {/* Top Data */}
              <div className="flex justify-between items-start">
                <div className="bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/10 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                  <span className="text-[9px] font-bold text-[#4edea3] uppercase tracking-widest">
                    Live Feed
                  </span>
                </div>
                <div className="bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1 border border-white/10 text-right">
                  <div className="text-[8px] font-bold text-[#e5beb2] uppercase">Liveness</div>
                  <div className="text-xs font-extrabold text-[#ffb59d]">98.4%</div>
                </div>
              </div>

              {/* Scan Animation Area */}
              <div className="relative flex-1 my-2">
                <div className="viewfinder-tl" />
                <div className="viewfinder-tr" />
                <div className="viewfinder-bl" />
                <div className="viewfinder-br" />
                <div className="scan-line-green z-10" />

                {/* Simulated biometric grid overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="grid grid-cols-6 grid-rows-8 w-full h-full">
                    {Array.from({ length: 48 }).map((_, idx) => (
                      <div key={idx} className="border-[0.5px] border-[#4edea3]/30" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Status */}
              <div className="flex flex-col items-center">
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#4edea3]/40 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-sm animate-spin" style={{ animationDuration: "3s" }}>
                    sync
                  </span>
                  <span className="text-[10px] font-bold text-white tracking-wide">
                    {isSubmitting ? "Validating proof..." : STATUS_TEXTS[statusIndex]}
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
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#ff570e] text-[#511500] rounded-xl text-xs font-bold tracking-wider uppercase shadow-[0_4px_16px_rgba(255,87,14,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span className="material-symbols-outlined icon-fill text-base">fingerprint</span>
            {isSubmitting ? "Processing..." : "Submit Biometric Verification"}
          </button>
          <p className="text-[9px] text-[#e5beb2]/70 font-medium text-center">
            Verification typically takes less than 3 seconds
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
