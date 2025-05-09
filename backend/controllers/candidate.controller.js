// controllers/candidateController.js
import User from '../models/userModel.js';
import Interview from '../models/interviewModel.js'; // Assuming you have an Interview model
import { uploadToCloudinary, deleteFromCloudinary, getPublicIdFromUrl } from '../utils/uploadToCloudinary.js';
import { Job } from '../models/job.model.js';


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

export const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if resume file exists in request
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }
    
    const resumeFile = req.files.resume;
    
    // Log file information for debugging
    console.log("Uploaded file info:", {
      name: resumeFile.name,
      size: resumeFile.size,
      mimetype: resumeFile.mimetype
    });
    
    // Create temporary file path from buffer
    const tempFilePath = resumeFile.tempFilePath;
    
    // Set upload options based on file type
    let uploadOptions = {
      folder: 'resumes',
      public_id: `resume_${userId}_${Date.now()}`
    };
    
    // Handle PDFs specifically
    if (resumeFile.mimetype === 'application/pdf') {
      // For PDFs, use raw upload to preserve the file exactly as is
      uploadOptions.resource_type = "raw";
    } else {
      // For other file types (images, etc.), use auto detection
      uploadOptions.resource_type = "auto";
    }
    
    // Upload to Cloudinary with appropriate options
    const resumeUrl = await uploadToCloudinary(tempFilePath, uploadOptions);
    
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
    
    // Extract public_id from resumeUrl and delete from Cloudinary
    const publicId = getPublicIdFromUrl(resumeUrl);
    
    if (publicId) {
      await deleteFromCloudinary(publicId);
    }
    
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
export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const job = await Job.findById(jobId);
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    // Check if job status is closed (add this field to your schema if needed)
    if (job.status === "closed") return res.status(400).json({ message: "Job is closed" });
    
    // Check if candidate has already applied using proper array method
;    const alreadyApplied = job.candidateApplied.some(
      application => application.candidateId.toString() === req.candidate._id.toString()
    )
    
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    
    // Add candidate to applied list
    job.candidateApplied.push({ candidateId: req.candidate._id });
    await job.save();
    
    return res.status(200).json({ message: "Job applied successfully", job });
  } catch (error) {
    console.error("Error in applying to job:", error);
    return res.status(500).json({ message: "Server error" });
  }
}