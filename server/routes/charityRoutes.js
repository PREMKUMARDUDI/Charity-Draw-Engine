import express from "express";
import {
  getCharities,
  updateUserCharity,
  createCharity,
} from "../controllers/charityController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getCharities).post(protect, createCharity); // We will use this to quickly add dummy charities

router.put("/select", protect, updateUserCharity);

export default router;
