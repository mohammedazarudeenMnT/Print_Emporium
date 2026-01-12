import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import mongoose from "mongoose";
import { sendEmail } from "../config/sendmail.js";

let authInstance = null;

export const initAuth = () => {
  if (authInstance) return authInstance;

  authInstance = betterAuth({
    database: mongodbAdapter(mongoose.connection.getClient().db("printemporium")),

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Only update session once per day (reduces DB writes)
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache for 5 minutes
      },
    },

    // Advanced configuration for production cookie handling
    // Using the recommended 'advanced' pattern from Better Auth docs
    advanced: {
      // Force secure cookies in production OR Vercel environment
      useSecureCookies: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
      // Default attributes for all cookies
      defaultCookieAttributes: {
        httpOnly: true,
        // vital for Vercel/Render deployments behind load balancers
        secure: process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
        // For cross-domain (frontend on domain A, backend on domain B), 
        // sameSite MUST be "none" in production with secure: true
        sameSite: process.env.NODE_ENV === "production" || process.env.VERCEL === "1" ? "none" : "lax",
        path: "/",
      },
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // Better Auth handles the redirect URI automatically based on baseURL.
        // It will be: ${baseURL}/callback/google
        // Based on your Google Console, this should resolve to:
        // http://localhost:5000/api/auth/callback/google
        
        // Optional: Always ask user to select account
        prompt: "select_account",
        accessType: "offline",
      },
    },

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 6,
      maxPasswordLength: 128,
      resetPasswordTokenExpiresIn: 3600, // 1 hour
      sendResetPassword: async ({ user, url, token }, request) => {
        console.log(`📧 Password reset requested for: ${user.email}`);

        // Only allow password reset for admin users
        if (user.role !== "admin") {
          console.log(
            `⚠️ Password reset denied: User ${user.email} is not an admin`
          );
          return;
        }

        try {
          // Create frontend reset URL instead of using the backend URL
          const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
          const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

          const emailHtml = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Reset Your Password - PrintEmporium</title>
            <!--[if mso]>
            <noscript>
              <xml>
                <o:OfficeDocumentSettings>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
              </xml>
            </noscript>
            <![endif]-->
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #374151;
                background-color: #f8fafc;
                padding: 20px;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
              .email-wrapper {
                max-width: 680px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 20px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 60px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
              }
              .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.15"/><circle cx="20" cy="80" r="0.5" fill="white" opacity="0.15"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                pointer-events: none;
              }
              .logo-container {
                position: relative;
                z-index: 2;
                margin-bottom: 24px;
              }
              .logo {
                width: 80px;
                height: 80px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 20px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
              }
              .logo:hover {
                transform: scale(1.05);
              }
              .logo-icon {
                width: 40px;
                height: 40px;
                background: #ffffff;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #667eea;
                font-weight: 800;
                font-size: 22px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              }
              .header h1 {
                color: #ffffff;
                font-size: 32px;
                font-weight: 800;
                margin-bottom: 12px;
                letter-spacing: -0.025em;
                position: relative;
                z-index: 2;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .header p {
                color: rgba(255, 255, 255, 0.95);
                font-size: 18px;
                font-weight: 500;
                position: relative;
                z-index: 2;
              }
              .content {
                padding: 60px 40px;
                background: #ffffff;
              }
              .greeting {
                font-size: 20px;
                font-weight: 700;
                color: #111827;
                margin-bottom: 32px;
                line-height: 1.4;
              }
              .message {
                font-size: 17px;
                color: #4b5563;
                margin-bottom: 40px;
                line-height: 1.7;
                font-weight: 400;
              }
              .button-container {
                text-align: center;
                margin: 48px 0;
              }
              .reset-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                padding: 20px 40px;
                border-radius: 16px;
                font-weight: 700;
                font-size: 18px;
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid transparent;
                position: relative;
                overflow: hidden;
              }
              .reset-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
              }
              .reset-button:hover::before {
                left: 100%;
              }
              .reset-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 20px 40px rgba(102, 126, 234, 0.5);
                border-color: rgba(255, 255, 255, 0.3);
              }
              .divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
                margin: 48px 0;
                border-radius: 1px;
              }
              .alternative {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                border: 2px solid #e2e8f0;
                border-radius: 16px;
                padding: 32px;
                margin: 40px 0;
                position: relative;
                overflow: hidden;
              }
              .alternative::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 16px 16px 0 0;
              }
              .alternative h3 {
                font-size: 16px;
                font-weight: 700;
                color: #374151;
                margin-bottom: 16px;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .alternative h3::before {
                content: '🔗';
                font-size: 18px;
              }
              .alternative-description {
                font-size: 15px;
                color: #6b7280;
                margin-bottom: 16px;
                line-height: 1.6;
              }
              .alternative-link {
                word-break: break-all;
                color: #667eea;
                text-decoration: none;
                font-size: 14px;
                font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
                background: #ffffff;
                padding: 16px;
                border-radius: 12px;
                border: 2px solid #e5e7eb;
                display: block;
                transition: all 0.2s ease;
                font-weight: 500;
              }
              .alternative-link:hover {
                border-color: #667eea;
                background: #f8fafc;
                transform: translateY(-1px);
              }
              .security-notice {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                border: 2px solid #f59e0b;
                border-radius: 16px;
                padding: 24px;
                margin: 40px 0;
                position: relative;
                overflow: hidden;
              }
              .security-notice::before {
                content: '🔒';
                position: absolute;
                top: 16px;
                right: 16px;
                font-size: 24px;
                opacity: 0.3;
              }
              .security-notice p {
                font-size: 15px;
                color: #92400e;
                margin: 0;
                font-weight: 600;
                line-height: 1.6;
              }
              .expiry {
                background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                border: 2px solid #ef4444;
                border-radius: 12px;
                padding: 16px 24px;
                font-size: 15px;
                color: #dc2626;
                font-weight: 700;
                text-align: center;
                margin: 32px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              }
              .expiry::before {
                content: '⏰';
                font-size: 18px;
              }
              .footer {
                background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                padding: 40px;
                text-align: center;
                border-top: 2px solid #e2e8f0;
              }
              .footer-text {
                font-size: 15px;
                color: #6b7280;
                margin-bottom: 20px;
                line-height: 1.6;
                font-weight: 500;
              }
              .footer-links {
                margin: 24px 0;
              }
              .footer-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
                margin: 0 16px;
                font-size: 14px;
                transition: color 0.2s ease;
              }
              .footer-link:hover {
                color: #764ba2;
              }
              .copyright {
                font-size: 13px;
                color: #9ca3af;
                font-weight: 500;
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
              }
              .stats {
                display: flex;
                justify-content: space-around;
                margin: 32px 0;
                padding: 24px;
                background: #f8fafc;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
              }
              .stat {
                text-align: center;
              }
              .stat-number {
                font-size: 24px;
                font-weight: 800;
                color: #667eea;
                display: block;
              }
              .stat-label {
                font-size: 12px;
                color: #6b7280;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                font-weight: 600;
              }
              @media (max-width: 600px) {
                body { padding: 10px; }
                .email-wrapper { margin: 0; border-radius: 12px; }
                .content, .header, .footer { padding: 32px 24px; }
                .header h1 { font-size: 28px; }
                .reset-button { padding: 18px 32px; font-size: 16px; }
                .logo { width: 64px; height: 64px; }
                .logo-icon { width: 32px; height: 32px; font-size: 18px; }
                .stats { flex-direction: column; gap: 16px; }
                .alternative, .security-notice { padding: 20px; }
              }
              @media (prefers-color-scheme: dark) {
                .alternative-link { background: #f8fafc; }
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <!-- Header -->
              <div class="header">
                <div class="logo-container">
                  <div class="logo">
                    <div class="logo-icon">P</div>
                  </div>
                </div>
                <h1>Reset Your Password</h1>
                <p>Secure access to your PrintEmporium account</p>
              </div>

              <!-- Content -->
              <div class="content">
                <div class="greeting">Hello ${user.name || 'System Administrator'} 👋</div>
                
                <div class="message">
                  We received a request to reset the password for your PrintEmporium account. 
                  To maintain the security of your account, please click the button below to create a new password.
                </div>

                <div class="button-container">
                  <a href="${resetUrl}" class="reset-button">Reset My Password</a>
                </div>

                <div class="expiry">This secure link expires in 1 hour</div>

                <div class="stats">
                  <div class="stat">
                    <span class="stat-number">256</span>
                    <span class="stat-label">Bit Encryption</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">1</span>
                    <span class="stat-label">Hour Validity</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">100%</span>
                    <span class="stat-label">Secure</span>
                  </div>
                </div>

                <div class="divider"></div>

                <div class="alternative">
                  <h3>Alternative Method</h3>
                  <div class="alternative-description">
                    If the button above doesn't work, you can copy and paste this secure link into your browser:
                  </div>
                  <a href="${resetUrl}" class="alternative-link">${resetUrl}</a>
                </div>

                <div class="security-notice">
                  <p>
                    <strong>Security Notice:</strong> If you didn't request this password reset, 
                    please ignore this email. Your account remains secure and no changes have been made. 
                    Consider enabling two-factor authentication for enhanced security.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-text">
                  This email was sent by PrintEmporium's secure authentication system. 
                  We take your account security seriously.
                </div>
                
                <div class="footer-links">
                  <a href="#" class="footer-link">Security Center</a>
                  <a href="#" class="footer-link">Support</a>
                  <a href="#" class="footer-link">Privacy Policy</a>
                </div>

                <div class="copyright">
                  © ${new Date().getFullYear()} PrintEmporium. All rights reserved.<br>
                  This is an automated security email. Please do not reply to this message.
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

          await sendEmail(user.email, "🔐 Reset Your Password - PrintEmporium", emailHtml);
          console.log(`✅ Password reset email sent to: ${user.email}`);
        } catch (error) {
          console.error(`❌ Failed to send reset email:`, error);
        }
      },
    },

    plugins: [
      admin({
        adminUserIds: [],
      }),
    ],

    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }) => {
        console.log(`📧 Sending verification email to: ${user.email}`);
        // Email sending will be handled by the settings controller for email changes
      },
      autoSignInAfterVerification: true,
    },

    user: {
      changeEmail: {
        enabled: true,
        updateEmailWithoutVerification: false,
      },
      additionalFields: {
        isActive: {
          type: "boolean",
          required: false,
          defaultValue: true,
        },
      },
    },

    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL?.endsWith("/api/auth") 
      ? process.env.BETTER_AUTH_URL 
      : `${process.env.BETTER_AUTH_URL}/api/auth`,

    trustedOrigins: [
      process.env.FRONTEND_URL,
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5000",
      "https://print-emporium-g6zs.vercel.app",
    ].filter(Boolean),

    // Configure redirect URLs for password reset
    redirects: {
      resetPassword: process.env.FRONTEND_URL || "http://localhost:3000",
    },
  });

  return authInstance;
};

export const getAuth = () => {
  if (!authInstance) {
    throw new Error("Auth not initialized. Call initAuth() first.");
  }
  return authInstance;
};
