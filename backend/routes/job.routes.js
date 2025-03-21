import {Router} from "express"
import { createJob, getJobBYInterviewer } from "../controllers/job.controller.js";
import { authMiddleware, interviewerMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authMiddleware,interviewerMiddleware)


router.post("/create-job",createJob)
router.get("/get-jobs",getJobBYInterviewer)

export default router;
