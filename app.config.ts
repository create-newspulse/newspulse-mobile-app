// Programmatic Expo app config so we can document and set envs.
import appJson from "./app.json";

export default ({ config }: { config: any }) => ({
  ...appJson.expo,
  // Surface a public env var that can be set at dev/CI/build time.
  // For development, you can keep this pointing to Render:
  //   EXPO_PUBLIC_API_BASE_URL=https://newspulse-backend-real.onrender.com
  // For production later, set this to your production backend URL:
  //   EXPO_PUBLIC_API_BASE_URL=https://api.your-production-domain.com
  extra: {
    ...(appJson.expo?.extra || {}),
    EXPO_PUBLIC_API_BASE_URL:
      process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://newspulse-backend-real.onrender.com",
  },
});
