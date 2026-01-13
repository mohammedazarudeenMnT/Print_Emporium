import express from "express";
import {
  createLead,
  getAllLeads,
  updateLead,
  deleteLead,
} from "../controllers/lead.controller.js";
import { requireAuth, requireAdminOrEmployee } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route to submit contact form
router.post("/", createLead);

// Protected routes for admins/employees to manage leads
router.get("/all", requireAdminOrEmployee, getAllLeads);
router.patch("/:id", requireAdminOrEmployee, updateLead);
router.delete("/:id", requireAdminOrEmployee, deleteLead);

export default router;
