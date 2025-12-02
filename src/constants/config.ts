// Centralized app configuration
// Reads public env var injected by Expo (EXPO_PUBLIC_*) with a safe fallback.

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
  "https://newspulse-backend-real.onrender.com";
