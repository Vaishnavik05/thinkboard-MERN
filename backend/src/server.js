import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDb } from "./config/db.js";
import { rateLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Connect to DB
connectDb();

// Middleware
app.use(express.json());
app.use(rateLimiter);

app.use(cors({
  origin: "*"
}));

app.use((req, res, next) => {   
  console.log(`Request method: ${req.method} | URL: ${req.url}`);
  next();
});

// Routes
app.use("/api/notes", notesRoutes);

// Start server
app.listen(port, () => {
  console.log("Server is running on port:", port);
});
