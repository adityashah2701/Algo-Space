import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. Basic User Registration
export const userRegister = async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        lastName,
        gender
      } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "User already exists with this email" 
        });
      }
  
      // Hash password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
  
      // Create new user (without role)
      const newUser = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        gender
      });
  
      // Generate temporary token for completing registration
      const tempToken = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Short expiry for registration flow
      );
  
      return res.status(201).json({
        success: true,
        message: "Basic registration successful. Please select a role.",
        data: {
          userId: newUser._id,
          tempToken
        }
      });
    } catch (error) {
      console.error("Basic registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Registration failed",
        error: error.message
      });
    }
  };
  
  // 2. Role Selection
export const selectUserRole = async (req, res) => {
    try {
      const { userId, role, profilePicture } = req.body;
      
      // Validate role
      if (!role || !["candidate", "interviewer"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role selected"
        });
      }
  
      // Update user with role
      const user = await User.findByIdAndUpdate(
        userId,
        { role, profilePicture },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Generate token for completing profile
      const profileToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' } // Short expiry for registration flow
      );
  
      return res.status(200).json({
        success: true,
        message: `Role selected as ${role}. Please complete your profile.`,
        data: {
          userId: user._id,
          role: user.role,
          profileToken
        }
      });
    } catch (error) {
      console.error("Role selection error:", error);
      return res.status(500).json({
        success: false,
        message: "Role selection failed",
        error: error.message
      });
    }
  };
  
  // 3. Complete Profile based on Role
export const completeUserProfile = async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Handle candidate profile
      if (user.role === "candidate") {
        const {
          resumeUrl,
          skills,
          experience,
          githubUsername,
          leetcodeUsername,
          codeforcesUsername,
          codechefUsername,
          preferredRoles
        } = req.body;
  
        user.candidateProfile = {
          resumeUrl,
          skills,
          experience,
          githubUsername,
          leetcodeUsername,
          codeforcesUsername,
          codechefUsername,
          preferredRoles
        };
      } 
      // Handle interviewer profile
      else if (user.role === "interviewer") {
        const {
          expertise,
          company,
          position,
          availabilitySchedule
        } = req.body;
  
        user.interviewerProfile = {
          expertise,
          company,
          position,
          availabilitySchedule
        };
      }
  
      // Save updated user
      await user.save();
  
      // Generate final JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
  
      return res.status(200).json({
        success: true,
        message: "Registration completed successfully",
        data: {
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            gender: user.gender,
            profilePicture: user.profilePicture,
            candidateProfile: user.candidateProfile,
            interviewerProfile: user.interviewerProfile,
            createdAt: user.createdAt
          },
          token
        }
      });
    } catch (error) {
      console.error("Profile completion error:", error);
      return res.status(500).json({
        success: false,
        message: "Profile completion failed",
        error: error.message
      });
    }
  };
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          gender: user.gender,
          profilePicture: user.profilePicture,
          candidateProfile: user.candidateProfile,
          interviewerProfile: user.interviewerProfile
        },
        token
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
}

export const userLogout = async (req, res) => {
  try {
    // In JWT-based authentication, server-side logout is typically 
    // just returning a success message as token invalidation 
    // is handled client-side
    
    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
    
    // If you're using cookies or sessions instead of just JWT:
    // res.clearCookie("token");
    // req.session.destroy();
    
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
}