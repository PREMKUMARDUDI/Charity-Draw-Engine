import express from "express";
import {
  getUserWinnings,
  submitProof,
  getAdminWinners,
  updateWinnerStatus,
} from "../controllers/winnerController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User Routes
router.get("/my-winnings", protect, getUserWinnings);
router.put("/:id/proof", protect, submitProof);

// Admin Routes
router.get("/", protect, admin, getAdminWinners);
router.put("/:id/status", protect, admin, updateWinnerStatus);

export default router;
