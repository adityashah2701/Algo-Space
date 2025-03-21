import User from '../models/userModel.js';
import Interview from '../models/interviewModel.js';
import { uploadToCloud, deleteFromCloud } from '../utils/cloudStorage.js'; // Assuming cloud storage for resume

export const getCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getCandidateProfile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update candidate profile information
 * @route PUT /api/candidate/profile
 * @access Private (Candidate only)
 */
export const updateCandidateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, gender, experience } = req.body;
    
    // Validate inputs
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender value' });
    }
    
    if (experience && (isNaN(experience) || experience < 0)) {
      return res.status(400).json({ message: 'Experience must be a positive number' });
    }
    
    const updateData = {
      firstName,
      lastName,
      gender,
      'candidateProfile.experience': experience
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateCandidateProfile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Upload resume
 * @route POST /api/candidate/resume
 * @access Private (Candidate only)
 */
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if resume file exists in request
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    
    const resumeFile = req.files.resume;
    
    // Upload to cloud storage
    const resumeUrl = await uploadToCloud(resumeFile, 'resumes', userId);
    
    // Update user profile with resume URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'candidateProfile.resumeUrl': resumeUrl } },
      { new: true }
    ).select('-password');
    
    return res.status(200).json({ 
      message: 'Resume uploaded successfully',
      resumeUrl,
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in uploadResume:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete resume
 * @route DELETE /api/candidate/resume
 * @access Private (Candidate only)
 */
export const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the current user to find the resume URL
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const resumeUrl = user.candidateProfile?.resumeUrl;
    
    if (!resumeUrl) {
      return res.status(404).json({ message: 'No resume found to delete' });
    }
    
    // Delete from cloud storage
    await deleteFromCloud(resumeUrl);
    
    // Update user profile to remove resume URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'candidateProfile.resumeUrl': null } },
      { new: true }
    ).select('-password');
    
    return res.status(200).json({ 
      message: 'Resume deleted successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error in deleteResume:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update candidate skills
 * @route PUT /api/candidate/skills
 * @access Private (Candidate only)
 */
export const updateSkills = async (req, res) => {
  try {
    const userId = req.user.id;
    const { skills } = req.body;
    
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be provided as an array' });
    }
    
    // Validate skills against allowed enum values
    const allowedSkills = ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"];
    const invalidSkills = skills.filter(skill => !allowedSkills.includes(skill));
    
    if (invalidSkills.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid skills provided', 
        invalidSkills 
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'candidateProfile.skills': skills } },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateSkills:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update preferred roles
 * @route PUT /api/candidate/preferred-roles
 * @access Private (Candidate only)
 */
export const updatePreferredRoles = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferredRoles } = req.body;
    
    if (!preferredRoles || !Array.isArray(preferredRoles)) {
      return res.status(400).json({ message: 'Preferred roles must be provided as an array' });
    }
    
    // Validate roles against allowed enum values
    const allowedRoles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist"];
    const invalidRoles = preferredRoles.filter(role => !allowedRoles.includes(role));
    
    if (invalidRoles.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid roles provided', 
        invalidRoles 
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'candidateProfile.preferredRoles': preferredRoles } },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updatePreferredRoles:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update coding profiles
 * @route PUT /api/candidate/coding-profiles
 * @access Private (Candidate only)
 */
export const updateCodingProfiles = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      githubUsername,
      leetcodeUsername,
      codeforcesUsername,
      codechefUsername
    } = req.body;
    
    const updateData = {
      'candidateProfile.githubUsername': githubUsername,
      'candidateProfile.leetcodeUsername': leetcodeUsername,
      'candidateProfile.codeforcesUsername': codeforcesUsername,
      'candidateProfile.codechefUsername': codechefUsername
    };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateCodingProfiles:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get available interviewers
 * @route GET /api/candidate/interviewers
 * @access Private (Candidate only)
 */
export const getAvailableInterviewers = async (req, res) => {
  try {
    // Optional filter by expertise
    const { expertise } = req.query;
    
    let filter = { role: 'interviewer' };
    
    if (expertise) {
      filter = {
        ...filter,
        'interviewerProfile.expertise': expertise
      };
    }
    
    const interviewers = await User.find(filter)
      .select('firstName lastName interviewerProfile.expertise interviewerProfile.company interviewerProfile.position interviewerProfile.availabilitySchedule')
      .lean();
    
    return res.status(200).json(interviewers);
  } catch (error) {
    console.error('Error in getAvailableInterviewers:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Request an interview
 * @route POST /api/candidate/request-interview
 * @access Private (Candidate only)
 */
export const requestInterview = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { interviewerId, preferredDate, preferredTime, topics } = req.body;
    
    if (!interviewerId || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'Interviewer, date and time are required' });
    }
    
    // Validate that the interviewer exists and has the role 'interviewer'
    const interviewer = await User.findOne({ 
      _id: interviewerId,
      role: 'interviewer'
    });
    
    if (!interviewer) {
      return res.status(404).json({ message: 'Interviewer not found' });
    }
    
    // Create new interview request
    const newInterview = new Interview({
      candidate: candidateId,
      interviewer: interviewerId,
      preferredDate,
      preferredTime,
      topics: topics || [],
      status: 'pending' // Default status
    });
    
    await newInterview.save();
    
    return res.status(201).json({ 
      message: 'Interview request created successfully',
      interview: newInterview
    });
  } catch (error) {
    console.error('Error in requestInterview:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all interviews for candidate
 * @route GET /api/candidate/interviews
 * @access Private (Candidate only)
 */
export const getCandidateInterviews = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { status } = req.query;
    
    let filter = { candidate: candidateId };
    
    if (status) {
      filter.status = status;
    }
    
    const interviews = await Interview.find(filter)
      .populate('interviewer', 'firstName lastName interviewerProfile.company interviewerProfile.position')
      .sort({ createdAt: -1 });
    
    return res.status(200).json(interviews);
  } catch (error) {
    console.error('Error in getCandidateInterviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Cancel an interview request
 * @route DELETE /api/candidate/interviews/:interviewId
 * @access Private (Candidate only)
 */
export const cancelInterviewRequest = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const { interviewId } = req.params;
    
    // Find the interview and make sure it belongs to this candidate
    const interview = await Interview.findOne({
      _id: interviewId,
      candidate: candidateId
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Only allow cancellation if the interview is still pending or scheduled
    if (!['pending', 'scheduled'].includes(interview.status)) {
      return res.status(400).json({ 
        message: `Cannot cancel interview with status: ${interview.status}` 
      });
    }
    
    // Update the interview status to cancelled
    interview.status = 'cancelled';
    interview.cancellationReason = 'Cancelled by candidate';
    interview.updatedAt = Date.now();
    
    await interview.save();
    
    return res.status(200).json({ 
      message: 'Interview cancelled successfully',
      interview
    });
  } catch (error) {
    console.error('Error in cancelInterviewRequest:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};