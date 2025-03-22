import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ProfileCompletionEmailTemplate,
  WelcomeBackEmailTemplate,
  WelcomeEmailTemplate,
} from "../templates/EmailTemplates.js";
import { sendMail } from "../utils/sendMail.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// 1. User Registration with Role Selection
export const userRegister = async (req, res) => {
  try {
    const { email, password, firstName, lastName, gender, role } = req.body;
    const profilePicture = req.files?.profilePicture;
    let profilepicurl = "";

    // Validate role
    if (!role || !["candidate", "interviewer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role selected",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Upload profile picture if provided
    if (profilePicture) {
      profilepicurl = await uploadToCloudinary(profilePicture.tempFilePath);
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      role,
      profilePicture: profilepicurl,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    const info = await sendMail({
      to: newUser.email,
      subject: "Welcome To Algo Space",
      html: WelcomeEmailTemplate(newUser),
    })
    if (!info.accepted.includes(newUser.email)) {
      return res.status(400).json({ message: "Failed to send welcome email" });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// 2. Complete Profile based on Role
export const completeUserProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "candidate") {
      const { resumeUrl, skills, experience, githubUsername, leetcodeUsername, codeforcesUsername, codechefUsername, preferredRoles } = req.body;
      user.candidateProfile = { resumeUrl, skills, experience, githubUsername, leetcodeUsername, codeforcesUsername, codechefUsername, preferredRoles };
    } else if (user.role === "interviewer") {
      const { expertise, company, position, availabilitySchedule } = req.body;
      user.interviewerProfile = { expertise, company, position, availabilitySchedule };
    }

    await user.save();

    const info = await sendMail({ to: user.email, subject: "Profile Completion", html: ProfileCompletionEmailTemplate(user) });

    return res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      data: user,
    });
  } catch (error) {
    console.error("Profile completion error:", error);
    return res.status(500).json({ success: false, message: "Profile completion failed", error: error.message });
  }
};

// 3. User Login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const info = await sendMail({ to: user.email, subject: "Login Notification", html:   WelcomeBackEmailTemplate(user) });

    return res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Login failed", error: error.message });
  }
};

// 4. User Logout
export const userLogout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed", error: error.message });
  }
};


export const getUserProfile = async (req,res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
    
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
    
  }
}
