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



// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// app.post('/api/generate-quiz', async (req, res) => {
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system", 
//           content: "You are a quiz generator. Create 5 multiple-choice questions across different topics."
//         },
//         {
//           role: "user",
//           content: `Generate 5 multiple-choice questions. For each question, provide:
//           - A clear, interesting question
//           - 4 answer options
//           - The correct answer
          
//           Respond in this exact JSON format:
//           [
//             {
//               "question": "...",
//               "options": ["option1", "option2", "option3", "option4"],
//               "correctAnswer": "correct option"
//             }
//           ]`
//         }
//       ],
//       response_format: { type: "json_object" }
//     });

//     // Parse the generated quiz
//     const quizContent = response.choices[0].message.content;
//     const questions = JSON.parse(quizContent);

//     res.json({ questions });
//   } catch (error) {
//     console.error('Quiz generation error:', error);
//     res.status(500).json({ error: 'Quiz generation failed' });
//   }
// });

// // Answer Verification Endpoint
// app.post('/api/verify-answer', async (req, res) => {
//   const { question, selectedAnswer, correctAnswer } = req.body;

//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: "You are an answer verification assistant."
//         },
//         {
//           role: "user",
//           content: `Evaluate the following multiple-choice question:
//           Question: ${question}
//           Correct Answer: ${correctAnswer}
//           Selected Answer: ${selectedAnswer}

//           Carefully analyze if the selected answer matches the correct answer.
//           Respond with ONLY "true" if the selected answer is exactly the same as the correct answer, or "false" otherwise.
//           Be precise and case-sensitive.
//           Do not add any additional explanation or text.`
//         }
//       ]
//     });

//     // Extract the verification result
//     const responseText = response.choices[0].message.content.trim().toLowerCase();
//     const isCorrect = responseText === 'true';

//     res.json({ 
//       isCorrect,
//       correctAnswer,
//       selectedAnswer
//     });
//   } catch (error) {
//     console.error('Answer verification error:', error);
//     res.status(500).json({ error: 'Answer verification failed' });
//   }
// });


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