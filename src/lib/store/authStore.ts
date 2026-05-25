import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/types";
import { MOCK_USERS } from "@/lib/data/auth";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 900));
        const found = MOCK_USERS.find(
          (u) => u.email === email && u.password === password
        );
        if (!found) {
          set({ isLoading: false, error: "Invalid email or password." });
          return;
        }
        const { password: _pw, ...user } = found;
        set({ user, isLoading: false, error: null });
      },

      logout: () => set({ user: null }),
    }),
    { name: "presence-auth" }
  )
);
