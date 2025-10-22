import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

configDotenv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("HemoLink API is running...");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
