import express from "express";
import { runDraw } from "../controllers/adminController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Notice we use BOTH protect (must be logged in) AND admin (must be an admin)
router.post("/run-draw", protect, admin, runDraw);

export default router;
