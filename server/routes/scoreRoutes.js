import express from "express";
import { addScore, getUserScores } from "../controllers/scoreController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply the `protect` middleware to all score routes
router.route("/").post(protect, addScore).get(protect, getUserScores);

export default router;
