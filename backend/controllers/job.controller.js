import { Job } from "../models/job.model.js";

export const createJob = async (req, res) => {
  try {
    const { companyName,  jobs } = req.body;
    const interviewerId = req.interviewer._id;
    if (!companyName)
      return res.status(400).json({ message: "Company name is required" });
    if (!interviewerId)
      return res.status(400).json({ message: "Interviewer is required" });
    if (!jobs || jobs.length === 0)
      return res.status(400).json({ message: "Job details are required" });

    const job = await Job.create({
      companyName,
      interviewer: interviewerId,
      jobs,
    });
    return res.status(201).json({ job });
  } catch (error) {
    console.error("Error in creating job:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getJobBYInterviewer = async (req, res) => {
  try {
    const jobs = await Job.find({ interviewer: req.interviewer._id }).populate({
        path: 'interviewer',
        model: 'User'
      })
      .populate({
        path: 'candidateApplied.candidateId',
        model: 'User'
      })
      ;
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error in fetching job:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
export const getAllJobs = async (req, res) => {
    try {
      // Get page for pagination metadata
      const page = parseInt(req.query.page) || 1;
      
      // Fetch all jobs with populated references
      const jobs = await Job.find()
        .populate({
          path: 'interviewer',
          model: 'User'
        })
        .populate({
          path: 'candidateApplied.candidateId',
          model: 'User'
        });
      
      // Get total count for pagination info
      const totalJobs = jobs.length;
      
      return res.status(200).json({
        jobs,
        pagination: {
          total: totalJobs,
          page,
          pages: 1 // Since we're returning all jobs, there's only one page
        }
      });
    } catch (error) {
      console.error("Error in fetching all jobs:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }


