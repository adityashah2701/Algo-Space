// controllers/interviewerController.js
import User from '../models/userModel.js';
import Interview from '../models/interviewModel.js';
import mongoose from 'mongoose';
import { sendMail } from '../utils/sendMail.js';
const { ObjectId } = mongoose.Types;

export const getInterviewerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in getInterviewerProfile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateInterviewerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, gender, profilePicture } = req.body;
    
    // Validate inputs
    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ message: 'Invalid gender value' });
    }
    
    const updateData = { firstName, lastName, gender, profilePicture };
    
    // Remove undefined fields
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateInterviewerProfile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateExpertise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { expertise } = req.body;
    
    if (!expertise || !Array.isArray(expertise)) {
      return res.status(400).json({ message: 'Expertise must be provided as an array' });
    }
    
    // Validate expertise against allowed enum values
    const allowedExpertise = ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"];
    const invalidExpertise = expertise.filter(skill => !allowedExpertise.includes(skill));
    
    if (invalidExpertise.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid expertise areas provided', 
        invalidExpertise 
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'interviewerProfile.expertise': expertise } },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateExpertise:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const updateCompanyInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { company, position } = req.body;
    
    if (!company && !position) {
      return res.status(400).json({ message: 'At least one field (company or position) must be provided' });
    }
    
    const updateData = {};
    if (company) updateData['interviewerProfile.company'] = company;
    if (position) updateData['interviewerProfile.position'] = position;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateCompanyInfo:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Availability Management Controllers
// ==============================

export const getAvailabilitySchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('interviewerProfile.availabilitySchedule');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json(user.interviewerProfile?.availabilitySchedule || []);
  } catch (error) {
    console.error('Error in getAvailabilitySchedule:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const updateAvailabilitySchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { availabilitySchedule } = req.body;
    
    if (!availabilitySchedule || !Array.isArray(availabilitySchedule)) {
      return res.status(400).json({ message: 'Availability schedule must be provided as an array' });
    }
    
    // Validate schedule format
    for (const slot of availabilitySchedule) {
      if (!slot.day || !slot.startTime || !slot.endTime) {
        return res.status(400).json({ 
          message: 'Each availability slot must include day, startTime, and endTime',
          invalidSlot: slot
        });
      }
      
      // Validate day
      const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      if (!validDays.includes(slot.day)) {
        return res.status(400).json({
          message: 'Invalid day in availability slot',
          invalidDay: slot.day,
          validDays
        });
      }
      
      // Validate time format (HH:MM)
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return res.status(400).json({
          message: 'Time must be in 24-hour format (HH:MM)',
          invalidSlot: slot
        });
      }
      
      // Validate that end time is after start time
      if (slot.startTime >= slot.endTime) {
        return res.status(400).json({
          message: 'End time must be after start time',
          invalidSlot: slot
        });
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { 'interviewerProfile.availabilitySchedule': availabilitySchedule } },
      { new: true, runValidators: true }
    ).select('-password');
    
    return res.status(200).json(updatedUser.interviewerProfile.availabilitySchedule);
  } catch (error) {
    console.error('Error in updateAvailabilitySchedule:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const blockTimeSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, startTime, endTime, reason } = req.body;
    
    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, start time, and end time are required' });
    }
    
    // Validate date format
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
    }
    
    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({ message: 'Time must be in 24-hour format (HH:MM)' });
    }
    
    // Validate that end time is after start time
    if (startTime >= endTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }
    
    // Create a new blocked time slot
    // This would typically be stored in a separate collection for blocked time slots
    // For this example, we'll add it to the user document
    const blockedSlot = {
      date: dateObj,
      startTime,
      endTime,
      reason: reason || 'Not available',
      _id: new mongoose.Types.ObjectId()
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { 'interviewerProfile.blockedTimeSlots': blockedSlot } },
      { new: true }
    ).select('-password');
    
    return res.status(201).json({
      message: 'Time slot blocked successfully',
      blockedSlot
    });
  } catch (error) {
    console.error('Error in blockTimeSlot:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const unblockTimeSlot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { blockedSlotId } = req.body;
    
    if (!blockedSlotId) {
      return res.status(400).json({ message: 'Blocked slot ID is required' });
    }
    
    // Remove the blocked time slot
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { 'interviewerProfile.blockedTimeSlots': { _id: blockedSlotId } } },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      message: 'Time slot unblocked successfully'
    });
  } catch (error) {
    console.error('Error in unblockTimeSlot:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Interview Management Controllers
// ==============================


export const getPendingInterviews = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    
    const pendingInterviews = await Interview.find({
      interviewer: interviewerId,
      status: 'pending'
    }).populate('candidate', 'firstName lastName email candidateProfile.skills candidateProfile.experience');
    
    return res.status(200).json(pendingInterviews);
  } catch (error) {
    console.error('Error in getPendingInterviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUpcomingInterviews = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    
    const upcomingInterviews = await Interview.find({
      interviewer: interviewerId,
      status: 'scheduled',
      confirmedDate: { $gte: new Date() }
    }).populate('candidate', 'firstName lastName email candidateProfile.skills candidateProfile.experience')
      .sort({ confirmedDate: 1, confirmedTime: 1 });
    
    return res.status(200).json(upcomingInterviews);
  } catch (error) {
    console.error('Error in getUpcomingInterviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPastInterviews = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    
    const pastInterviews = await Interview.find({
      interviewer: interviewerId,
      $or: [
        { status: 'completed' },
        { 
          status: 'scheduled',
          confirmedDate: { $lt: new Date() }
        }
      ]
    }).populate('candidate', 'firstName lastName email candidateProfile.skills candidateProfile.experience')
      .sort({ confirmedDate: -1, confirmedTime: -1 });
    
    return res.status(200).json(pastInterviews);
  } catch (error) {
    console.error('Error in getPastInterviews:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const { interviewId } = req.params;
    
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: interviewerId
    }).populate('candidate', 'firstName lastName email gender candidateProfile');
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    return res.status(200).json(interview);
  } catch (error) {
    console.error('Error in getInterviewById:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const approveInterview = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const { interviewId } = req.params;
    const { confirmedDate, confirmedTime, meetingLink } = req.body;
    
    if (!confirmedDate || !confirmedTime) {
      return res.status(400).json({ message: 'Confirmed date and time are required' });
    }
    
    // Validate date
    const dateObj = new Date(confirmedDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Validate time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(confirmedTime)) {
      return res.status(400).json({ message: 'Time must be in 24-hour format (HH:MM)' });
    }
    
    // Find and update the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: interviewerId,
      status: 'pending'
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Pending interview not found' });
    }
    
    interview.status = 'scheduled';
    interview.confirmedDate = dateObj;
    interview.confirmedTime = confirmedTime;
    interview.meetingLink = meetingLink;
    interview.updatedAt = new Date();
    
    await interview.save();
    
    return res.status(200).json({
      message: 'Interview request approved successfully',
      interview
    });
  } catch (error) {
    console.error('Error in approveInterview:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const rejectInterview = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const { interviewId } = req.params;
    const { reason } = req.body;
    
    // Find and update the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: interviewerId,
      status: 'pending'
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Pending interview not found' });
    }
    
    interview.status = 'rejected';
    interview.cancellationReason = reason || 'Rejected by interviewer';
    interview.updatedAt = new Date();
    
    await interview.save();
    
    return res.status(200).json({
      message: 'Interview request rejected successfully',
      interview
    });
  } catch (error) {
    console.error('Error in rejectInterview:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const rescheduleInterview = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const { interviewId } = req.params;
    const { confirmedDate, confirmedTime, reason } = req.body;
    
    if (!confirmedDate || !confirmedTime) {
      return res.status(400).json({ message: 'New date and time are required' });
    }
    
    // Validate date
    const dateObj = new Date(confirmedDate);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    
    // Validate time
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(confirmedTime)) {
      return res.status(400).json({ message: 'Time must be in 24-hour format (HH:MM)' });
    }
    
    // Find and update the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: interviewerId,
      status: 'scheduled'
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Scheduled interview not found' });
    }
    
    // Save the old date for response
    const oldDate = interview.confirmedDate;
    const oldTime = interview.confirmedTime;
    
    // Update with new schedule
    interview.confirmedDate = dateObj;
    interview.confirmedTime = confirmedTime;
    interview.rescheduledReason = reason || 'Rescheduled by interviewer';
    interview.updatedAt = new Date();
    
    await interview.save();
    
    return res.status(200).json({
      message: 'Interview rescheduled successfully',
      interview,
      previousSchedule: {
        date: oldDate,
        time: oldTime
      }
    });
  } catch (error) {
    console.error('Error in rescheduleInterview:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const completeInterview = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const { interviewId } = req.params;
    
    // Find and update the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: interviewerId,
      status: 'scheduled'
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Scheduled interview not found' });
    }
    
    interview.status = 'completed';
    interview.updatedAt = new Date();
    
    await interview.save();
    
    return res.status(200).json({
      message: 'Interview marked as completed successfully',
      interview
    });
  } catch (error) {
    console.error('Error in completeInterview:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const submitFeedback = async (req, res) => {
  try {
    const interviewerId = req.user.id;
    const { interviewId } = req.params;
    const { rating, strengths, areasToImprove, notes, recommendationLevel } = req.body;
    
    if (!rating || !recommendationLevel) {
      return res.status(400).json({ message: 'Rating and recommendation level are required' });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }
    
    // Validate recommendation level
    const validRecommendations = ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'];
    if (!validRecommendations.includes(recommendationLevel)) {
      return res.status(400).json({ 
        message: 'Invalid recommendation level',
        validOptions: validRecommendations
      });
    }
    
    // Find the interview
    const interview = await Interview.findOne({
      _id: interviewId,
      interviewer: interviewerId,
      status: { $in: ['completed', 'scheduled'] }
    });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found or cannot submit feedback for this interview' });
    }
    
    // Update the interview with feedback
    interview.feedback = {
      rating,
      strengths: strengths || [],
      areasToImprove: areasToImprove || [],
      notes: notes || '',
      recommendationLevel
    };
    
    // If interview was still in scheduled status, mark it as completed
    if (interview.status === 'scheduled') {
      interview.status = 'completed';
    }
    
    interview.updatedAt = new Date();
    
    await interview.save();
    
    return res.status(200).json({
      message: 'Feedback submitted successfully',
      interview
    });
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// ==============================
// Candidate Evaluation Controllers
// ==============================

export const searchCandidates = async (req, res) => {
  try {
    const { skills, minExperience, maxExperience, preferredRole } = req.query;
    
    // Build filter object
    let filter = { role: 'candidate' };
    
    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',');
      filter['candidateProfile.skills'] = { $in: skillsArray };
    }
    
    // Filter by experience range
    if (minExperience !== undefined || maxExperience !== undefined) {
      filter['candidateProfile.experience'] = {};
      
      if (minExperience !== undefined) {
        filter['candidateProfile.experience'].$gte = parseInt(minExperience);
      }
      
      if (maxExperience !== undefined) {
        filter['candidateProfile.experience'].$lte = parseInt(maxExperience);
      }
    }
    
    // Filter by preferred role
    if (preferredRole) {
      filter['candidateProfile.preferredRoles'] = preferredRole;
    }
    
    // Find candidates matching the criteria
    const candidates = await User.find(filter)
      .select('firstName lastName email gender candidateProfile.skills candidateProfile.experience candidateProfile.preferredRoles')
      .lean();
    
    return res.status(200).json(candidates);
  } catch (error) {
    console.error('Error in searchCandidates:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getCandidateProfile = async (req, res) => {
  try {
    const { candidateId } = req.params;
    
    const candidate = await User.findOne({
      _id: candidateId,
      role: 'candidate'
    }).select('-password');
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    return res.status(200).json(candidate);
  } catch (error) {
    console.error('Error in getCandidateProfile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getCandidateFeedbackHistory = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const interviewerId = req.user.id;
    
    // First check if the candidate exists
    const candidateExists = await User.exists({
      _id: candidateId,
      role: 'candidate'
    });
    
    if (!candidateExists) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    
    // Find all completed interviews for this candidate with feedback
    const interviews = await Interview.find({
      candidate: candidateId,
      status: 'completed',
      'feedback.rating': { $exists: true }
    }).select('feedback interviewer confirmedDate topics')
      .populate('interviewer', 'firstName lastName interviewerProfile.company interviewerProfile.position')
      .sort({ confirmedDate: -1 });
    
    // Determine if the current interviewer can see detailed feedback
    const feedbackHistory = interviews.map(interview => {
      const isCurrentInterviewer = interview.interviewer._id.toString() === interviewerId;
      
      return {
        interviewDate: interview.confirmedDate,
        interviewer: {
          _id: interview.interviewer._id,
          name: `${interview.interviewer.firstName} ${interview.interviewer.lastName}`,
          company: interview.interviewer.interviewerProfile.company,
          position: interview.interviewer.interviewerProfile.position
        },
        topics: interview.topics,
        feedback: isCurrentInterviewer ? interview.feedback : {
          // Only show rating and recommendation level for other interviewers' feedback
          rating: interview.feedback.rating,
          recommendationLevel: interview.feedback.recommendationLevel
        }
      };
    });
    
    return res.status(200).json(feedbackHistory);
  } catch (error) {
    console.error('Error in getCandidateFeedbackHistory:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
export const sendInterviewMail = async (req,res) => {
  try {
    const {candidateEmail , code,text} = req.body;

    const info = await sendMail({
      to: candidateEmail,
      subject: `Your Interview Code is ${code}`,
      text: `${text}`
    })

    return res.status(200).json(info)
    
  } catch (error) {
    console.error('Error in sendInterviewMail:', error);
    return res.status(500).json({ message: 'Server error' });
    
  }
}
export default {
  // Profile Management
  getInterviewerProfile,
  updateInterviewerProfile,
  updateExpertise,
  updateCompanyInfo,
  
  // Availability Management
  getAvailabilitySchedule,
  updateAvailabilitySchedule,
  blockTimeSlot,
  unblockTimeSlot,
  
  // Interview Management
  getPendingInterviews,
  getUpcomingInterviews,
  getPastInterviews,
  getInterviewById,
  approveInterview,
  rejectInterview,
  rescheduleInterview,
  completeInterview,
  submitFeedback,
  
  // Candidate Evaluation
  searchCandidates,
  getCandidateProfile,
  getCandidateFeedbackHistory
};