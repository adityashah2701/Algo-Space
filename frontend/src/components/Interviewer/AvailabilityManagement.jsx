import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Briefcase,
  Building,
  Calendar,
  RefreshCw,
  AlertCircle,
  Eye,
  Mail,
  User,
  Users,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

const InterviewerJobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddJobDialogOpen, setIsAddJobDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  // New job form data
  const [newJob, setNewJob] = useState({
    companyName: '',
    jobs: [{ title: '' }]
  });

  // Get interviewer ID from localStorage
  const getInterviewerId = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user._id;
      }
      return null;
    } catch (error) {
      console.error('Error getting interviewer ID:', error);
      return null;
    }
  };

  // Fetch jobs for the interviewer
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const interviewerId = getInterviewerId();
      if (!interviewerId) {
        throw new Error('Interviewer ID not found');
      }

      const response = await axiosInstance.get(`http://localhost:3000/api/job/get-jobs`);
      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs. Please try again.');
      toast.error("Failed to load interviewer jobs");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = jobs.filter(
        job => job.companyName.toLowerCase().includes(lowercasedSearch) ||
               job.jobs.some(position => position.title.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm]);

  // Handle adding a new job
  const handleAddJob = async () => {
    try {
      setLoading(true);
      
      const interviewerId = getInterviewerId();
      if (!interviewerId) {
        throw new Error('Interviewer ID not found');
      }

      // Validate form data
      if (!newJob.companyName.trim()) {
        toast.error("Company name is required");
        return;
      }

      if (newJob.jobs.some(job => !job.title.trim())) {
        toast.error("All job titles are required");
        return;
      }

      // Prepare data for API
      const jobData = {
        interviewerId,
        companyName: newJob.companyName,
        jobs: newJob.jobs.map(job => ({ title: job.title })),
      };

      // Make API call
      await axiosInstance.post('http://localhost:3000/api/job/create', jobData);
      
      // Reset form and fetch updated jobs
      setNewJob({
        companyName: '',
        jobs: [{ title: '' }]
      });
      
      setIsAddJobDialogOpen(false);
      fetchJobs();
      
      toast.success("Job added successfully");
    } catch (err) {
      console.error('Error adding job:', err);
      toast.error("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a job
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      setLoading(true);
      await axiosInstance.delete(`http://localhost:3000/api/job/delete/${jobToDelete._id}`);
      
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
      fetchJobs();
      
      toast.success("Job deleted successfully");
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error("Failed to delete job");
    } finally {
      setLoading(false);
    }
  };

  // Add job position field
  const addJobPosition = () => {
    setNewJob({
      ...newJob,
      jobs: [...newJob.jobs, { title: '' }]
    });
  };

  // Remove job position field
  const removeJobPosition = (index) => {
    if (newJob.jobs.length <= 1) {
      toast.error("At least one job position is required");
      return;
    }

    const updatedJobs = [...newJob.jobs];
    updatedJobs.splice(index, 1);
    
    setNewJob({
      ...newJob,
      jobs: updatedJobs
    });
  };

  // Handle job position title change
  const handleJobTitleChange = (index, value) => {
    const updatedJobs = [...newJob.jobs];
    updatedJobs[index] = { ...updatedJobs[index], title: value };
    
    setNewJob({
      ...newJob,
      jobs: updatedJobs
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // View job details and candidates
  const viewJobDetails = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Applied</Badge>;
      case 'Invited':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Invited</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Prepare and open invite dialog
  const openInviteDialog = (candidate) => {
    setSelectedCandidate(candidate);
    
    // Generate random interview ID for demonstration
    const interviewId = Math.random().toString(36).substring(2, 10).toUpperCase();
    
    // Create email template with candidate name, job details, and interview ID
    const emailTemplate = `Dear ${candidate.candidateId.firstName},

We are pleased to invite you to an interview for the ${selectedJob.jobs[0].title} position at ${selectedJob.companyName}.

Interview Details:
- Interview ID: ${interviewId}
- Please use this ID to join the interview session on our platform.
- You can access the interview by visiting https://example.com/interview/${interviewId}

Please confirm your availability by replying to this email.

Best regards,
The Recruitment Team
${selectedJob.companyName}`;

    setEmailContent(emailTemplate);
    setIsInviteDialogOpen(true);
  };

  // Send interview invitation email
  const sendInvitationEmail = async () => {
    if (!selectedCandidate || !emailContent.trim()) return;
    
    try {
      setInviteLoading(true);
      
      // Create email data
      const emailData = {
        to: selectedCandidate.candidateId.email,
        subject: `Interview Invitation: ${selectedJob.companyName} - ${selectedJob.jobs[0].title}`,
        text: emailContent,
        candidateId: selectedCandidate.candidateId._id,
        jobId: selectedJob._id
      };
      
      // API call to send email and update status
      // In a real app, uncomment the below line and implement the API endpoint
      // await axiosInstance.post('http://localhost:3000/api/job/send-invitation', emailData);
      
      // Mock success for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success notification
      toast.success(`Email sent to ${selectedCandidate.candidateId.email} successfully`);
      
      // Close dialog
      setIsInviteDialogOpen(false);
    } catch (err) {
      console.error('Error sending invitation:', err);
      toast.error("Failed to send invitation email");
    } finally {
      setInviteLoading(false);
    }
  };

  // Render loading state
  if (loading && jobs.length === 0) {
    return (
      <div className="w-full p-8 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !loading && jobs.length === 0) {
    return (
      <div className="w-full p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-red-700">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={fetchJobs}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Your Job Postings</h2>
        
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="w-full min-w-[200px] pl-8 sm:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isAddJobDialogOpen} onOpenChange={setIsAddJobDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Add New Job</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Job Posting</DialogTitle>
                <DialogDescription>
                  Create a new job posting for company positions.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="companyName" className="text-sm font-medium">
                    Company Name
                  </label>
                  <Input
                    id="companyName"
                    placeholder="Enter company name"
                    value={newJob.companyName}
                    onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Job Positions</label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={addJobPosition}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Position</span>
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {newJob.jobs.map((job, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Job title"
                          value={job.title}
                          onChange={(e) => handleJobTitleChange(index, e.target.value)}
                          className="flex-1"
                        />
                        {newJob.jobs.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeJobPosition(index)}
                            className="h-10 w-10 shrink-0 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddJobDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddJob} 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Job'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Confirmation dialog for delete */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job posting for {jobToDelete?.companyName}? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteJob}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Job Details Sheet */}
      <Sheet open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          {selectedJob && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {selectedJob.companyName}
                </SheetTitle>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedJob.jobs.map((position, idx) => (
                      <Badge key={position._id || idx} variant="secondary">
                        {position.title}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs flex items-center gap-1 mt-1 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Posted on {formatDate(selectedJob.createdAt)}</span>
                  </div>
                </div>
              </SheetHeader>
              
              <div className="mt-6">
                <Tabs defaultValue="candidates">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="candidates" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Candidates ({selectedJob.candidateApplied?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="details" className="flex-1">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Job Details
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="candidates" className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">Applications</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Clock className="h-3 w-3 mr-1" />
                          Applied: {selectedJob.candidateApplied?.filter(c => c.status === 'Applied').length || 0}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Invited: {selectedJob.candidateApplied?.filter(c => c.status === 'Invited').length || 0}
                        </Badge>
                      </div>
                    </div>
                    
                    {!selectedJob.candidateApplied?.length ? (
                      <div className="text-center py-8">
                        <User className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                        <p className="mt-2 text-sm text-muted-foreground">No candidates have applied yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {selectedJob.candidateApplied.map(candidate => (
                          <Card key={candidate.candidateId._id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>{getInitials(candidate.candidateId.firstName, candidate.candidateId.lastName)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h4 className="font-medium">{candidate.candidateId.firstName} {candidate.candidateId.lastName}</h4>
                                      <p className="text-sm text-muted-foreground">{candidate.candidateId.email}</p>
                                    </div>
                                    <div className="mt-1 sm:mt-0">
                                      {getStatusBadge(candidate.status)}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {candidate.candidateId.candidateProfile?.skills?.map((skill, idx) => (
                                      <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {candidate.candidateId.candidateProfile?.experience && (
                                      <Badge variant="outline" className="bg-slate-50">
                                        {candidate.candidateId.candidateProfile.experience} {candidate.candidateId.candidateProfile.experience === 1 ? 'year' : 'years'} exp
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                    <div className="text-xs text-muted-foreground">
                                      Applied {formatDate(candidate.appliedAt)}
                                    </div>
                                    <div className="flex gap-2">
                                      {candidate.candidateId.candidateProfile?.resumeUrl && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="h-8"
                                          asChild
                                        >
                                          <a href={candidate.candidateId.candidateProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                                            View Resume
                                          </a>
                                        </Button>
                                      )}
                                      <Button 
                                        size="sm" 
                                        className="h-8"
                                        onClick={() => openInviteDialog(candidate)}
                                        disabled={candidate.status === 'Invited'}
                                      >
                                        <Mail className="h-3.5 w-3.5 mr-1" />
                                        {candidate.status === 'Invited' ? 'Invited' : 'Send Invite'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Company</h3>
                        <p className="text-sm">{selectedJob.companyName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Positions</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedJob.jobs.map((position, idx) => (
                            <li key={position._id || idx} className="text-sm">
                              {position.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Date Posted</h3>
                        <p className="text-sm">{formatDate(selectedJob.createdAt)}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <SheetFooter className="mt-6">
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Send Invitation Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Send Interview Invitation</DialogTitle>
            <DialogDescription>
              Send an email invitation with the interview details to the candidate.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label className="text-sm">To:</Label>
              <div className="col-span-3">
                <Input 
                  value={selectedCandidate?.candidateId?.email || ''} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label className="text-sm">Subject:</Label>
              <div className="col-span-3">
                <Input 
                  value={`Interview Invitation: ${selectedJob?.companyName || ''} - ${selectedJob?.jobs?.[0]?.title || ''}`} 
                  readOnly 
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label className="text-sm">Message:</Label>
              <Textarea 
                value={emailContent} 
                onChange={(e) => setEmailContent(e.target.value)} 
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={sendInvitationEmail}
              disabled={inviteLoading}
              className="gap-1"
            >
              {inviteLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data table */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <Briefcase className="h-12 w-12 text-muted-foreground opacity-30" />
            <h3 className="mt-4 text-lg font-semibold">No jobs found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              {searchTerm ? 
                `No jobs match your search term "${searchTerm}". Try a different search or clear the filter.` : 
                "You haven't created any job postings yet. Click 'Add New Job' to get started."}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Posted On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell>{job.companyName}</TableCell>
                  <TableCell>
                    {job.jobs.map((pos, idx) => (
                      <Badge key={idx} variant="outline" className="mr-1">
                        {pos.title}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>{job?.candidateApplied?.length || 0}</TableCell>
                  <TableCell>{formatDate(job.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => viewJobDetails(job)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setJobToDelete(job);
                          setIsDeleteDialogOpen(true);
                        }} className="text-destructive">
                           <Trash2 className="h-4 w-4 mr-2" /> Delete Job
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default InterviewerJobsTable;

