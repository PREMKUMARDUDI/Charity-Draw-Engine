import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import scoreRoutes from "./routes/scoreRoutes.js";
import charityRoutes from "./routes/charityRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  }),
);

app.use(helmet()); // Set security HTTP headers
app.use(morgan("dev")); // Log requests to the console for easy debugging

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoreRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/winners", winnerRoutes);

// Basic Health Check Route
app.get("/", (req, res) => {
  res.send("Golf Charity API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
