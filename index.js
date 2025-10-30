import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import cookieParser from "cookie-parser";

configDotenv();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());


// Connect DB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/patients",patientRoutes)

// Default route
app.get("/", (req, res) => {
  res.send("HemoLink API is running...");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
