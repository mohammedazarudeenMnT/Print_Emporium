import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";

import { initAuth } from "./src/lib/auth.js";
import { connectDB } from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";
import settingsRoutes from "./src/routes/settings.routes.js";
import { seedAdmin } from "./src/utils/seedAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500 ? "🔴" : res.statusCode >= 400 ? "🟡" : "🟢";
    const path = req.originalUrl || req.url;
    console.log(
      `${statusColor} ${res.statusCode} ${req.method} ${path} - ${duration}ms`
    );
  });

  next();
});

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("PrintEmporium Backend is running");
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize Better Auth after database connection
    const auth = initAuth();
    console.log("✅ Better Auth initialized");
    
    // Seed admin user
    await seedAdmin();

    // Better Auth API Handler (MUST be before express.json())
    app.use("/api/auth", toNodeHandler(auth));

    // Mount express json middleware AFTER Better Auth handler
    app.use(express.json());
    
    // Custom Routes
    app.use("/api/auth", authRoutes); // Custom auth endpoints if any
    app.use("/api/settings", settingsRoutes);

    // Example of getting session in a custom route
    app.get("/api/me", async (req, res) => {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(req.headers),
        });
        
        if (!session) {
          return res.status(401).json({ error: "Not authenticated" });
        }
        
        return res.json(session);
      } catch (error) {
        console.error("Session error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });

    // Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}`);
      console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
