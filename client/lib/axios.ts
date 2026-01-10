import axios from "axios";
import { getSignatureHeaders } from "./signature-utils";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatic Signature Injection for Server-Side Fetching
// This will only run on the server to keep your secret safe!
axiosInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    // Use the universal API_SHARED_SECRET
    const secret = process.env.API_SHARED_SECRET || "default_api_secret_change_me";
    
    if (secret && config.url && config.method) {
      const sigHeaders = getSignatureHeaders(
        config.method,
        config.url,
        secret
      );
      config.headers["x-signature"] = sigHeaders["x-signature"];
      config.headers["x-timestamp"] = sigHeaders["x-timestamp"];
    } else if (!secret) {
      console.warn("⚠️ API_SHARED_SECRET is not defined. Server-side signatures will fail.");
    }
  }
  return config;
});
