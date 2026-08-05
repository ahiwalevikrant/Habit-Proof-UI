import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HabitProof — Elite Habit Engineering",
  description: "Track, verify and prove your habits with biometric accountability.",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0c] text-[#e5e1e4] antialiased min-h-screen flex justify-center items-start">
        {/* Mobile Viewport Container - Centered on Desktop */}
        <div className="w-full max-w-[440px] min-h-screen bg-[#131315] shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_0_1px_rgba(53,52,55,0.4)] relative flex flex-col overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
