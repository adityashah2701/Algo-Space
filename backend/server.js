import express from "express";
import authRoutes from "./routes/auth.routes.js";
import candidateRoutes from "./routes/candidate.routes.js";
import interviewrRoutes from "./routes/interviewer.routes.js";
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config()
const PORT = process.env.PORT || 3000;
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import path from "path"
// import { OpenAI } from "openai";
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


app.get('/api/leetcode-stats', async (req, res) => {
  try {
    const username = req.query.username;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const query = `
      query userProfileCalendar($username: String!, $year: Int) {
        matchedUser(username: $username) {
          userCalendar(year: $year) {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
            submissionCalendar
          }
        }
      }
    `;
    
    const response = await axios.post('https://leetcode.com/graphql/', {
      query,
      variables: {
        username,
        year: new Date().getFullYear()
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching LeetCode data:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      return res.status(error.response.status).json({ 
        error: `LeetCode API error: ${error.response.status}`,
        message: error.response.data
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({ error: 'No response from LeetCode API' });
    } else {
      // Something happened in setting up the request
      return res.status(500).json({ error: 'Error setting up request to LeetCode API' });
    }
  }
});


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