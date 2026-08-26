# 📱 HabitProof UI — Next.js Mobile-First Web Client

HabitProof is a modern, mobile-responsive habit tracking and biometric accountability web application built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **TypeScript**, and HTML5 Camera Biometrics integration.

---

## ✨ Features

- **📱 Mobile-First & Desktop Adaptive Design**:
  - Native 100% edge-to-edge layout on mobile phones.
  - Centered luxury phone frame on desktop screens with dark aesthetic styling.
- **⚡ Strava & Fitness Tracker Theme**:
  - Bento grid stats, Apple-style SVG streak progress ring, and real-time habit cards.
- **📸 Real-Time Camera & Biometric Verification**:
  - Direct webcam access via `navigator.mediaDevices.getUserMedia()`.
  - Laser scan animations, face focus guides, and simulated liveness detection fallback.
- **🔐 Modern Authentication**:
  - Email/Passcode authentication + **"Continue with Google"** OAuth flow.
  - One-click **Demo Credentials Auto-Fill** (`athlete@habitproof.com` / `demo123`).
  - Biometric Fast Pass quick entry.
- **🎛️ Global Settings & Profile Modal**:
  - Instant access from top app bar on all pages.
  - Camera permissions toggle, push notification alerts, and prominent **Log Out Account** action.
- **🔄 Hybrid API Architecture**:
  - Works out-of-the-box in **Mock Mode** (`IS_MOCK_ACTIVE = true`) for standalone demos without a backend.
  - Seamlessly switches to live Spring Boot backend API (`http://localhost:8080` or production URL).

---

## 🏗️ Tech Stack

| Technology | Description |
| :--- | :--- |
| **Framework** | Next.js 16.2+ (App Router & Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 + PostCSS adapter (`@tailwindcss/postcss`) |
| **Icons & Fonts** | Google Material Symbols Outlined, Inter, Outfit |
| **API Client** | Typed REST service layer (`src/services/api.ts`) |

---

## 📂 Project Structure

```
ui/
├── public/                     # Static assets & public media
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Responsive root layout (Mobile full width / Desktop phone frame)
│   │   ├── globals.css         # Tailwind v4 styles, glass cards, neon scan animations
│   │   ├── page.tsx            # Dashboard page (Bento grid, circular progress, proof feed)
│   │   ├── auth/page.tsx       # Auth page (Login/Signup, Google OAuth, Demo auto-fill)
│   │   ├── habits/page.tsx     # Consistency engine (Habit list, category tags, modal)
│   │   ├── verify/page.tsx     # Live selfie camera viewfinder & verification submission
│   │   ├── verify/result/      # Verification result success/risk state
│   │   ├── face-enroll/        # Biometric Face ID registration screen
│   │   └── timeline/page.tsx   # Activity history log with workout/mindfulness filters
│   ├── components/
│   │   ├── BottomNav.tsx       # 5-item floating glass navigation bar
│   │   └── SettingsModal.tsx   # Mobile slide-up settings sheet with Logout
│   └── services/
│       └── api.ts              # Unified API client mapping to Spring Boot endpoints
├── package.json
├── tsconfig.json
└── postcss.config.mjs
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js 18.18+** or **Node.js 20+**
- **npm** or **pnpm** / **yarn**

---

### 2. Installation

```bash
# Clone the repository
git clone <repository-url>
cd Habit-proof/ui

# Install dependencies
npm install
```

---

### 3. Environment Variables (Optional)

Create a `.env.local` file in the `ui/` directory:

```env
# URL of your Spring Boot backend (when IS_MOCK_ACTIVE = false in src/services/api.ts)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

> **Note**: For local demos without backend running, `IS_MOCK_ACTIVE = true` is pre-configured in `src/services/api.ts`, allowing all pages, logins, habit creations, and check-ins to run with mock data!

---

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🧪 Demo Credentials

On the `/auth` login screen, you can use the **"Auto Fill"** button or enter:
- **Email**: `athlete@habitproof.com`
- **Password**: `demo123`
- Or tap **"Continue with Google"** / **"Biometric Fast Pass"**

---

## ☁️ Free Hosting & Deployment (Vercel)

The easiest way to deploy the Next.js UI for free is via **Vercel**:

1. Push your code to GitHub.
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and set the **Root Directory** to `ui`.
4. Configure Build Command: `npm run build`
5. (Optional) Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-api.onrender.com`
6. Click **Deploy**. Your app will be live on a fast global edge CDN with automatic HTTPS!
