import express from "express";
import authRoutes from "./routes/auth.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 3000;
import { connectDB } from "./config/db.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/candidate",candidateRoutes);


app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});