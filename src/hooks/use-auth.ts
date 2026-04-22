import { useAuthStore } from '@/stores/auth-store';

/**
 * Hook for authentication state and actions
 */
export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
    refreshProfile,
  } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    googleLogin,
    logout,
    refreshProfile,
  };
}
