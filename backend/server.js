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
app.use("/api/auth",authRoutes);
app.use("/api/candidate",candidateRoutes);
app.use("/api/interviewer",interviewrRoutes);


app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});