import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import caseRoutes from "./routes/caseRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    project: "AI Mystery Room",
    message: "Backend server is running successfully!"
  });
});

app.use("/api/cases", caseRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log("AI MYSTERY ROOM BACKEND");
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();