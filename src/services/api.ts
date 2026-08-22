const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export type HabitCategory =
  | "FITNESS"
  | "READING"
  | "COOKING"
  | "STUDY"
  | "MEDITATION"
  | "SKINCARE"
  | "CUSTOM";

export interface HabitResponse {
  id: number;
  title: string;
  description: string;
  category: HabitCategory;
  requiresSelfie: boolean;
  startDate: string;
  createdAt: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
}

export interface CheckInResponse {
  id: number;
  habitId: number;
  checkInDate: string;
  note: string;
  proofUrl: string | null;
  verificationStatus: "VERIFIED" | "PENDING" | "FAILED";
  qualityStatus: "PASSED" | "FAILED" | "UNCHECKED";
  faceMatchScore: number;
}

export interface FaceStatusResponse {
  enrolled: boolean;
  enrollmentDate: string | null;
  status: "ENROLLED" | "PENDING" | "NOT_ENROLLED";
}

export interface DashboardResponse {
  totalHabits: number;
  activeHabits: number;
  completedTodayCount: number;
  overallCompletionRate: number;
  currentStreak: number;
  longestStreak: number;
  topHabitId: number | null;
  topHabitTitle: string | null;
  recentCheckIns: CheckInResponse[];
}

export interface TimelineResponse {
  habitId: number;
  habitTitle: string;
  streakCount: number;
  checkIns: CheckInResponse[];
}

// Client Side Storage Helpers
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("habitproof_token");
  }
  return null;
};

const setStoredToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("habitproof_token", token);
  }
};

const clearStoredToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("habitproof_token");
    localStorage.removeItem("habitproof_user");
  }
};

const getStoredUser = () => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("habitproof_user");
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
};

const setStoredUser = (user: { email: string; name: string }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("habitproof_user", JSON.stringify(user));
  }
};

// Generic fetch wrappers
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Determine if it is a multi-part form data request (don't set content-type header manually in fetch for multipart)
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearStoredToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/auth") {
      window.location.href = "/auth";
    }
    throw new Error("Unauthorized");
  }

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as ApiResponse<T>;
}

// Mock Data Generator for Mock Mode Fallbacks (if server offline)
const IS_MOCK_ACTIVE = true; // Set to false to force real API hits, or let it fallback.

const mockHabits: HabitResponse[] = [
  {
    id: 1,
    title: "Morning 5K Run",
    description: "Start the day with cardiovascular health. Take a selfie on the running track.",
    category: "FITNESS",
    requiresSelfie: true,
    startDate: "2026-07-01",
    createdAt: "2026-07-01T06:00:00Z",
    currentStreak: 5,
    longestStreak: 12,
    lastCheckInDate: "2026-07-06",
    status: "ACTIVE",
  },
  {
    id: 2,
    title: "Read 20 Pages",
    description: "Daily reading of non-fiction book to learn new skills.",
    category: "READING",
    requiresSelfie: false,
    startDate: "2026-07-02",
    createdAt: "2026-07-02T08:00:00Z",
    currentStreak: 2,
    longestStreak: 5,
    lastCheckInDate: "2026-07-06",
    status: "ACTIVE",
  },
  {
    id: 3,
    title: "Mindfulness Meditation",
    description: "15 minutes of quiet meditation to reduce stress and improve focus.",
    category: "MEDITATION",
    requiresSelfie: true,
    startDate: "2026-07-03",
    createdAt: "2026-07-03T07:30:00Z",
    currentStreak: 0,
    longestStreak: 3,
    lastCheckInDate: null,
    status: "ACTIVE",
  },
];

const mockCheckIns: Record<number, CheckInResponse[]> = {
  1: [
    {
      id: 101,
      habitId: 1,
      checkInDate: "2026-07-06T07:15:00Z",
      note: "Ran near the lake, felt super fresh!",
      proofUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=300",
      verificationStatus: "VERIFIED",
      qualityStatus: "PASSED",
      faceMatchScore: 0.94,
    },
    {
      id: 102,
      habitId: 1,
      checkInDate: "2026-07-05T07:05:00Z",
      note: "Foggy morning, track was wet.",
      proofUrl: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=300",
      verificationStatus: "VERIFIED",
      qualityStatus: "PASSED",
      faceMatchScore: 0.91,
    },
  ],
  2: [
    {
      id: 201,
      habitId: 2,
      checkInDate: "2026-07-06T20:30:00Z",
      note: "Finished Chapter 4 of Clean Code.",
      proofUrl: null,
      verificationStatus: "VERIFIED",
      qualityStatus: "PASSED",
      faceMatchScore: 0.0,
    },
  ],
};

let mockFaceStatus: FaceStatusResponse = {
  enrolled: true,
  enrollmentDate: "2026-07-01T10:00:00Z",
  status: "ENROLLED",
};

// API Services Client
export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (email.includes("@")) {
          const mockRes = {
            token: "mock-jwt-token-xyz-12345",
            email,
            name: email.split("@")[0].toUpperCase(),
          };
          setStoredToken(mockRes.token);
          setStoredUser({ email: mockRes.email, name: mockRes.name });
          return mockRes;
        }
        throw new Error("Invalid credentials");
      }
      const res = await request<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setStoredToken(res.data.token);
      setStoredUser({ email: res.data.email, name: res.data.name });
      return res.data;
    },

    signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockRes = {
          token: "mock-jwt-token-xyz-12345",
          email,
          name,
        };
        setStoredToken(mockRes.token);
        setStoredUser({ email: mockRes.email, name: mockRes.name });
        return mockRes;
      }
      const res = await request<AuthResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setStoredToken(res.data.token);
      setStoredUser({ email: res.data.email, name: res.data.name });
      return res.data;
    },

    googleAuth: async (idToken?: string): Promise<AuthResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockRes = {
          token: "mock-google-jwt-token-xyz-12345",
          email: "alex.google@habitproof.com",
          name: "Alex Rivers (Google)",
        };
        setStoredToken(mockRes.token);
        setStoredUser({ email: mockRes.email, name: mockRes.name });
        return mockRes;
      }
      const res = await request<AuthResponse>("/api/v1/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      setStoredToken(res.data.token);
      setStoredUser({ email: res.data.email, name: res.data.name });
      return res.data;
    },

    logout: () => {
      clearStoredToken();
    },

    getCurrentUser: () => {
      return getStoredUser();
    },

    isAuthenticated: () => {
      return !!getStoredToken();
    },
  },

  habits: {
    list: async (): Promise<HabitResponse[]> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return [...mockHabits];
      }
      const res = await request<HabitResponse[]>("/api/v1/habits");
      return res.data;
    },

    create: async (
      title: string,
      description: string,
      category: HabitCategory,
      requiresSelfie: boolean,
      startDate: string
    ): Promise<HabitResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newHabit: HabitResponse = {
          id: mockHabits.length + 1,
          title,
          description,
          category,
          requiresSelfie,
          startDate,
          createdAt: new Date().toISOString(),
          currentStreak: 0,
          longestStreak: 0,
          lastCheckInDate: null,
          status: "ACTIVE",
        };
        mockHabits.push(newHabit);
        return newHabit;
      }
      const res = await request<HabitResponse>("/api/v1/habits", {
        method: "POST",
        body: JSON.stringify({ title, description, category, requiresSelfie, startDate }),
      });
      return res.data;
    },

    get: async (id: number): Promise<HabitResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const habit = mockHabits.find((h) => h.id === id);
        if (!habit) throw new Error("Habit not found");
        return habit;
      }
      const res = await request<HabitResponse>(`/api/v1/habits/${id}`);
      return res.data;
    },

    update: async (
      id: number,
      title: string,
      description: string,
      category: HabitCategory,
      requiresSelfie: boolean,
      status: "ACTIVE" | "COMPLETED" | "ARCHIVED"
    ): Promise<HabitResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const index = mockHabits.findIndex((h) => h.id === id);
        if (index === -1) throw new Error("Habit not found");
        mockHabits[index] = {
          ...mockHabits[index],
          title,
          description,
          category,
          requiresSelfie,
          status,
        };
        return mockHabits[index];
      }
      const res = await request<HabitResponse>(`/api/v1/habits/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, category, requiresSelfie, status }),
      });
      return res.data;
    },

    delete: async (id: number): Promise<void> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const index = mockHabits.findIndex((h) => h.id === id);
        if (index !== -1) mockHabits.splice(index, 1);
        return;
      }
      await request<void>(`/api/v1/habits/${id}`, {
        method: "DELETE",
      });
    },
  },

  checkins: {
    create: async (
      habitId: number,
      file: File | string | null = null,
      note: string = ""
    ): Promise<CheckInResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 2500)); // Simulate face scan verification delay
        const isFaceSuccess = file ? Math.random() > 0.15 : true; // Random scan verification simulation
        const newCheckIn: CheckInResponse = {
          id: Date.now(),
          habitId,
          checkInDate: new Date().toISOString(),
          note,
          proofUrl: typeof file === "string" ? file : file ? URL.createObjectURL(file) : null,
          verificationStatus: isFaceSuccess ? "VERIFIED" : "FAILED",
          qualityStatus: file ? "PASSED" : "UNCHECKED",
          faceMatchScore: file ? parseFloat((0.85 + Math.random() * 0.14).toFixed(2)) : 0.0,
        };
        
        if (!mockCheckIns[habitId]) {
          mockCheckIns[habitId] = [];
        }
        mockCheckIns[habitId].unshift(newCheckIn);

        // Update habit details
        const habit = mockHabits.find((h) => h.id === habitId);
        if (habit && isFaceSuccess) {
          habit.currentStreak += 1;
          if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
          }
          habit.lastCheckInDate = new Date().toISOString().split("T")[0];
        }

        return newCheckIn;
      }

      const formData = new FormData();
      if (file && typeof file !== "string") formData.append("file", file);
      if (note) formData.append("note", note);

      const res = await request<CheckInResponse>(`/api/v1/habits/${habitId}/check-ins`, {
        method: "POST",
        body: formData,
      });
      return res.data;
    },

    list: async (habitId: number): Promise<CheckInResponse[]> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        return mockCheckIns[habitId] || [];
      }
      const res = await request<CheckInResponse[]>(`/api/v1/habits/${habitId}/check-ins`);
      return res.data;
    },
  },

  face: {
    enroll: async (file?: File | string): Promise<FaceStatusResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate biometric registration delay
        mockFaceStatus = {
          enrolled: true,
          enrollmentDate: new Date().toISOString(),
          status: "ENROLLED",
        };
        return mockFaceStatus;
      }

      const formData = new FormData();
      if (file && typeof file !== "string") {
        formData.append("file", file);
      }

      const res = await request<FaceStatusResponse>("/api/v1/face/enroll", {
        method: "POST",
        body: formData,
      });
      return res.data;
    },

    getStatus: async (): Promise<FaceStatusResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return mockFaceStatus;
      }
      const res = await request<FaceStatusResponse>("/api/v1/face/status");
      return res.data;
    },
  },

  dashboard: {
    get: async (): Promise<DashboardResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const total = mockHabits.length;
        const active = mockHabits.filter((h) => h.status === "ACTIVE").length;
        
        // Count checked in today
        const todayStr = new Date().toISOString().split("T")[0];
        const completedToday = mockHabits.filter(
          (h) => h.lastCheckInDate === todayStr
        ).length;

        // Collect all checkins
        const allCheckins: CheckInResponse[] = [];
        Object.values(mockCheckIns).forEach((list) => {
          allCheckins.push(...list);
        });
        
        // Sort checkins by date desc
        allCheckins.sort(
          (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
        );

        // Highest streak habit
        let maxStreak = 0;
        let maxStreakHabit: HabitResponse | null = null;
        mockHabits.forEach((h) => {
          if (h.currentStreak > maxStreak) {
            maxStreak = h.currentStreak;
            maxStreakHabit = h;
          }
        });

        return {
          totalHabits: total,
          activeHabits: active,
          completedTodayCount: completedToday,
          overallCompletionRate: total > 0 ? Math.round((completedToday / total) * 100) : 0,
          currentStreak: maxStreak,
          longestStreak: mockHabits.reduce((max, h) => Math.max(max, h.longestStreak), 0),
          topHabitId: maxStreakHabit ? (maxStreakHabit as HabitResponse).id : null,
          topHabitTitle: maxStreakHabit ? (maxStreakHabit as HabitResponse).title : null,
          recentCheckIns: allCheckins.slice(0, 10),
        };
      }

      const res = await request<DashboardResponse>("/api/v1/dashboard");
      return res.data;
    },
  },

  timeline: {
    get: async (habitId: number): Promise<TimelineResponse> => {
      if (IS_MOCK_ACTIVE) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const habit = mockHabits.find((h) => h.id === habitId);
        if (!habit) throw new Error("Habit not found");
        return {
          habitId,
          habitTitle: habit.title,
          streakCount: habit.currentStreak,
          checkIns: mockCheckIns[habitId] || [],
        };
      }
      const res = await request<TimelineResponse>(`/api/v1/habits/${habitId}/timeline`);
      return res.data;
    },
  },
};
