import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Building, Briefcase, AlertCircle } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const JobPostingPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    jobs: [{ title: '' }]
  });
  const navigate = useNavigate()
  const [validationError, setValidationError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        const sampleData = {
          companyName: "Google INC",
          jobs: [
            { title: "Programmer" },
            { title: "Software Developer" }
          ]
        };
        setFormData(sampleData);
      }, 500);
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleJobTitleChange = (index, value) => {
    const updatedJobs = [...formData.jobs];
    updatedJobs[index] = { ...updatedJobs[index], title: value };
    
    setFormData(prev => ({
      ...prev,
      jobs: updatedJobs
    }));
  };

  const addJobTitle = () => {
    setFormData(prev => ({
      ...prev,
      jobs: [...prev.jobs, { title: '' }]
    }));
  };

  const removeJobTitle = (index) => {
    if (formData.jobs.length <= 1) {
      setValidationError('At least one job title is required');
      return;
    }

    const updatedJobs = [...formData.jobs];
    updatedJobs.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      jobs: updatedJobs
    }));
    
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.companyName.trim()) {
      setValidationError('Company name is required');
      return;
    }

    if (formData.jobs.some(job => !job.title.trim())) {
      setValidationError('All job titles must be filled');
      return;
    }

    setValidationError('');
    setLoading(true);

    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log the data that would be sent to the server
      console.log('Submitting data:', formData);

      const res = await axiosInstance.post("/job/create-job", {
        ...formData,
        interviewerId: user._id
      });

      if (res.data) {
        console.log("Job Posting created successfully");
        navigate('/interviewer-dashboard');
        // In a real app, you would redirect or show success UI
      }

      // In a real app, you would redirect or show success UI
    } catch (error) {
      setValidationError('Failed to update job postings. Please try again.');
      console.error('Error submitting job posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold ">Company Job Postings</h1>
          <p className="mt-2 text-slate-600">Manage your company's job listings for interviews</p>
        </div>

        {validationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-slate-700" />
                Company Details
              </CardTitle>
              <CardDescription>
                Update your company information and job listings
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                  className="w-full"
                  required
                />
              </div>

              <Separator className="my-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-slate-700" />
                    Job Postings
                  </Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addJobTitle}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add Job
                  </Button>
                </div>
                
                <div className="space-y-3 mt-2">
                  {formData.jobs.map((job, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="h-8 px-3 text-center flex items-center justify-center">
                        {index + 1}
                      </Badge>
                      <Input
                        value={job.title}
                        onChange={(e) => handleJobTitleChange(index, e.target.value)}
                        placeholder="Job Title"
                        className="flex-1"
                        required
                      />
                      <Button 
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeJobTitle(index)}
                        className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
                className="px-6"
              >
                {loading ? "Saving..." : "Save Job Postings"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default JobPostingPage;