"use client";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";

const TIMELINE_ENTRIES = [
  {
    id: 1,
    day: "THU",
    date: "JUL 9",
    type: "WORKOUTS",
    title: "Morning HIIT Session",
    subtitle: "Workout Complete",
    matchScore: 98,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfyCP5XPOP_JNWLCEEAkXvYcxak6zvW0QXteY5sDRaV-xYZ92YLjOu0GHF0UsaeqkT0SNexyTaPOjVU_zNdl0dV6Xkn3mytirM9ufvWBNn5GOUN_5erqo94qD9G4UUqNfBZRyuCspOmc8Fahiuw6W6h2lSuBTy7lKS9MBdo7kch-tTtZ4WiKx2z02wgPgzNAndRV2dyb9KSqWX-x4quMTZfDGVORhOmWXO81K9mCc7G6bUyzDLuJF6jUowabuJQKP-nQKH_eeCv4Q",
    details: [
      { icon: "timer", text: "45 Minutes" },
      { icon: "bolt", text: "482 Calories" },
      { icon: "verified", text: "Biometric Verified", isVerified: true },
    ],
  },
  {
    id: 2,
    day: "WED",
    date: "JUL 8",
    type: "MINDFULNESS",
    title: "30-Min Deep Reading",
    subtitle: "Evening Habit",
    isSelfieLog: true,
    detailsText: '"Atomic Habits - Chapter 4"',
    details: [{ icon: "schedule", text: "21:45 PM" }],
  },
  {
    id: 3,
    day: "TUE",
    date: "JUL 7",
    type: "NUTRITION",
    title: "Protein Target Reached",
    subtitle: "Nutrition Goal",
    matchScore: 92,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBiSXN7tpdp9AXl529iV0dIcBObCLY09o8DAARKmx2jSZOLJiPZ2QWcP1StNAJkfAxVmQ3NK0NDFIf3RYpvKpxRg_g__mD3QYWNkbNiBeZSI_hKnmTt0a0p0uQkjEYyO3wgCzqiUvLdT0U0KHbZZhPldfECJO0LtrjiP_YKRFNkh-CnYbmZ8vYKnumDL2SDdy-bnoV-Im9B0KhLPeCiB4l3HVVHrJUXHxHKPui9AqGpN5YHZR3nP_FgOkzJt8OKYvSdb3iuseyVPGw",
    details: [
      { icon: "restaurant", text: "185g Protein Consumed" },
      { icon: "photo_camera", text: "Visual Proof Logged" },
    ],
  },
];

const FILTERS = ["ALL ACTIVITY", "WORKOUTS", "NUTRITION", "MINDFULNESS"];

export default function TimelinePage() {
  const [activeFilter, setActiveFilter] = useState("ALL ACTIVITY");

  const filteredEntries = TIMELINE_ENTRIES.filter((entry) => {
    if (activeFilter === "ALL ACTIVITY") return true;
    return entry.type === activeFilter;
  });

  return (
    <div className="w-full flex-1 flex flex-col bg-[#131315] text-[#e5e1e4]">
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 w-full flex justify-between items-center px-4 h-16 bg-[#131315]/90 backdrop-blur-xl border-b border-[#353437]/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#353437] overflow-hidden border border-[#ffb59d]/20">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdmcWvCJFC254AGiwu6kC5NOF8kj71mS0TVAWPJyLDqLBwG0c-_EyQZ5tftTUdgsqZdngwDyhlg2F9qF5fQJRFHeUvdKaBwRZW-9BLJ3sXpTtiWpAn83-UeP4zcQoz2Z7FYHdWdaRhsDRiDhaGhRlinLW01ZE8PJDTqEBNNia29UtTYXoNGF2DvXRqYF_edA2uybZD-ZozUsbAQU9bMay9xMCbUyQ-lNFKx18nWQje6EsoxwMDvOEBkCZaMP3_9EcwcnkX9mH2uBY"
              alt="Profile"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#ffb59d]">
            Habit-proof
          </h1>
        </div>
        <button className="text-[#ffb59d] hover:opacity-80">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>settings</span>
        </button>
      </header>

      <main className="flex-1 px-4 pt-4 pb-28 space-y-4 w-full">
        {/* Section Header */}
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight mb-2">Activity History</h2>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    isActive
                      ? "bg-[#ff570e] text-[#511500] border-[#ff570e]"
                      : "bg-[#2a2a2c] border-[#353437] text-[#e5beb2] hover:bg-[#353437]"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative pl-10">
          {/* Vertical Line */}
          <div className="absolute left-4 top-2 bottom-0 w-px bg-[#353437]" />

          {filteredEntries.map((entry) => (
            <div key={entry.id} className="relative mb-5 group">
              {/* Node Dot */}
              <div
                className={`absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#131315] z-10 ${
                  entry.type === "WORKOUTS"
                    ? "bg-[#ff570e]"
                    : entry.type === "NUTRITION"
                    ? "bg-[#ffb95f]"
                    : "bg-[#e5beb2]/50"
                }`}
              />

              {/* Date Label */}
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#ffb59d]">{entry.day}</span>
                <span className="text-xs font-bold text-white">{entry.date}</span>
              </div>

              {/* Content Card */}
              {entry.imageUrl ? (
                /* Card with image */
                <div className="glass-card rounded-2xl p-3 border border-[#353437]/60 bg-[#201f21]/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider block ${
                          entry.type === "WORKOUTS" ? "text-[#4edea3]" : "text-[#ffb95f]"
                        }`}
                      >
                        {entry.subtitle}
                      </span>
                      <h3 className="text-xs font-bold text-white">
                        {entry.title}
                      </h3>
                    </div>
                    {entry.matchScore && (
                      <div className="bg-[#00a572]/15 px-2 py-0.5 rounded-full border border-[#00a572]/30">
                        <span className="text-[9px] font-bold text-[#4edea3]">
                          {entry.matchScore}% MATCH
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#353437] flex-shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src={entry.imageUrl}
                        alt={entry.title}
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      {entry.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 text-[10px] ${
                            detail.isVerified ? "text-[#4edea3]" : "text-[#e5beb2]"
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {detail.icon}
                          </span>
                          <span className="truncate">{detail.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Text-only card */
                <div className="glass-card rounded-2xl p-3 border border-[#353437]/60 bg-[#201f21]/80 space-y-2 border-dashed">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#e5beb2] block">
                        {entry.subtitle}
                      </span>
                      <h3 className="text-xs font-bold text-white">
                        {entry.title}
                      </h3>
                    </div>
                    {entry.isSelfieLog && (
                      <div className="bg-[#353437] px-2 py-0.5 rounded-full border border-white/10">
                        <span className="text-[9px] font-bold text-[#e5beb2]">
                          SELFIE LOG
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 rounded-xl border border-[#353437] bg-[#1b1b1d] flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[#ac897e] text-xl">
                        menu_book
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      {entry.detailsText && (
                        <p className="text-[10px] text-[#e5beb2] italic truncate">
                          {entry.detailsText}
                        </p>
                      )}
                      {entry.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-[#e5beb2]">
                          <span className="material-symbols-outlined text-xs">
                            {detail.icon}
                          </span>
                          <span className="truncate">{detail.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
