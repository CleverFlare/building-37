import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthUser = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarKey?: string | null;
} | null;

interface AuthState {
  user: AuthUser;
  setUser: (user: AuthUser) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "user", storage: createJSONStorage(() => localStorage) },
  ),
);
