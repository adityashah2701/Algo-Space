// routes/interviewerRoutes.js
import express from 'express';
import { 
  getInterviewerProfile,
  updateInterviewerProfile,
  updateExpertise,
  updateCompanyInfo,
  getAvailabilitySchedule,
  updateAvailabilitySchedule,
  blockTimeSlot,
  unblockTimeSlot,
  getPendingInterviews,
  getUpcomingInterviews,
  getPastInterviews,
  getInterviewById,
  approveInterview,
  rejectInterview,
  rescheduleInterview,
  completeInterview,
  submitFeedback,
  searchCandidates,
  getCandidateProfile,
  getCandidateFeedbackHistory,
  sendInterviewMail
} from '../controllers/interviewer.controller.js';
import { authMiddleware ,interviewerMiddleware} from '../middlewares/auth.middleware.js';


const router = express.Router();

// Apply middleware to all interviewer routes
router.use(authMiddleware);
router.use(interviewerMiddleware);

// Profile Management Routes
router.get('/profile', getInterviewerProfile);
router.put('/profile', updateInterviewerProfile);
router.put('/expertise', updateExpertise);
router.put('/company-info', updateCompanyInfo);

// Availability Management Routes
router.get('/availability', getAvailabilitySchedule);
router.put('/availability', updateAvailabilitySchedule);
router.post('/availability/block', blockTimeSlot);
router.post('/availability/unblock', unblockTimeSlot);

// Interview Management Routes
router.get('/interviews/pending', getPendingInterviews);
router.get('/interviews/upcoming', getUpcomingInterviews);
router.get('/interviews/past', getPastInterviews);
router.get('/interviews/:interviewId', getInterviewById);
router.put('/interviews/:interviewId/approve', approveInterview);
router.put('/interviews/:interviewId/reject', rejectInterview);
router.put('/interviews/:interviewId/reschedule', rescheduleInterview);
router.put('/interviews/:interviewId/complete', completeInterview);
router.post('/interviews/:interviewId/feedback', submitFeedback);

// Candidate Evaluation Routes
router.get('/candidates/search', searchCandidates);
router.get('/candidates/:candidateId', getCandidateProfile);
router.get('/candidates/:candidateId/feedback', getCandidateFeedbackHistory);
router.post("/send-interview-mail",sendInterviewMail)
export default router;