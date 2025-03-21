import mongoose from "mongoose";

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, enum: ["candidate", "interviewer"], required: true },
  profilePicture: String,
  gender: { type: String, required: true, enum: ["male", "female", "other"] },

  // For candidates
  candidateProfile: {
    resumeUrl: String,
    skills: { type: [String], enum: ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"] },
    experience: Number,
    githubUsername: String,
    leetcodeUsername: String,
    codeforcesUsername: String,
    codechefUsername: String,
    preferredRoles: { type: [String], enum: ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist"] }
  },

  // For interviewers
  interviewerProfile: {
    expertise: { type: [String], enum: ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"] },
    company: String,
    position: String,
    availabilitySchedule: [
      { day: String, startTime: String, endTime: String }
    ]
  }
},{
    timestamps: true
});

const User = model("User", userSchema);

export default User;