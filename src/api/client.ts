import axios from "axios";

export const api = axios.create({
  // Render external URL for the News Pulse backend
  baseURL: "https://newspulse-backend-real.onrender.com",
  timeout: 10000,
});
