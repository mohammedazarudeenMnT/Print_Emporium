import express from "express";
import { getAllCustomers, getCustomerDetails } from "../controllers/customer.controller.js";
import { requireAdminOrEmployee } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAdminOrEmployee, getAllCustomers);
router.get("/:id", requireAdminOrEmployee, getCustomerDetails);

export default router;
