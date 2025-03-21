import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  FileText, 
  Code, 
  Calendar, 
  ArrowRight, 
  LogOut,
  Globe
} from 'lucide-react';

// Language options
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' }
];

// Create axios instance with baseURL
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page on authentication errors
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const CandidateDashboard = () => {
  // State variables
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    experience: '',
    skills: [],
    preferredRoles: [],
    githubUsername: '',
    leetcodeUsername: '',
    codeforcesUsername: '',
    codechefUsername: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [interviewers, setInterviewers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [interviewFormData, setInterviewFormData] = useState({
    interviewerId: '',
    preferredDate: '',
    preferredTime: '',
    topics: []
  });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  // Skills and roles options
  const skillOptions = ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"];
  const roleOptions = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist"];

  // Handle language change
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsLanguageMenuOpen(false);
  };

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get('/candidate/profile');
        setUser(response.data);
        
        // Initialize form data from user data
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          gender: response.data.gender || '',
          experience: response.data.candidateProfile?.experience || '',
          skills: response.data.candidateProfile?.skills || [],
          preferredRoles: response.data.candidateProfile?.preferredRoles || [],
          githubUsername: response.data.candidateProfile?.githubUsername || '',
          leetcodeUsername: response.data.candidateProfile?.leetcodeUsername || '',
          codeforcesUsername: response.data.candidateProfile?.codeforcesUsername || '',
          codechefUsername: response.data.candidateProfile?.codechefUsername || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        showAlert('destructive', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isLanguageMenuOpen && !e.target.closest('.language-selector')) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLanguageMenuOpen]);

  // Fetch interviewers when interview tab is active
  useEffect(() => {
    if (activeTab === 'interviews' && isAuthenticated) {
      fetchInterviewers();
      fetchInterviews();
    }
  }, [activeTab, isAuthenticated]);

  const fetchInterviewers = async () => {
    try {
      const response = await api.get('/candidate/interviewers');
      setInterviewers(response.data);
    } catch (error) {
      console.error('Error fetching interviewers:', error);
      showAlert('destructive', 'Failed to load interviewers');
    }
  };

  const fetchInterviews = async () => {
    try {
      const response = await api.get('/candidate/interviews');
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      showAlert('destructive', 'Failed to load interviews');
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle select changes for gender
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes for multi-select options
  const handleCheckboxChange = (value, checked, category) => {
    if (checked) {
      setFormData({
        ...formData,
        [category]: [...formData[category], value]
      });
    } else {
      setFormData({
        ...formData,
        [category]: formData[category].filter(item => item !== value)
      });
    }
  };

  // Handle resume file selection
  const handleResumeChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  // Handle interview form changes
  const handleInterviewChange = (e) => {
    const { name, value } = e.target;
    setInterviewFormData({
      ...interviewFormData,
      [name]: value
    });
  };

  const handleInterviewSelectChange = (name, value) => {
    setInterviewFormData({
      ...interviewFormData,
      [name]: value
    });
  };

  const handleTopicChange = (value, checked) => {
    if (checked) {
      setInterviewFormData({
        ...interviewFormData,
        topics: [...interviewFormData.topics, value]
      });
    } else {
      setInterviewFormData({
        ...interviewFormData,
        topics: interviewFormData.topics.filter(topic => topic !== value)
      });
    }
  };

  // Save profile updates
  const saveProfile = async () => {
    try {
      const response = await api.put('/candidate/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender,
        experience: formData.experience
      });
      
      setUser(response.data);
      showAlert('default', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      showAlert('destructive', 'Failed to update profile');
    }
  };

  // Update skills
  const updateSkills = async () => {
    try {
      const response = await api.put('/candidate/skills', {
        skills: formData.skills
      });
      
      setUser(response.data);
      showAlert('default', 'Skills updated successfully');
    } catch (error) {
      console.error('Error updating skills:', error);
      showAlert('destructive', 'Failed to update skills');
    }
  };

  // Update preferred roles
  const updatePreferredRoles = async () => {
    try {
      const response = await api.put('/candidate/preferred-roles', {
        preferredRoles: formData.preferredRoles
      });
      
      setUser(response.data);
      showAlert('default', 'Preferred roles updated successfully');
    } catch (error) {
      console.error('Error updating preferred roles:', error);
      showAlert('destructive', 'Failed to update preferred roles');
    }
  };

  // Update coding profiles
  const updateCodingProfiles = async () => {
    try {
      const response = await api.put('/candidate/coding-profiles', {
        githubUsername: formData.githubUsername,
        leetcodeUsername: formData.leetcodeUsername,
        codeforcesUsername: formData.codeforcesUsername,
        codechefUsername: formData.codechefUsername
      });
      
      setUser(response.data);
      showAlert('default', 'Coding profiles updated successfully');
    } catch (error) {
      console.error('Error updating coding profiles:', error);
      showAlert('destructive', 'Failed to update coding profiles');
    }
  };

  // Upload resume
  const uploadResume = async () => {
    if (!resumeFile) {
      showAlert('destructive', 'Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      
      const response = await api.post('/candidate/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUser(response.data.user);
      showAlert('default', 'Resume uploaded successfully');
      setResumeFile(null);
    } catch (error) {
      console.error('Error uploading resume:', error);
      showAlert('destructive', 'Failed to upload resume');
    }
  };

  // Delete resume
  const deleteResume = async () => {
    try {
      const response = await api.delete('/candidate/resume');
      setUser(response.data.user);
      showAlert('default', 'Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      showAlert('destructive', 'Failed to delete resume');
    }
  };

  // Request interview
  const requestInterview = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/candidate/request-interview', interviewFormData);
      showAlert('default', 'Interview requested successfully');
      
      // Reset form and refresh interviews list
      setInterviewFormData({
        interviewerId: '',
        preferredDate: '',
        preferredTime: '',
        topics: []
      });
      
      fetchInterviews();
    } catch (error) {
      console.error('Error requesting interview:', error);
      showAlert('destructive', 'Failed to request interview');
    }
  };

  // Cancel interview
  const cancelInterview = async (interviewId) => {
    try {
      await api.delete(`/candidate/interviews/${interviewId}`);
      showAlert('default', 'Interview cancelled successfully');
      
      // Refresh interviews list
      fetchInterviews();
    } catch (error) {
      console.error('Error cancelling interview:', error);
      showAlert('destructive', 'Failed to cancel interview');
    }
  };

  // Save all profile changes
  const saveAllChanges = async () => {
    try {
      await saveProfile();
      setEditMode(false);
    } catch (error) {
      console.error('Error saving all changes:', error);
      showAlert('destructive', 'Failed to save all changes');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // Redirect to login
    window.location.href = '/login';
  };

  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    
    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 3000);
  };

  // Simple language selector component
  const LanguageSelector = () => {
    return (
      <div className="language-selector relative">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-white hover:bg-zinc-800 rounded-md"
          onClick={(e) => {
            e.stopPropagation();
            setIsLanguageMenuOpen(!isLanguageMenuOpen);
          }}
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{LANGUAGES.find(lang => lang.code === language)?.name || 'English'}</span>
        </Button>
        
        {isLanguageMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-50">
            <div className="py-1">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  className={`block w-full text-left px-4 py-2 text-sm ${language === lang.code ? 'bg-zinc-800 text-white' : 'text-gray-300 hover:bg-zinc-800'}`}
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Login form component
  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLoginChange = (e) => {
      const { name, value } = e.target;
      setCredentials({ ...credentials, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setIsLoggingIn(true);
      setLoginError('');

      try {
        // Make API call to login endpoint
        const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
        
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        
        // Update auth state
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(
          error.response?.data?.message || 
          'Login failed. Please check your credentials and try again.'
        );
      } finally {
        setIsLoggingIn(false);
      }
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Candidate Login</CardTitle>
            <CardDescription className="text-gray-400">Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <Alert variant="destructive" className="bg-zinc-800 border-red-500 text-white">
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={handleLoginChange}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input 
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleLoginChange}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-white text-black hover:bg-gray-200"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Don't have an account? Contact your administrator
            </p>
            <LanguageSelector />
          </CardFooter>
        </Card>
      </div>
    );
  };

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header/Navbar */}
      <header className="bg-zinc-900 border-b border-zinc-800 py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">AS</span>
            </div>
            <span className="text-lg font-bold">AlgoSpace</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-400 hover:bg-zinc-800 hover:text-red-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Alert message */}
      {alert.show && (
        <div className="fixed top-16 right-4 z-50">
          <Alert variant={alert.type} className="bg-zinc-900 border-white text-white">
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen p-4">
          <div className="mb-8 text-center">
            <Avatar className="h-16 w-16 mx-auto mb-2 border border-white">
              <AvatarFallback className="bg-zinc-800 text-white">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
          
          <nav className="space-y-1">
            <Button 
              variant={activeTab === 'profile' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeTab === 'profile' ? 'bg-white text-black' : 'text-white hover:bg-zinc-800'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button 
              variant={activeTab === 'resume' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeTab === 'resume' ? 'bg-white text-black' : 'text-white hover:bg-zinc-800'}`}
              onClick={() => setActiveTab('resume')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Resume
            </Button>
            <Button 
              variant={activeTab === 'skills' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeTab === 'skills' ? 'bg-white text-black' : 'text-white hover:bg-zinc-800'}`}
              onClick={() => setActiveTab('skills')}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Skills & Preferences
            </Button>
            <Button 
              variant={activeTab === 'coding' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeTab === 'coding' ? 'bg-white text-black' : 'text-white hover:bg-zinc-800'}`}
              onClick={() => setActiveTab('coding')}
            >
              <Code className="h-4 w-4 mr-2" />
              Coding Profiles
            </Button>
            <Button 
              variant={activeTab === 'interviews' ? 'default' : 'ghost'} 
              className={`w-full justify-start ${activeTab === 'interviews' ? 'bg-white text-black' : 'text-white hover:bg-zinc-800'}`}
              onClick={() => setActiveTab('interviews')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Interviews
            </Button>
          </nav>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {/* All existing tab content remains the same */}
          {/* Profile Section */}
          {activeTab === 'profile' && (
            <Card className="bg-zinc-900 border-zinc-800 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Profile</CardTitle>
                  <CardDescription className="text-gray-400">Manage your personal information</CardDescription>
                </div>
                <Button 
                  variant={editMode ? "outline" : "default"} 
                  onClick={() => setEditMode(!editMode)}
                  className={editMode ? "border-white text-white hover:bg-zinc-800" : "bg-white text-black hover:bg-gray-200"}
                >
                  {editMode ? 'Cancel' : 'Edit Profile'}
                </Button>
              </CardHeader>
              
              <CardContent className="pt-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-white">First Name</Label>
                        <Input 
                          id="firstName"
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-white">Last Name</Label>
                        <Input 
                          id="lastName"
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-white">Gender</Label>
                        <Select 
                          value={formData.gender} 
                          onValueChange={(value) => handleSelectChange('gender', value)}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-white">Experience (years)</Label>
                        <Input 
                          id="experience"
                          name="experience" 
                          type="number"
                          min="0"
                          step="0.1"
                          value={formData.experience} 
                          onChange={handleChange} 
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-400">Name</div>
                        <div className="mt-1">{user?.firstName} {user?.lastName}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-400">Email</div>
                        <div className="mt-1">{user?.email}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-400">Gender</div>
                        <div className="mt-1">
                          {user?.gender 
                            ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) 
                            : 'Not specified'}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-gray-400">Experience</div>
                        <div className="mt-1">
                          {user?.candidateProfile?.experience 
                            ? `${user.candidateProfile.experience} years` 
                            : 'Not specified'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {editMode && (
                <CardFooter className="flex justify-end">
                  <Button onClick={saveAllChanges} className="bg-white text-black hover:bg-gray-200">
                    Save Changes
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}
          
          {/* Other tab content remains the same as in the previous implementation */}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;