import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "HabitProof — Elite Habit Engineering & Biometric Accountability",
  description: "Track, verify and prove your habits with AI biometric facial accountability.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0c] text-[#e5e1e4] antialiased min-h-screen selection:bg-[#ff570e]/30 selection:text-[#ffb59d] flex flex-col">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
