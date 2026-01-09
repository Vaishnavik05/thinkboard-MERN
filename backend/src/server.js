import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import {connectDb} from "./config/db.js";
console.log(process.env.MONGO_URI); 
import { rateLimiter } from "./middleware/rateLimiter.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const app = express();
import mongoose from "mongoose";
const port = process.env.PORT || 5001;
connectDb(); 

app.use(express.json()); 
app.use(rateLimiter);
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);
app.use((req, res, next) => {   
  console.log(`Request method is: ${req.method} & Request URL is: ${req.url}`);
  next();
});
app.use("/api/notes", notesRoutes);

app.listen(5001, () => {
  console.log("Server is running on port: ", port);
});