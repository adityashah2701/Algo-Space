import express from "express";
import authRoutes from "./routes/auth.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import interviewrRoutes from "./routes/interviewer.routes.js";
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 3000;
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path"
import multer from "multer";
import jobRoutes from "./routes/job.routes.js";
import cors from "cors"
const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    limits: { fileSize: 100 * 1024 * 1024 }, 
    createParentPath: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : ["http://localhost:5173", "*", ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use("/api/auth",authRoutes);
app.use("/api/candidate",candidateRoutes);
app.use("/api/interviewer",interviewrRoutes);
app.use("/api/job",jobRoutes)

app.use(express.static(path.join(__dirname, "frontend/dist")));


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds 5MB limit' });
    }
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  } else if (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal server error' });
  }
  next();
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});