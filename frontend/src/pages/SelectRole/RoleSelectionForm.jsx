import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Upload, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuthStore } from '@/Store/useAuthStore';
import { toast } from 'react-hot-toast';

const RoleSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useTheme();
  const { 
    selectRole, 
    isLoading, 
    isError, 
    error, 
    registrationStep,
    tempUserId,
    resetRegistration
  } = useAuthStore();
  
  // Get userId from URL or from store
  const userId = searchParams.get('userId') || tempUserId;
  
  // Form state
  const [formState, setFormState] = useState({
    profilePicture: null,
    profilePicturePreview: null,
    selectedRole: localStorage.getItem('selectedRole') || null,
    errors: {
      profilePicture: null,
      role: null,
    },
    isFormValid: false
  });
  
  const [currentStep, setCurrentStep] = useState('loading');

  // Validate form
  useEffect(() => {
    const isValid = !!formState.profilePicture && !!formState.selectedRole;
    setFormState(prev => ({
      ...prev,
      isFormValid: isValid
    }));
  }, [formState.profilePicture, formState.selectedRole]);

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
      navigate('/complete-profile');
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
    
    if (!file) {
      return;
    }
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          profilePicture: 'Profile picture must be less than 5MB'
        }
      }));
      toast.error('Profile picture must be less than 5MB');
      return;
    }
    
    try {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: reader.result,
          errors: {
            ...prev.errors,
            profilePicture: null
          }
        }));
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          profilePicture: 'Failed to process the image. Please try another file.'
        }
      }));
      toast.error('Failed to process the image. Please try another file.');
    }
  };

  // Handle role selection
  const handleRoleSelect = (role) => {
    setFormState(prev => ({
      ...prev,
      selectedRole: role,
      errors: {
        ...prev.errors,
        role: null
      }
    }));
    localStorage.setItem('selectedRole', role);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formState.profilePicture) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          profilePicture: 'Please upload a profile picture'
        }
      }));
      toast.error('Please upload a profile picture');
      return;
    }
    
    if (!formState.selectedRole) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          role: 'Please select a role'
        }
      }));
      toast.error('Please select a role');
      return;
    }
    
    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('profilePicture', formState.profilePicture);
      formData.append('role', formState.selectedRole);
      formData.append('userId', userId);
      
      // Call API to select role
console.log("formData",formData);
      
      // Move to profile completion
      navigate('/complete-profile');
    } catch (error) {
      console.error('Role selection failed:', error);
      // Error is handled by the store and displayed via toast
    }
  };

  // Reset profile picture
  const resetProfilePicture = () => {
    setFormState(prev => ({
      ...prev,
      profilePicture: null,
      profilePicturePreview: null
    }));
  };

  // Reset form and start over
  const handleResetRegistration = () => {
    resetRegistration();
    navigate('/register');
  };

  // Theme-based styling
  const isDarkMode = theme === 'dark';
  
  // Use theme-consistent class names
  const cardClass = 'bg-card';
  const buttonClass = 'bg-primary hover:bg-primary/90 text-primary-foreground';
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
  
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="max-w-6xl mx-auto p-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className={`${cardClass} p-8 rounded-xl shadow-lg`}>
            <h2 className="text-2xl font-bold text-center mb-6">Choose Your Role</h2>
            <p className="text-center mb-8 text-muted-foreground">Select how you want to use our platform</p>
            
            {/* Profile Picture Upload */}
            <div className="mb-10">
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  {formState.profilePicturePreview ? (
                    <div className="relative">
                      <img 
                        src={formState.profilePicturePreview} 
                        alt="Profile preview" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                      />
                      <button 
                        type="button"
                        onClick={resetProfilePicture}
                        className="absolute top-0 right-0 bg-destructive text-white rounded-full p-1"
                        aria-label="Remove profile picture"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
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
                      aria-invalid={!!formState.errors.profilePicture}
                      aria-describedby="profile-picture-error"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">Upload your profile picture</p>
                {formState.errors.profilePicture && (
                  <p id="profile-picture-error" className="text-sm text-destructive mt-1">
                    {formState.errors.profilePicture}
                  </p>
                )}
              </div>
            </div>
            
            {/* Role Selection */}
            <div 
              className="grid md:grid-cols-2 gap-6"
              role="radiogroup" 
              aria-labelledby="role-selection-label"
              aria-invalid={!!formState.errors.role}
              aria-describedby="role-error"
            >
              <span id="role-selection-label" className="sr-only">Select a role</span>
              
              <div className={`${roleCardClass} border rounded-xl p-6 text-center hover:shadow-lg ${formState.selectedRole === 'candidate' ? 'ring-2 ring-primary' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  id="role-candidate"
                  name="role"
                  value="candidate"
                  className="sr-only"
                  checked={formState.selectedRole === 'candidate'}
                  onChange={() => handleRoleSelect('candidate')}
                  disabled={isLoading}
                />
                <label 
                  htmlFor="role-candidate"
                  className="block w-full h-full cursor-pointer"
                  onClick={() => handleRoleSelect('candidate')}
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-3">Candidate</h3>
                  <p className="text-sm text-muted-foreground">Find interviewers who can help you prepare for your next big opportunity</p>
                </label>
              </div>
              
              <div className={`${roleCardClass} border rounded-xl p-6 text-center hover:shadow-lg ${formState.selectedRole === 'interviewer' ? 'ring-2 ring-primary' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="radio"
                  id="role-interviewer"
                  name="role"
                  value="interviewer"
                  className="sr-only"
                  checked={formState.selectedRole === 'interviewer'}
                  onChange={() => handleRoleSelect('interviewer')}
                  disabled={isLoading}
                />
                <label 
                  htmlFor="role-interviewer"
                  className="block w-full h-full cursor-pointer"
                  onClick={() => handleRoleSelect('interviewer')}
                >
                  <div className="w-20 h-20 rounded-full mx-auto mb-6 bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors duration-200">
                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-3">Interviewer</h3>
                  <p className="text-sm text-muted-foreground">Help candidates prepare and share your expertise</p>
                </label>
              </div>
              
              {formState.errors.role && (
                <p id="role-error" className="text-sm text-destructive col-span-2 text-center mt-2">
                  {formState.errors.role}
                </p>
              )}
            </div>
            
            {/* Submit button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className={`${buttonClass} px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${isLoading || !formState.isFormValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading || !formState.isFormValid}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Continue</span>
                )}
              </button>
            </div>
            
            {/* Error message */}
            {isError && (
              <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded-lg">
                <p>{error || 'An error occurred. Please try again.'}</p>
              </div>
            )}
            
            {/* Back button */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleResetRegistration}
                className="text-sm text-muted-foreground hover:text-foreground underline"
                disabled={isLoading}
              >
                Back to Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;