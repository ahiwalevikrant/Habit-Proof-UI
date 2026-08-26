const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface AuthResponse {
  token: string;
  publicId?: string;
  email: string;
  name: string;
  faceEnrolled?: boolean;
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

export interface TodayHabitSummary {
  habitId: number;
  title: string;
  completedToday: boolean;
  currentStreak: number;
}

export interface DashboardResponse {
  totalHabits: number;
  completedToday: number;
  pendingToday: number;
  bestStreak: number;
  todayHabits: TodayHabitSummary[];
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

const setStoredUser = (user: { email: string; name: string; publicId?: string }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("habitproof_user", JSON.stringify(user));
  }
};

// Generic fetch wrapper connecting directly to backend
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

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

// Direct API Services Client
export const api = {
  auth: {
    login: async (email: string, password: string): Promise<AuthResponse> => {
      const res = await request<AuthResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setStoredToken(res.data.token);
      setStoredUser({ email: res.data.email, name: res.data.name, publicId: res.data.publicId });
      return res.data;
    },

    signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
      const res = await request<AuthResponse>("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      setStoredToken(res.data.token);
      setStoredUser({ email: res.data.email, name: res.data.name, publicId: res.data.publicId });
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

  users: {
    me: async () => {
      const res = await request<{ publicId: string; name: string; email: string; faceEnrolled: boolean }>("/api/v1/users/me");
      return res.data;
    },
  },

  habits: {
    list: async (): Promise<HabitResponse[]> => {
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
      const res = await request<HabitResponse>("/api/v1/habits", {
        method: "POST",
        body: JSON.stringify({ title, description, category, requiresSelfie, startDate }),
      });
      return res.data;
    },

    get: async (id: number): Promise<HabitResponse> => {
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
      const res = await request<HabitResponse>(`/api/v1/habits/${id}`, {
        method: "PUT",
        body: JSON.stringify({ title, description, category, requiresSelfie, status }),
      });
      return res.data;
    },

    delete: async (id: number): Promise<void> => {
      await request<void>(`/api/v1/habits/${id}`, {
        method: "DELETE",
      });
    },
  },

  checkins: {
    create: async (
      habitId: number,
      file: File | null = null,
      note: string = ""
    ): Promise<CheckInResponse> => {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
      }
      if (note) {
        formData.append("note", note);
      }

      const res = await request<CheckInResponse>(`/api/v1/habits/${habitId}/check-ins`, {
        method: "POST",
        body: formData,
      });
      return res.data;
    },

    list: async (habitId: number): Promise<CheckInResponse[]> => {
      const res = await request<CheckInResponse[]>(`/api/v1/habits/${habitId}/check-ins`);
      return res.data;
    },
  },

  face: {
    enroll: async (file: File): Promise<FaceStatusResponse> => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await request<FaceStatusResponse>("/api/v1/face/enroll", {
        method: "POST",
        body: formData,
      });
      return res.data;
    },

    getStatus: async (): Promise<FaceStatusResponse> => {
      const res = await request<FaceStatusResponse>("/api/v1/face/status");
      return res.data;
    },
  },

  dashboard: {
    get: async (): Promise<DashboardResponse> => {
      const res = await request<DashboardResponse>("/api/v1/dashboard");
      return res.data;
    },
  },

  timeline: {
    get: async (habitId: number): Promise<TimelineResponse> => {
      const res = await request<TimelineResponse>(`/api/v1/habits/${habitId}/timeline`);
      return res.data;
    },
  },
};
