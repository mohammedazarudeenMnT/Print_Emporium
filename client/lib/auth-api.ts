import { axiosInstance } from "./axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  image?: string;
  banned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string;
      userAgent?: string;
    };
  };
}

// Email/Password Authentication
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    console.log('🔄 Attempting login with:', { email, apiUrl: process.env.NEXT_PUBLIC_API_URL });
    const response = await axiosInstance.post("/api/auth/sign-in/email", { 
      email, 
      password 
    });
    console.log('✅ Login successful:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const signup = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    console.log('🔄 Attempting signup with:', { email, name, apiUrl: process.env.NEXT_PUBLIC_API_URL });
    const response = await axiosInstance.post("/api/auth/sign-up/email", { 
      email, 
      password,
      name
    });
    console.log('✅ Signup successful:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ Signup failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    console.log('🔄 Attempting logout');
    const response = await axiosInstance.post("/api/auth/sign-out");
    console.log('✅ Logout successful');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ Logout failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

export const getSession = async (): Promise<AuthResponse> => {
  try {
    console.log('🔄 Getting session');
    const response = await axiosInstance.get("/api/auth/get-session");
    console.log('✅ Session retrieved:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.log('ℹ️ No active session found');
    // Session not found is not an error, just return empty
    return {
      success: false,
      message: "No active session"
    };
  }
};

export const requestPasswordReset = async (email: string, redirectTo?: string) => {
  try {
    console.log('🔄 Requesting password reset for:', email);
    const response = await axiosInstance.post("/api/auth/request-password-reset", { 
      email, 
      redirectTo: redirectTo || "/reset-password"
    });
    console.log('✅ Password reset request successful');
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    console.error('❌ Password reset request failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send reset email");
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const response = await axiosInstance.post("/api/auth/reset-password", { 
      token, 
      newPassword 
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to reset password");
  }
};

// Google OAuth authentication - handles both login AND registration
export const signInWithGoogle = async (callbackURL?: string): Promise<void> => {
  try {
    console.log('🔄 Starting Google OAuth flow...');
    
    // Create full frontend URL for callback
    const frontendUrl = window.location.origin; // Gets http://localhost:3000
    const fullCallbackURL = callbackURL ? `${frontendUrl}${callbackURL}` : `${frontendUrl}/dashboard`;
    
    // Use axios to make the request with proper JSON content type
    const response = await axiosInstance.post("/api/auth/sign-in/social", {
      provider: "google",
      callbackURL: fullCallbackURL
    });
    
    console.log('✅ Google OAuth initiated:', response.data);
    
    // If the response contains a URL, redirect to it
    if (response.data && response.data.url) {
      window.location.href = response.data.url;
    }
  } catch (error: any) {
    console.error('❌ Google OAuth error:', error.response?.data || error.message);
    throw error;
  }
};

// Alternative method for getting session using axios
export const getBetterAuthSession = async () => {
  const response = await axiosInstance.get("/api/auth/get-session");
  return response.data;
};

// Get current user info (custom endpoint)
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/api/me");
  return response.data;
};
