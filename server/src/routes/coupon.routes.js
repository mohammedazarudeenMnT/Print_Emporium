import express from "express";
import { 
  getAllCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon, 
  validateCoupon,
  getActiveCoupons
} from "../controllers/coupon.controller.js";
import { requireAdmin } from "../middleware/auth.middleware.js";
import { requireAdminOrSignedRequest } from "../middleware/signature.middleware.js";

const router = express.Router();

// Public routes
router.get("/active", getActiveCoupons);
router.post("/validate", validateCoupon);

// Admin routes
router.get("/", requireAdminOrSignedRequest, getAllCoupons);
router.post("/", requireAdmin, createCoupon);
router.put("/:id", requireAdmin, updateCoupon);
router.delete("/:id", requireAdmin, deleteCoupon);

export default router;
