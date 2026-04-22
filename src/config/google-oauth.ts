// Google OAuth configuration
// Replace with your actual Google Client ID from Google Cloud Console
// Setup: https://console.cloud.google.com/apis/credentials

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

// OAuth scopes requested
export const GOOGLE_SCOPES = [
  'email',
  'profile',
];

// Whether to enable one-tap sign-in
export const GOOGLE_ONE_TAP_ENABLED = true;

// Auto-select for returning users
export const GOOGLE_AUTO_SELECT = true;
