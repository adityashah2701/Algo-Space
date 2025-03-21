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
app.use(cors({
  origin: process.env.NODE_ENV === "production" ? process.env.CLIENT_URL : ["http://localhost:5173", "*", ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use("/api/auth",authRoutes);
app.use("/api/candidate",candidateRoutes);
app.use("/api/interviewer",interviewrRoutes);

app.use(express.static(path.join(__dirname, "frontend/dist")));


app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});