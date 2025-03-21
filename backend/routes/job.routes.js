import {Router} from "express"
import {createJob, getAllJobs, getJobBYInterviewer } from "../controllers/job.controller.js";
import { authMiddleware, interviewerMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();



router.post("/create-job",authMiddleware,interviewerMiddleware,createJob)
router.get("/get-jobs",authMiddleware,interviewerMiddleware,getJobBYInterviewer)
router.get("/get-all-jobs",authMiddleware ,getAllJobs)


export default router;
