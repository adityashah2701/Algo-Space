// routes/candidateRoutes.js
import express from 'express';
import { 
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
  deleteResume,
  updateSkills,
  updatePreferredRoles,
  updateCodingProfiles,
  getAvailableInterviewers,
  requestInterview,
  getCandidateInterviews,
  cancelInterviewRequest,
} from '../controllers/candidate.controller.js';
import { authMiddleware, candidateMiddleware } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';




const router = express.Router();

// Apply middleware to all candidate routes
router.use(authMiddleware);
router.use(candidateMiddleware);

// Profile routes
router.get('/profile', getCandidateProfile);
router.put('/profile', updateCandidateProfile);

// Resume routes
router.post('/resume', upload.single('resume'), uploadResume);
router.delete('/resume', deleteResume);

// Skills and roles routes
router.put('/skills', updateSkills);
router.put('/preferred-roles', updatePreferredRoles);

// Coding profiles routes
router.put('/coding-profiles', updateCodingProfiles);

// Interview routes
router.get('/interviewers', getAvailableInterviewers);
router.post('/request-interview', requestInterview);
router.get('/interviews', getCandidateInterviews);
router.delete('/interviews/:interviewId', cancelInterviewRequest);

export default router;