import express from "express";
import { connectDB } from "./config/db.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});