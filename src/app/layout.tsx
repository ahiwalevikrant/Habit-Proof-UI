import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit-proof | Athletic Habit Tracker",
  description: "Verify your fitness and wellness habits with photo proof and face biometric scanning.",
  keywords: ["habit tracker", "strava", "habit proof", "face verification", "streaks", "biometrics"],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#fc5200",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <div className="app-container">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
