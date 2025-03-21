import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, X, Loader2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuthStore } from '@/Store/useAuthStore';
import { toast } from 'react-hot-toast';

const ProfileCompletion = ({ navigate }) => {
  const { theme } = useTheme();
  const { 
    completeProfile, 
    isLoading, 
    isError, 
    error, 
    registrationStep,
    tempUserId,
    resetRegistration
  } = useAuthStore();
  
  // Get selected role from local storage
  const selectedRole = localStorage.getItem('selectedRole');
  
  // Initialize form data
  const [formData, setFormData] = useState({
    candidate: {
      resumeUrl: '',
      skills: [],
      experience: '',
      githubUsername: '',
      leetcodeUsername: '',
      codeforcesUsername: '',
      codechefUsername: '',
      preferredRoles: []
    },
    interviewer: {
      expertise: [],
      company: '',
      position: '',
      availabilitySchedule: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' }
      ]
    }
  });

  // Validate registration flow
  useEffect(() => {
    if (!selectedRole) {
      toast.error('Please select a role first.');
      navigate('/role-selection');
      return;
    }

    if (registrationStep !== 'profileCompletion') {
      toast.error('Invalid registration step.');
      resetRegistration();
      navigate('/register');
    }
  }, [selectedRole, registrationStep, navigate, resetRegistration]);

  // Handle input changes for text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [profile, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [profile]: {
        ...prev[profile],
        [field]: value
      }
    }));
  };

  // Handle array input changes (for comma-separated lists)
  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    const [profile, field] = name.split('.');
    
    const values = value.split(',').map(item => item.trim()).filter(item => item);
    
    setFormData(prev => ({
      ...prev,
      [profile]: {
        ...prev[profile],
        [field]: values
      }
    }));
  };

  // Handle availability schedule changes
  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.interviewer.availabilitySchedule];
    updatedSchedule[index] = {
      ...updatedSchedule[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      interviewer: {
        ...prev.interviewer,
        availabilitySchedule: updatedSchedule
      }
    }));
  };

  // Add a new schedule slot
  const addScheduleSlot = () => {
    setFormData(prev => ({
      ...prev,
      interviewer: {
        ...prev.interviewer,
        availabilitySchedule: [
          ...prev.interviewer.availabilitySchedule,
          { day: 'Monday', startTime: '09:00', endTime: '17:00' }
        ]
      }
    }));
  };

  // Remove a schedule slot
  const removeScheduleSlot = (index) => {
    if (formData.interviewer.availabilitySchedule.length <= 1) {
      toast.error('You must have at least one availability slot');
      return;
    }
    
    const updatedSchedule = [...formData.interviewer.availabilitySchedule];
    updatedSchedule.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      interviewer: {
        ...prev.interviewer,
        availabilitySchedule: updatedSchedule
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form based on role
    if (selectedRole === 'candidate') {
      if (!formData.candidate.skills.length) {
        toast.error('Please enter at least one skill');
        return;
      }
      if (!formData.candidate.experience) {
        toast.error('Please enter your years of experience');
        return;
      }
    } else if (selectedRole === 'interviewer') {
      if (!formData.interviewer.expertise.length) {
        toast.error('Please enter your areas of expertise');
        return;
      }
      if (!formData.interviewer.company) {
        toast.error('Please enter your company');
        return;
      }
      if (!formData.interviewer.position) {
        toast.error('Please enter your position');
        return;
      }
    }

    try {
      // Prepare profile data
      const profileData = {
        userId: tempUserId,
        role: selectedRole,
        profileDetails: selectedRole === 'candidate' 
          ? { ...formData.candidate } 
          : { ...formData.interviewer }
      };
      
      // Call API to complete profile
      await completeProfile(profileData);
      
      // Redirect to dashboard or next step
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile completion failed:', error);
      // Error is handled by the store and displayed via toast
    }
  };

  // Theme-based styling
  const cardClass = 'bg-card';
  const buttonClass = 'bg-primary hover:bg-primary/90 text-primary-foreground';
  const inputClass = 'bg-background border-input text-foreground';
  const secondaryButtonClass = 'bg-secondary hover:bg-secondary/80 text-secondary-foreground';

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
                onClick={() => navigate('/role-selection')}
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
                  {/* Previous candidate form fields */}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 font-medium">Company</label>
                    <input
                      type="text"
                      name="interviewer.company"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.interviewer.company}
                      onChange={handleInputChange}
                      placeholder="Company Name"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 font-medium">Position</label>
                    <input
                      type="text"
                      name="interviewer.position"
                      className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                      value={formData.interviewer.position}
                      onChange={handleInputChange}
                      placeholder="Senior Developer"
                      disabled={isLoading}
                      required
                    />
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
                      {formData.interviewer.availabilitySchedule.map((slot, index) => (
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
                            <label className="text-xs block mb-1 text-muted-foreground">Start Time</label>
                            <input
                              type="time"
                              className={`${inputClass} w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors duration-200`}
                              value={slot.startTime}
                              onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                              disabled={isLoading}
                            />
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
                          
                          {formData.interviewer.availabilitySchedule.length > 1 && (
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
                  onClick={() => navigate('/role-selection')}
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

export default ProfileCompletion;