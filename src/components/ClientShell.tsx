"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "./DesktopSidebar";
import DesktopHeader from "./DesktopHeader";
import SettingsModal from "./SettingsModal";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  const isAuth = pathname === "/auth";

  if (isAuth) {
    return <main className="w-full min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <div className="flex w-full min-h-screen bg-[#0a0a0c]">
      {/* Desktop Sidebar (visible on lg+ screens) */}
      <DesktopSidebar onOpenSettings={() => setShowSettings(true)} />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#131315] min-h-screen relative overflow-x-hidden">
        {/* Desktop Sticky Header */}
        <DesktopHeader onOpenSettings={() => setShowSettings(true)} />

        {/* Page Content Container */}
        <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>

      {/* Global Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
