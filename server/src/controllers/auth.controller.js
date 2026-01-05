import { getAuth } from "../lib/auth.js";
import {
  validateRequired,
  validateEmail,
  validatePassword,
} from "../utils/validation.js";

// Register (disabled as per original requirement)
export const register = async (req, res) => {
  try {
    return res.status(501).json({ message: "Registration disabled." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login with email
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    let validation = validateRequired(email, "Email");
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    validation = validateRequired(password, "Password");
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    // Validate email format
    validation = validateEmail(email);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const auth = getAuth();

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    if (!result.ok) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Forward cookies from Better Auth to the client
    if (result.headers) {
      result.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
    }

    const data = await result.json();

    if (data.user?.banned) {
      return res.status(403).json({
        success: false,
        message: "Your account has been banned",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: data,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const auth = getAuth();
    const result = await auth.api.signOut({
      headers: req.headers,
      asResponse: true,
    });

    if (!result.ok) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    if (result.headers) {
      result.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

// Get current user session
export const getSession = async (req, res) => {
  try {
    const auth = getAuth();
    const result = await auth.api.getSession({
      headers: req.headers,
      asResponse: true,
    });

    if (!result.ok) {
      return res.status(401).json({
        success: false,
        message: "No active session",
      });
    }

    if (result.headers) {
      result.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
    }

    const data = await result.json();

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get session error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get session",
    });
  }
};

// Forget Password
export const forgetPassword = async (req, res) => {
  try {
    const { email, redirectTo } = req.body;

    let validation = validateRequired(email, "Email");
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    validation = validateEmail(email);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const auth = getAuth();

    await auth.api.requestPasswordReset({
      body: {
        email,
        redirectTo: redirectTo || `${process.env.FRONTEND_URL}/reset-password`,
      },
    });

    return res.status(200).json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent",
    });
  } catch (error) {
    console.error("Forget password error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    let validation = validateRequired(token, "Reset token");
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    validation = validatePassword(newPassword);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    const auth = getAuth();

    try {
      await auth.api.resetPassword({
        body: {
          token,
          newPassword,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (apiError) {
      return res.status(400).json({
        success: false,
        message: apiError.message || "Invalid or expired reset token",
      });
    }
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};
