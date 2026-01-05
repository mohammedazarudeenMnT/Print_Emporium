import express from "express";
import {
  register,
  login,
  logout,
  getSession,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", getSession);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

export default router;
