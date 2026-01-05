import express from "express";
import {
  getSettings,
  updateGeneralSettings,
  getPublicSettings,
} from "../controllers/settings.controller.js";
import {
  getEmailConfiguration,
  updateEmailConfiguration,
  testEmailConfiguration,
} from "../controllers/email.controller.js";
import { initAuth } from "../lib/auth.js";

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
    try {
        const auth = initAuth();
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session || !session.user || session.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" });
        }
        req.user = session.user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Public routes
router.get("/public", getPublicSettings);

// Protected routes
router.get("/", requireAdmin, getSettings);
router.put("/general", requireAdmin, updateGeneralSettings);

router.get("/email-configuration", requireAdmin, getEmailConfiguration);
router.put("/email-configuration", requireAdmin, updateEmailConfiguration);
router.post("/email-configuration/test", requireAdmin, testEmailConfiguration);

export default router;
