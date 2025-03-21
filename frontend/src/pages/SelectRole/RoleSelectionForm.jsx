import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, ChevronDown, Plus, X, Loader2, Upload } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuthStore } from '@/Store/useAuthStore';
import { toast } from 'react-hot-toast';

const RoleSelectionForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { 
    selectRole, 
    completeProfile, 
    isLoading, 
    isError, 
    error, 
    registrationStep,
    tempUserId,
    resetRegistration
  } = useAuthStore();
  
  // Get userId from URL or from store
  const userId = searchParams.get('userId') || tempUserId;
  
  // Component state
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [selectedRole, setSelectedRole] = useState(localStorage.getItem('selectedRole') || null);
  const [currentStep, setCurrentStep] = useState('loading'); // loading, role-selection, profile-completion, success
  
  // Form data for profile completion
  const [formData, setFormData] = useState({
    candidateProfile: {
      resumeUrl: '',
      skills: [],
      experience: '',
      githubUsername: '',
      leetcodeUsername: '',
      codeforcesUsername: '',
      codechefUsername: '',
      preferredRoles: []
    },
    interviewerProfile: {
      expertise: [],
      company: '',
      position: '',
      availabilitySchedule: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' }
      ]
    }
  });

  // Set the correct step based on registration progress
  useEffect(() => {
    // Validate registration flow
    if (!userId) {
      toast.error('User ID not found. Redirecting to registration.');
      navigate('/register');
      return;
    }

    // Determine current step based on registration progress
    if (registrationStep === 'roleSelection') {
      setCurrentStep('role-selection');
    } else if (registrationStep === 'profileCompletion') {
      setCurrentStep('profile-completion');
      setSelectedRole(localStorage.getItem('selectedRole'));
    } else if (registrationStep === 'completed') {
      navigate('/dashboard');
    } else {
      // Invalid state - redirect to registration
      toast.error('Registration session expired. Please start over.');
      resetRegistration();
      navigate('/register');
    }
  }, [userId, registrationStep, navigate, resetRegistration]);

  // Handle profile picture upload
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Profile picture must be less than 5MB');
        return;
      }
      
      try {
        setProfilePicture(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePicturePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error processing file:', error);
        toast.error('Failed to process the image. Please try another file.');
      }
    }
  };

  // Handle role selection
  const handleRoleSelect = async (role) => {
    if (!profilePicture) {
      toast.error('Please upload a profile picture');
      return;
    }
    
    try {
      setSelectedRole(role);
      
      // Create FormData object
      const formData = new FormData();
     
      
      // Call API to select role with FormData
      await selectRole(formData);
      
      // Move to profile completion
      setCurrentStep('profile-completion');
    } catch (error) {
      console.error('Role selection failed:', error);
      // Error is handled by the store and displayed via toast
    }
  };

  // Form input handlers for profile completion
  const handleInputChange = (profile, field, value) => {
    setFormData(prev => ({
      ...prev,
      [profile]: {
        ...prev[profile],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (profile, field, value) => {
    const values = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [profile]: {
        ...prev[profile],
        [field]: values
      }
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.interviewerProfile.availabilitySchedule];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      interviewerProfile: {
        ...prev.interviewerProfile,
        availabilitySchedule: updatedSchedule
      }
    }));
  };

  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      interviewerProfile: {
        ...prev.interviewerProfile,
        availabilitySchedule: [
          ...prev.interviewerProfile.availabilitySchedule,
          { day: 'Monday', startTime: '09:00', endTime: '17:00' }
        ]
      }
    }));
  };

  const removeScheduleSlot = (index) => {
    if (formData.interviewerProfile.availabilitySchedule.length <= 1) {
      toast.error('You must have at least one availability slot');
      return;
    }
    
    const updatedSchedule = [...formData.interviewerProfile.availabilitySchedule];
    updatedSchedule.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      interviewerProfile: {
        ...prev.interviewerProfile,
        availabilitySchedule: updatedSchedule
      }
    }));
  };

  // Handle profile completion form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation based on role
    if (selectedRole === 'candidate') {
      if (!formData.candidateProfile.skills.length) {
        toast.error('Please enter at least one skill');
        return;
      }
      if (!formData.candidateProfile.experience) {
        toast.error('Please enter your years of experience');
        return;
      }
    } else if (selectedRole === 'interviewer') {
      if (!formData.interviewerProfile.expertise.length) {
        toast.error('Please enter your areas of expertise');
        return;
      }
      if (!formData.interviewerProfile.company) {
        toast.error('Please enter your company');
        return;
      }
      if (!formData.interviewerProfile.position) {
        toast.error('Please enter your position');
        return;
      }
    }

    try {
      // Create FormData object for profile completion
      const profileFormData = new FormData();
      profileFormData.append('userId', userId);

      // Add role-specific data
      if (selectedRole === 'candidate') {
        // For arrays, either stringify or append each item individually
        profileFormData.append('resumeUrl', formData.candidateProfile.resumeUrl);
        profileFormData.append('skills', JSON.stringify(formData.candidateProfile.skills));
        profileFormData.append('experience', formData.candidateProfile.experience);
        profileFormData.append('githubUsername', formData.candidateProfile.githubUsername);
        profileFormData.append('leetcodeUsername', formData.candidateProfile.leetcodeUsername);
        profileFormData.append('codeforcesUsername', formData.candidateProfile.codeforcesUsername);
        profileFormData.append('codechefUsername', formData.candidateProfile.codechefUsername);
        profileFormData.append('preferredRoles', JSON.stringify(formData.candidateProfile.preferredRoles));
      } else {
        profileFormData.append('expertise', JSON.stringify(formData.interviewerProfile.expertise));
        profileFormData.append('company', formData.interviewerProfile.company);
        profileFormData.append('position', formData.interviewerProfile.position);
        profileFormData.append('availabilitySchedule', JSON.stringify(formData.interviewerProfile.availabilitySchedule));
      }
      
      // Call API to complete profile
      await completeProfile(profileFormData);
      
      // Show success message
      setCurrentStep('success');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error('Profile completion failed:', error);
      // Error is handled by the store and displayed via toast
    }
  };

  // Reset form and start over
  const handleResetRegistration = () => {
    resetRegistration();
    navigate('/register');
  };

  // Handle going back to role selection
  const handleBackToRoleSelection = () => {
    // This will discard current progress - confirm with user
    if (window.confirm('Going back will reset your role selection. Continue?')) {
      resetRegistration();
      setCurrentStep('role-selection');
    }
  };

  // Theme-based styling
  const isDarkMode = theme === 'dark';
  
  // Use theme-consistent class names
  const cardClass = 'bg-card';
  const buttonClass = 'bg-primary hover:bg-primary/90 text-primary-foreground';
  const inputClass = 'bg-background border-input text-foreground';
  const secondaryButtonClass = 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';
  const roleCardClass = 'bg-card border-border hover:bg-accent';
  
  // Show loading screen while determining the current step
  if (currentStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your registration...</p>
        </div>
      </div>
    );
  }
  
  // Success screen after completing registration
  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-background transition-colors duration-200">
        <div className="max-w-6xl mx-auto p-6">
          <div className={`${cardClass} p-8 max-w-2xl mx-auto text-center rounded-xl shadow-lg`}>
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedRole === 'candidate' ? 'Candidate Profile Submitted!' : 'Interviewer Profile Submitted!'}
            </h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Thank you for submitting your profile. We'll redirect you to the dashboard shortly.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className={`${buttonClass} px-6 py-3 rounded-lg font-medium transition-colors duration-200`}
                onClick={() => navigate('/dashboard')}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Role selection screen
  if (currentStep === 'role-selection') {
    return (
      <div className="min-h-screen bg-background transition-colors duration-200">
        <div className="max-w-6xl mx-auto p-6">
          <div className="max-w-3xl mx-auto">
            <div className={`${cardClass} p-8 rounded-xl shadow-lg`}>
              <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>
              <p className="text-center mb-8 text-muted-foreground">Select how you want to use our platform</p>
              
              {/* Profile Picture Upload */}
              <div className="mb-10">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    {profilePicturePreview ? (
                      <img 
                        src={profilePicturePreview} 
                        alt="Profile preview" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center">
                        <Upload className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    
                    <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors duration-200">
                      <Upload className="w-4 h-4" />
                      <input 
                        type="file" 
                        id="profile-picture" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Upload your profile picture</p>
                </div>
              </div>
              
              {/* Role Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <button
                  className={`${roleCardClass} border rounded-xl p-6 text-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleRoleSelect('candidate')}
                  disabled={isLoading || !profilePicture}
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-3">Candidate</h3>
                  <p className="text-sm text-muted-foreground">Find interviewers who can help you prepare for your next big opportunity</p>
                </button>
                
                <button
                  className={`${roleCardClass} border rounded-xl p-6 text-center hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleRoleSelect('interviewer')}
                  disabled={isLoading || !profilePicture}
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-3">Interviewer</h3>
                  <p className="text-sm text-muted-foreground">Help candidates prepare and share your expertise</p>
                </button>
              </div>
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-center mt-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              
              {/* Error message */}
              {isError && (
                <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-lg">
                  <p>{error || 'An error occurred. Please try again.'}</p>
                </div>
              )}
              
              {/* Back button */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleResetRegistration}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                  disabled={isLoading}
                >
                  Back to Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Profile completion form
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className={`${cardClass} border rounded-xl p-8 shadow-lg`}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">
                {selectedRole === 'candidate' ? 'Candidate Profile' : 'Interviewer Profile'}
              </h2>
              <button 
                onClick={handleBackToRoleSelection}
                className={`${secondaryButtonClass} px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                <ChevronDown className="w-4 h-4" />
                Change Role
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedRole === 'candidate' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Resume URL</label>
                    <input
                      type="url"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.candidateProfile.resumeUrl}
                      onChange={(e) => handleInputChange('candidateProfile', 'resumeUrl', e.target.value)}
                      placeholder="https://example.com/resume.pdf"
                      disabled={isLoading}
                    />
                    <p className="mt-1 text-sm text-muted-foreground">Link to your resume or portfolio</p>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Skills (comma separated)</label>
                    <input
                      type="text"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.candidateProfile.skills.join(', ')}
                      onChange={(e) => handleArrayInputChange('candidateProfile', 'skills', e.target.value)}
                      placeholder="JavaScript, React, Node.js"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Experience (years)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.candidateProfile.experience}
                      onChange={(e) => handleInputChange('candidateProfile', 'experience', e.target.value)}
                      placeholder="2.5"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">GitHub Username</label>
                      <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors duration-200`}>
                        <span className="text-muted-foreground mr-2">github.com/</span>
                        <input
                          type="text"
                          className="bg-transparent border-none focus:outline-none flex-1"
                          value={formData.candidateProfile.githubUsername}
                          onChange={(e) => handleInputChange('candidateProfile', 'githubUsername', e.target.value)}
                          placeholder="username"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">LeetCode Username</label>
                      <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors duration-200`}>
                        <span className="text-muted-foreground mr-2">leetcode.com/</span>
                        <input
                          type="text"
                          className="bg-transparent border-none focus:outline-none flex-1"
                          value={formData.candidateProfile.leetcodeUsername}
                          onChange={(e) => handleInputChange('candidateProfile', 'leetcodeUsername', e.target.value)}
                          placeholder="username"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">CodeForces Username</label>
                      <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors duration-200`}>
                        <span className="text-muted-foreground mr-2">codeforces.com/</span>
                        <input
                          type="text"
                          className="bg-transparent border-none focus:outline-none flex-1"
                          value={formData.candidateProfile.codeforcesUsername}
                          onChange={(e) => handleInputChange('candidateProfile', 'codeforcesUsername', e.target.value)}
                          placeholder="username"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">CodeChef Username</label>
                      <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-colors duration-200`}>
                        <span className="text-muted-foreground mr-2">codechef.com/</span>
                        <input
                          type="text"
                          className="bg-transparent border-none focus:outline-none flex-1"
                          value={formData.candidateProfile.codechefUsername}
                          onChange={(e) => handleInputChange('candidateProfile', 'codechefUsername', e.target.value)}
                          placeholder="username"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Preferred Roles (comma separated)</label>
                    <input
                      type="text"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.candidateProfile.preferredRoles.join(', ')}
                      onChange={(e) => handleArrayInputChange('candidateProfile', 'preferredRoles', e.target.value)}
                      placeholder="Frontend Developer, Full Stack Developer"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Expertise (comma separated)</label>
                    <input
                      type="text"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.interviewerProfile.expertise.join(', ')}
                      onChange={(e) => handleArrayInputChange('interviewerProfile', 'expertise', e.target.value)}
                      placeholder="Algorithms, System Design, React"
                      disabled={isLoading}
                      required
                    />
                    <p className="mt-1 text-sm text-muted-foreground">Areas you are comfortable interviewing candidates in</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block mb-2 font-medium">Company</label>
                      <input
                        type="text"
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                        value={formData.interviewerProfile.company}
                        onChange={(e) => handleInputChange('interviewerProfile', 'company', e.target.value)}
                        placeholder="Company Name"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Position</label>
                      <input
                        type="text"
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                        value={formData.interviewerProfile.position}
                        onChange={(e) => handleInputChange('interviewerProfile', 'position', e.target.value)}
                        placeholder="Senior Developer"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-medium">Availability Schedule</label>
                      <button
                        type="button"
                        onClick={addScheduleSlot}
                        className={`${secondaryButtonClass} px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isLoading}
                      >
                        <Plus className="w-4 h-4" /> Add Slot
                      </button>
                    </div>
                    
                    <div className="bg-background/50 p-4 rounded-xl border">
                      {formData.interviewerProfile.availabilitySchedule.map((slot, index) => (
                        <div key={index} className="grid grid-cols-7 gap-3 mb-3 p-3 rounded-xl bg-card border">
                          <div className="col-span-3">
                            <label className="text-xs block mb-1 text-muted-foreground">Day</label>
                            <select
                              className={`${inputClass} w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                              value={slot.day}
                              onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                              disabled={isLoading}
                            >
                              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="col-span-2">
                            <label className="text-xs block mb-1 text-muted-foreground">End Time</label>
                            <input
                              type="time"
                              className={`${inputClass} w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                              value={slot.endTime}
                              onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                              disabled={isLoading}
                            />
                          </div>
                          
                          {formData.interviewerProfile.availabilitySchedule.length > 1 && (
                            <div className="col-span-1 flex items-end">
                              <button
                                type="button"
                                onClick={() => removeScheduleSlot(index)}
                                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors duration-200"
                                disabled={isLoading}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-center mt-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
              
              {/* Error message */}
              {isError && (
                <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-lg">
                  <p>{error || 'An error occurred. Please try again.'}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center mt-8">
                <button
                  type="button"
                  onClick={handleBackToRoleSelection}
                  className={`${secondaryButtonClass} px-6 py-3 rounded-lg transition-colors duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  className={`${buttonClass} px-6 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Complete Profile'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionForm;