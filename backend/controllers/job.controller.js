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
    const jobs = await Job.find({ interviewer: req.interviewer._id });
    return res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error in fetching job:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
