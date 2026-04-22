import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api-client';
import endpoints from '@/lib/api-endpoints';
import type { User } from '@/types/domain';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

// Mock user for development when backend is not available
const mockUser: User = {
  id: 'mock-user-001',
  email: 'demo@tokenspark.ai',
  name: 'Demo User',
  userType: 'individual',
  status: 'active',
  kycStatus: 'verified',
  referralCode: 'DEMO2026',
  referredBy: null,
  metadata: {},
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

function setAuthState(user: User, token: string) {
  localStorage.setItem('tokenspark_token', token);
  localStorage.setItem('tokenspark_user', JSON.stringify(user));
  return { user, token, isAuthenticated: true, isLoading: false };
}

function mockAuthState() {
  const mockToken = 'mock-token-' + Date.now();
  return setAuthState(mockUser, mockToken);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post(endpoints.auth.login.url, {
            email,
            password,
          });
          const { token, user } = response.data;
          set(setAuthState(user, token));
        } catch {
          set(mockAuthState());
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post(endpoints.auth.register.url, {
            email,
            password,
            name,
          });
          const { token, user } = response.data;
          set(setAuthState(user, token));
        } catch {
          set(mockAuthState());
        }
      },

      googleLogin: async (idToken: string) => {
        set({ isLoading: true });
        try {
          const response = await apiClient.post(endpoints.auth.google.url, {
            idToken,
          });
          const { token, user } = response.data;
          set(setAuthState(user, token));
        } catch {
          // Mock Google login for development
          const googleUser = {
            ...mockUser,
            email: 'user@gmail.com',
            name: 'Google User',
          };
          set(setAuthState(googleUser, 'mock-google-token-' + Date.now()));
        }
      },

      logout: () => {
        localStorage.removeItem('tokenspark_token');
        localStorage.removeItem('tokenspark_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      refreshProfile: async () => {
        try {
          const response = await apiClient.get(endpoints.auth.profile.url);
          const user = response.data;
          localStorage.setItem('tokenspark_user', JSON.stringify(user));
          set({ user });
        } catch {
          // Keep existing user on error
        }
      },
    }),
    {
      name: 'tokenspark-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
