// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';


export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }
    
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.status(401).json({ message: 'Token verification failed, access denied' });
    }
    
    // Add user from payload
    req.user = verified;
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// middleware/roleMiddleware.js
export const candidateMiddleware = async (req, res, next) => {
  try {
    // Get user role
    const user = await User.findById(req.user.id);
    req.candidate = user ;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'candidate') {
      return res.status(403).json({ message: 'Access denied. Candidate role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Error in candidateMiddleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const interviewerMiddleware = async (req, res, next) => {
  try {
    // Get user role
    const user = await User.findById(req.user.id);
    req.interviewer = user ;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'interviewer') {
      return res.status(403).json({ message: 'Access denied. Interviewer role required.' });
    }
    
    next();
  } catch (error) {
    console.error('Error in interviewerMiddleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};