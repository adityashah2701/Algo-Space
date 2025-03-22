import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  AlertCircle, 
  Copy, 
  Check, 
  FileType2, 
  RefreshCw, 
  Layers,
  CheckCircle,
  BriefcaseBusiness,
  ChevronRight,
  Star,
  StarHalf,
  Filter
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

const OCRScanner = () => {
  // State variables
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  
  const { toast } = useToast();
  
  // List of skills to check for
  const SKILLS = [
    "React", "Node", "MongoDB", "Express", "Python", "Django", "Flask", 
    "Java", "C++", "C", "HTML", "CSS", "JavaScript", "TypeScript", 
    "Redux", "Context API", "REST API", "GraphQL", "SQL", "NoSQL", 
    "Firebase", "AWS", "Docker", "Kubernetes", "CI/CD", "Git", 
    "Agile", "Scrum", "Kanban", "TDD", "BDD", "Jest", "Mocha", 
    "Chai", "Cypress", "React Testing Library", "Jasmine", "Enzyme", 
    "Puppeteer", "Playwright", "Selenium", "WebdriverIO", "JIRA", 
    "Confluence", "Slack", "Trello", "Asana", "Postman", "Insomnia"
  ];

  // Job roles with required skills
  const JOB_ROLES = [
    {
      title: "Frontend Developer",
      match: 0,
      requiredSkills: ["React", "JavaScript", "HTML", "CSS", "TypeScript"],
      preferredSkills: ["Redux", "Jest", "Context API"],
      description: "Build and maintain user interfaces and web applications with a focus on responsive design and performance optimization."
    },
    {
      title: "Backend Developer",
      match: 0,
      requiredSkills: ["Node", "Express", "SQL", "MongoDB", "API"],
      preferredSkills: ["Python", "Django", "Flask", "Java", "Cloud"],
      description: "Develop server-side logic, define and maintain databases, and ensure high performance and responsiveness to front-end requests."
    },
    {
      title: "Full Stack Developer",
      match: 0,
      requiredSkills: ["JavaScript", "React", "Node", "Express", "HTML", "CSS", "Git"],
      preferredSkills: ["TypeScript", "MongoDB", "SQL", "Docker"],
      description: "Handle both client and server-side development, including architecture design and implementation of full-stack applications."
    },
    {
      title: "DevOps Engineer",
      match: 0,
      requiredSkills: ["Docker", "Kubernetes", "CI/CD", "Git", "Cloud"],
      preferredSkills: ["AWS", "Jenkins", "Terraform", "Ansible"],
      description: "Implement and manage CI/CD pipelines, container orchestration, and infrastructure automation to enhance development and deployment processes."
    },
    {
      title: "QA Engineer",
      match: 0,
      requiredSkills: ["Selenium", "Cypress", "Jest", "Testing", "QA"],
      preferredSkills: ["Playwright", "Puppeteer", "API Testing", "BDD", "TDD"],
      description: "Develop and execute test plans, create automated tests, and ensure the quality of software through thorough testing methodologies."
    },
    {
      title: "Data Engineer",
      match: 0,
      requiredSkills: ["Python", "SQL", "ETL", "Database"],
      preferredSkills: ["Spark", "Hadoop", "Kafka", "NoSQL"],
      description: "Design, build, and maintain data pipelines, data warehouses, and data processing systems to support data analytics and business intelligence."
    }
  ];

  // Function to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setError('File is too large. Maximum size is 10MB.');
      setFile(null);
      setFilePreview(null);
      return;
    }

    // Check file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    
    // Some browsers might use different MIME types, so we also check extensions
    const fileName = selectedFile.name.toLowerCase();
    const validExtensions = ['.pdf', '.png', '.jpg', '.jpeg'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!validTypes.includes(selectedFile.type) && !hasValidExtension) {
      setError('Please upload a PDF or image file (PNG, JPG, JPEG).');
      setFile(null);
      setFilePreview(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setDetectedSkills([]);
    setJobRecommendations([]);

    // Create a preview for images
    if (selectedFile.type.startsWith('image/') || fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For PDFs, just show an icon or placeholder
      setFilePreview(null);
    }
  };

  // Process the file with the OCR backend
  const processFile = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedText('');
    setDetectedSkills([]);
    setJobRecommendations([]);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.text) {
        setExtractedText(data.text);
        setActiveTab('results'); // Switch to results tab when processing is complete
        
        // Analyze the extracted text for skills
        analyzeSkills(data.text);
        
        toast({
          title: "Text extracted successfully",
          description: "Your document has been processed.",
        });
      } else {
        throw new Error('No text extracted from the document');
      }
    } catch (err) {
      console.error('OCR Processing Error:', err);
      setError(err.message || 'An error occurred while processing the file.');
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: err.message || "An error occurred while processing the file.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze the extracted text for skills
  const analyzeSkills = async (text) => {
    setIsAnalyzing(true);
    
    try {
      // First, do a simple local check for skills in the text
      const localDetectedSkills = SKILLS.filter(skill => {
        try {
          // Create a regex that matches the skill as a whole word, with special characters escaped
          const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i');
          return regex.test(text);
        } catch (error) {
          console.error(`Error with skill "${skill}":`, error.message);
          // If regex creation fails, try a simple includes check
          return text.toLowerCase().includes(skill.toLowerCase());
        }
      });
      
      // Call the skills API for more advanced analysis
      try {
        const apiResponse = await fetch('http://localhost:5000/api/analyze-skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text,
            skills: SKILLS
          }),
        });
        
        if (!apiResponse.ok) {
          throw new Error(`Skills API responded with status ${apiResponse.status}`);
        }
        
        const skillsData = await apiResponse.json();
        
        // Use the API response if available, otherwise fall back to local detection
        if (skillsData && skillsData.detectedSkills && Array.isArray(skillsData.detectedSkills) && skillsData.detectedSkills.length > 0) {
          setDetectedSkills(skillsData.detectedSkills);
          
          // Generate job recommendations based on detected skills
          generateJobRecommendations(skillsData.detectedSkills);
          
          toast({
            title: "Skills analysis complete",
            description: `Found ${skillsData.detectedSkills.length} skills in the document.`,
          });
        } else {
          // Ensure localDetectedSkills is not empty before setting
          if (localDetectedSkills.length > 0) {
            setDetectedSkills(localDetectedSkills);
            
            // Generate job recommendations based on detected skills
            generateJobRecommendations(localDetectedSkills);
            
            toast({
              title: "Skills analysis complete",
              description: `Found ${localDetectedSkills.length} skills using local detection.`,
            });
          } else {
            // If no skills were found
            setDetectedSkills([]);
            setJobRecommendations([]);
            
            toast({
              variant: "default",
              title: "Skills analysis complete",
              description: "No skills were detected in the document."
            });
          }
        }
      } catch (apiError) {
        console.error('Skills API Error:', apiError);
        // Fall back to the local detection if the API call fails
        setDetectedSkills(localDetectedSkills);
        
        // Generate job recommendations based on detected skills
        generateJobRecommendations(localDetectedSkills);
        
        toast({
          title: "Skills analysis complete",
          description: `Found ${localDetectedSkills.length} skills using local detection. API call failed.`,
          variant: "default",
        });
      }
    } catch (err) {
      console.error('Skills Analysis Error:', err);
      toast({
        variant: "destructive",
        title: "Skills analysis failed",
        description: "Could not analyze the document for skills.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate job recommendations based on detected skills
  const generateJobRecommendations = (skills) => {
    if (!skills || skills.length === 0) {
      setJobRecommendations([]);
      return;
    }
    
    // Calculate match percentage for each job role based on required and preferred skills
    const recommendations = JOB_ROLES.map(job => {
      // Count matching required skills
      const matchingRequired = job.requiredSkills.filter(skill => 
        skills.some(detectedSkill => 
          detectedSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      // Count matching preferred skills
      const matchingPreferred = job.preferredSkills.filter(skill => 
        skills.some(detectedSkill => 
          detectedSkill.toLowerCase() === skill.toLowerCase()
        )
      );
      
      // Calculate match percentage - required skills have higher weight
      const requiredWeight = 0.7;
      const preferredWeight = 0.3;
      
      const requiredScore = job.requiredSkills.length > 0 
        ? (matchingRequired.length / job.requiredSkills.length) * requiredWeight 
        : 0;
      
      const preferredScore = job.preferredSkills.length > 0 
        ? (matchingPreferred.length / job.preferredSkills.length) * preferredWeight 
        : 0;
      
      const matchScore = (requiredScore + preferredScore) * 100;
      
      return {
        ...job,
        match: Math.round(matchScore),
        matchingRequired,
        matchingPreferred
      };
    });
    
    // Sort by match percentage (descending)
    recommendations.sort((a, b) => b.match - a.match);
    
    setJobRecommendations(recommendations);
    
    // If we have good matches, suggest navigating to the jobs tab
    if (recommendations.length > 0 && recommendations[0].match > 50) {
      toast({
        title: "Job matches found!",
        description: `Based on your skills, we've found job matches. Check the "Jobs" tab for recommendations.`,
      });
    }
  };

  // Copy extracted text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "Copied to clipboard",
          description: "Text has been copied to your clipboard.",
          duration: 3000,
        });
      },
      (err) => {
        console.error('Copy failed:', err);
        setError('Failed to copy text to clipboard');
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy text to clipboard.",
          duration: 3000,
        });
      }
    );
  };

  // Reset the form
  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setExtractedText('');
    setError(null);
    setDetectedSkills([]);
    setJobRecommendations([]);
    setIsAnalyzing(false);
    setActiveTab('upload');
  };

  // Save text as file
  const saveAsTextFile = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File saved",
      description: "Extracted text has been saved as a file.",
      duration: 3000,
    });
  };

  // Render skill match percentage bar
  const renderSkillMatchBar = (percentage) => {
    let color = "bg-gray-200";
    
    if (percentage >= 80) {
      color = "bg-emerald-500";
    } else if (percentage >= 60) {
      color = "bg-emerald-400";
    } else if (percentage >= 40) {
      color = "bg-amber-400";
    } else if (percentage >= 20) {
      color = "bg-amber-300";
    }
    
    return (
      <div className="w-full  rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Render stars for job match rating
  const renderStars = (percentage) => {
    const starCount = 5;
    const filledStars = Math.floor(percentage / 20); // 20% per star
    const hasHalfStar = percentage % 20 >= 10; // Half star if remainder is 10% or more
    
    return (
      <div className="flex">
        {[...Array(starCount)].map((_, index) => {
          if (index < filledStars) {
            return <Star key={index} className="w-4 h-4 text-amber-500" fill="currentColor" />;
          } else if (index === filledStars && hasHalfStar) {
            return <StarHalf key={index} className="w-4 h-4 text-amber-500" fill="currentColor" />;
          } else {
            return <Star key={index} className="w-4 h-4 text-gray-300" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold ">Resume Analyzer</h1>
          <p className="mt-2 text-lg ">
            Extract skills from resumes and get job recommendations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="results" disabled={!extractedText}>Results</TabsTrigger>
            <TabsTrigger value="skills" disabled={!extractedText}>
              Skills {detectedSkills.length > 0 && `(${detectedSkills.length})`}
            </TabsTrigger>
            <TabsTrigger value="jobs" disabled={!extractedText || jobRecommendations.length === 0}>
              Jobs {jobRecommendations.length > 0 && `(${jobRecommendations.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Upload Resume</CardTitle>
                <CardDescription>
                  Upload a PDF or image file to extract text and analyze skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {/* File upload area with drag and drop */}
                  <div 
                    className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => document.getElementById('file-upload').click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.add('ring-2', 'ring-primary', 'ring-inset');
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('ring-2', 'ring-primary', 'ring-inset');
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.currentTarget.classList.remove('ring-2', 'ring-primary', 'ring-inset');
                      
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        // Create a synthetic event with the dropped file
                        const fileList = e.dataTransfer.files;
                        const event = { target: { files: fileList } };
                        handleFileChange(event);
                      }
                    }}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="space-y-4">
                        {filePreview ? (
                          <img 
                            src={filePreview} 
                            alt="Preview" 
                            className="max-h-48 mx-auto object-contain rounded" 
                          />
                        ) : (
                          <FileText className="h-16 w-16  mx-auto" />
                        )}
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs ">
                          {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file-upload').click();
                          }}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-12 w-12  mx-auto" />
                        <div>
                          <p className="text-base font-medium">Click to upload or drag and drop</p>
                          <p className="text-sm ">PDF, PNG, JPG, JPEG (max 10MB)</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Error message */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Process button */}
                  <Button 
                    onClick={processFile} 
                    disabled={!file || isLoading}
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Extract Text & Analyze Skills'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>
                  Text extracted from your document
                </CardDescription>
                {isAnalyzing && (
                  <div className="flex items-center text-sm ">
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> 
                    Analyzing document for skills...
                  </div>
                )}
                {detectedSkills.length > 0 && (
                  <div className="flex items-center text-sm text-emerald-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {detectedSkills.length} skills detected! 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-1 text-sm"
                      onClick={() => setActiveTab('skills')}
                    >
                      View details
                    </Button>
                  </div>
                )}
                {jobRecommendations.length > 0 && (
                  <div className="flex items-center text-sm text-emerald-600 mt-1">
                    <BriefcaseBusiness className="h-4 w-4 mr-2" />
                    {jobRecommendations.length} job matches found! 
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-1 text-sm"
                      onClick={() => setActiveTab('jobs')}
                    >
                      View matches
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Extracted text display */}
                  <div className="relative">
                    <Textarea
                      value={extractedText}
                      readOnly
                      className="min-h-72 font-mono text-sm p-4"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2"
                      onClick={copyToClipboard}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Word and character count */}
                  <div className="text-sm  flex space-x-4">
                    <div>
                      <span className="font-medium">Words:</span>{' '}
                      {extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0}
                    </div>
                    <div>
                      <span className="font-medium">Characters:</span>{' '}
                      {extractedText.length}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Process Another Document
                </Button>
                <Button 
                  onClick={saveAsTextFile}
                >
                  <FileType2 className="h-4 w-4 mr-2" />
                  Save as Text File
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Skills Analysis Results
                </CardTitle>
                <CardDescription>
                  Technical skills detected in your document
                </CardDescription>
              </CardHeader>
              <CardContent>
                {detectedSkills.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {detectedSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <Alert>
                      <AlertTitle>Skills Summary</AlertTitle>
                      <AlertDescription className="">
                        {detectedSkills.length} skills were found in your document. 
                        These skills include {detectedSkills.slice(0, 3).join(', ')}
                        {detectedSkills.length > 3 ? ` and ${detectedSkills.length - 3} more.` : '.'}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold mb-4">Skills by Category</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-2 ">Frontend Development</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {detectedSkills.filter(skill => 
                              ['React', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Redux', 'Context API'].includes(skill)
                            ).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {detectedSkills.filter(skill => 
                              ['React', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Redux', 'Context API'].includes(skill)
                            ).length === 0 && (
                              <p className="text-xs  italic">No frontend skills detected</p>
                            )}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-2 ">Backend Development</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {detectedSkills.filter(skill => 
                              ['Node', 'Express', 'Python', 'Django', 'Flask', 'Java', 'C++', 'C'].includes(skill)
                            ).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {detectedSkills.filter(skill => 
                              ['Node', 'Express', 'Python', 'Django', 'Flask', 'Java', 'C++', 'C'].includes(skill)
                            ).length === 0 && (
                              <p className="text-xs  italic">No backend skills detected</p>
                            )}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-2 ">Database Technologies</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {detectedSkills.filter(skill => 
                              ['MongoDB', 'SQL', 'NoSQL', 'Firebase'].includes(skill)
                            ).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {detectedSkills.filter(skill => 
                              ['MongoDB', 'SQL', 'NoSQL', 'Firebase'].includes(skill)
                            ).length === 0 && (
                              <p className="text-xs  italic">No database skills detected</p>
                            )}
                          </div>
                        </div>
                        <div className="border rounded-lg p-4">
                          <h4 className="text-sm font-medium mb-2 ">DevOps & Tools</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {detectedSkills.filter(skill => 
                              ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Postman', 'Insomnia'].includes(skill)
                            ).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {detectedSkills.filter(skill => 
                              ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Postman', 'Insomnia'].includes(skill)
                            ).length === 0 && (
                              <p className="text-xs  italic">No DevOps skills detected</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {jobRecommendations.length > 0 && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">Job Role Recommendations</h3>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setActiveTab('jobs')}
                          >
                            View All Job Matches
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="mt-3 border rounded-lg overflow-hidden">
                          {jobRecommendations.slice(0, 3).map((job, index) => (
                            <div 
                              key={index} 
                              className={`p-3 ${index < jobRecommendations.slice(0, 3).length - 1 ? 'border-b' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium ">{job.title}</h4>
                                  <p className="text-xs  mt-1">{job.description}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm font-semibold ">{job.match}% Match</span>
                                  <div className="mt-1">
                                    {renderStars(job.match)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12  mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Skills Detected</h3>
                    <p className=" mt-2">
                      We couldn't detect any technical skills in your document.
                      Try uploading a resume or technical document.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('results')}
                >
                  Back to Text Results
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Process Another Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BriefcaseBusiness className="h-5 w-5 mr-2" />
                  Job Role Recommendations
                </CardTitle>
                <CardDescription>
                  Job roles that match your detected skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobRecommendations.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {jobRecommendations.map((job, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-semibold ">{job.title}</h3>
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium ">{job.match}% Match</span>
                                <div className="mt-1">
                                  {renderStars(job.match)}
                                </div>
                              </div>
                            </div>
                            
                            <p className="text-sm  mb-4">{job.description}</p>
                            
                            <div className="mb-3">
                              {renderSkillMatchBar(job.match)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-xs font-medium  mb-2">REQUIRED SKILLS</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {job.requiredSkills.map((skill, idx) => {
                                    const isMatched = job.matchingRequired.includes(skill);
                                    return (
                                      <Badge 
                                        key={idx} 
                                        variant={isMatched ? "default" : "outline"} 
                                        className={`text-xs ${!isMatched ? ' border-gray-200' : ''}`}
                                      >
                                        {isMatched && <Check className="mr-1 h-3 w-3" />}
                                        {skill}
                                      </Badge>
                                    );
                                  })}
                                </div>
                                
                                <div className="mt-2 text-xs ">
                                  {job.matchingRequired.length}/{job.requiredSkills.length} required skills matched
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-xs font-medium  mb-2">PREFERRED SKILLS</h4>
                                <div className="flex flex-wrap gap-1.5">
                                  {job.preferredSkills.map((skill, idx) => {
                                    const isMatched = job.matchingPreferred.includes(skill);
                                    return (
                                      <Badge 
                                        key={idx} 
                                        variant={isMatched ? "secondary" : "outline"} 
                                        className={`text-xs ${!isMatched ? ' border-gray-200' : ''}`}
                                      >
                                        {isMatched && <Check className="mr-1 h-3 w-3" />}
                                        {skill}
                                      </Badge>
                                    );
                                  })}
                                </div>
                                
                                <div className="mt-2 text-xs ">
                                  {job.matchingPreferred.length}/{job.preferredSkills.length} preferred skills matched
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Alert>
                      <AlertTitle>How We Matched You</AlertTitle>
                      <AlertDescription className="">
                        These job recommendations are based on the skills detected in your resume.
                        Required skills are weighted at 70% and preferred skills at 30% when calculating the match percentage.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold mb-2">Skills Used for Matching</h3>
                      <div className="flex flex-wrap gap-2">
                        {detectedSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BriefcaseBusiness className="h-12 w-12  mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Job Matches</h3>
                    <p className=" mt-2">
                      We couldn't find any job role matches based on your skills.
                      Try uploading a resume with more technical skills.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('skills')}
                >
                  Back to Skills Analysis
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  Process Another Document
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Loading progress */}
        {isLoading && (
          <div className="mt-4">
            <p className="text-sm  mb-2">Processing your document...</p>
            <Progress value={null} className="h-1" />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm ">
        <p>Powered by Flask, Tesseract OCR, and React</p>
      </footer>
    </div>
  );
};

export default OCRScanner;