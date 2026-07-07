"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide nav on login/auth page
  if (pathname === "/auth") {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      label: "Habits",
      href: "/habits",
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M3 20v-8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8" />
          <path d="M3 10V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" />
          <path d="M14 4h7" />
          <path d="M14 9h7" />
          <path d="M14 14h7" />
        </svg>
      ),
    },
    {
      label: "Verify",
      href: "/verify",
      isCenter: true,
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      ),
    },
    {
      label: "Face ID",
      href: "/face-enroll",
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3" />
          <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
          <path d="M3 16v3a2 2 0 0 0 2 2h3" />
          <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          <path d="M8 14s1-1 4-1 4 1 4 1" />
          <path d="M9 9h.01" />
          <path d="M15 9h.01" />
          <path d="M12 17v-4" />
        </svg>
      ),
    },
    {
      label: "Timeline",
      href: "/timeline",
      icon: (active: boolean) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        if (item.isCenter) {
          return (
            <Link key={item.href} href={item.href} className="nav-center-btn-wrapper">
              <div className={`nav-center-btn ${isActive ? "active" : ""}`}>
                {item.icon(isActive)}
              </div>
              <span className="nav-label-center">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link key={item.href} href={item.href} className={`nav-item ${isActive ? "active" : ""}`}>
            <div className="nav-icon">{item.icon(isActive)}</div>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}

      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          height: 80px;
          background: var(--bg-nav);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 0 8px 12px 8px; /* Bottom padding for mobile home-bar safe area */
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          height: 100%;
          color: var(--text-muted);
          transition: var(--transition);
          gap: 4px;
        }

        .nav-item.active {
          color: var(--primary);
        }

        .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .nav-item:active .nav-icon {
          transform: scale(0.9);
        }

        .nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        /* Highlight Center Verification Tab */
        .nav-center-btn-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          top: -14px;
          width: 68px;
          z-index: 1001;
        }

        .nav-center-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary) 0%, #ff6b3d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(252, 82, 0, 0.4);
          transition: var(--transition);
          border: 4px solid var(--bg-main);
        }

        .nav-center-btn-wrapper:active .nav-center-btn {
          transform: scale(0.92);
          box-shadow: 0 2px 8px rgba(252, 82, 0, 0.6);
        }

        .nav-center-btn.active {
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(255, 255, 255, 0.3);
          border-color: var(--primary);
        }
        
        .nav-center-btn.active :global(svg) {
          stroke: var(--primary) !important;
        }

        .nav-label-center {
          font-size: 10px;
          font-weight: 700;
          color: var(--primary);
          margin-top: 4px;
        }
      `}</style>
    </nav>
  );
}
