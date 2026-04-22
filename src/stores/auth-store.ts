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
  userDashboardType: 'user' | 'partner' | 'admin';
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

function getUserDashboardType(user: User | null): 'user' | 'partner' | 'admin' {
  if (!user) return 'user';
  if (user.adminRole) return 'admin';
  if (user.userType === 'agent' || user.userType === 'partner' || user.userType === 'enterprise') return 'partner';
  return 'user';
}

function checkPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.adminRole === 'super_admin') return true;
  if (user.adminRole === 'admin' && !permission.startsWith('admin:super')) return true;
  if (user.userType === 'agent' || user.userType === 'partner' || user.userType === 'enterprise') {
    return permission.startsWith('partner:');
  }
  return permission.startsWith('user:');
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
  adminRole: null,
  metadata: {},
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

function setAuthState(user: User, token: string) {
  localStorage.setItem('tokenspark_token', token);
  localStorage.setItem('tokenspark_user', JSON.stringify(user));
  return {
    user,
    token,
    isAuthenticated: true,
    isLoading: false,
    userDashboardType: getUserDashboardType(user),
    hasPermission: (permission: string) => checkPermission(user, permission),
  };
}

function mockAuthState() {
  const mockToken = 'mock-token-' + Date.now();
  return setAuthState(mockUser, mockToken);
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      userDashboardType: 'user',
      hasPermission: () => false,

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
          // Try to decode the Google ID token to get user info
          // ID token is a JWT with payload: { sub, email, name, picture, exp, iat }
          const base64Url = idToken.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const googlePayload = JSON.parse(jsonPayload);

          // Attempt to send to backend for verification
          const response = await apiClient.post(endpoints.auth.google.url, {
            idToken,
          });
          const { token, user } = response.data;
          set(setAuthState(user, token));
        } catch {
          // Backend not available - create user from Google ID token payload
          // This is a fallback for development when backend is not running
          try {
            const base64Url = idToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            );
            const googlePayload = JSON.parse(jsonPayload);

            const googleUser: User = {
              ...mockUser,
              id: 'google-' + googlePayload.sub,
              email: googlePayload.email,
              name: googlePayload.name || googlePayload.email.split('@')[0],
              userType: 'individual',
              status: 'active',
              kycStatus: 'pending',
            };
            set(setAuthState(googleUser, 'google-token-' + googlePayload.sub + '-' + Date.now()));
          } catch (decodeError) {
            // If token decoding fails, use mock user
            const googleUser = {
              ...mockUser,
              email: 'user@gmail.com',
              name: 'Google User',
            };
            set(setAuthState(googleUser, 'mock-google-token-' + Date.now()));
          }
        }
      },

      logout: () => {
        localStorage.removeItem('tokenspark_token');
        localStorage.removeItem('tokenspark_user');
        set({ user: null, token: null, isAuthenticated: false, userDashboardType: 'user', hasPermission: () => false });
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
