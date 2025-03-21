import React, { useState } from 'react';
import { Check, ChevronDown, Plus, X } from 'lucide-react';

const RoleSelectionForm = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  const [submitted, setSubmitted] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedRole(null);
    setFormData({
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
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = isDarkMode ? 'bg-transparent text-white' : 'bg-transparent text-gray-900 ';
  const buttonClass = isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white';
  const inputClass = isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900';
  const secondaryButtonClass = isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800';
  const roleCardClass = isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50';
  
  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-200`}>
      
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-end py-4 mb-8">
          
          <button 
            onClick={toggleTheme} 
            className={`${secondaryButtonClass} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </header>
        
        {submitted ? (
          <div className={`${cardClass}   p-8  max-w-2xl mx-auto text-center`}>
            <div className={`${isDarkMode ? 'bg-green-900' : 'bg-green-100'} ${isDarkMode ? 'text-green-200' : 'text-green-800'} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6`}>
              <Check size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedRole === 'candidate' ? 'Candidate Profile Submitted!' : 'Interviewer Profile Submitted!'}
            </h2>
            <p className="mb-6 text-lg opacity-80">
              Thank you for submitting your profile. We'll review your information and get back to you soon.
            </p>
            <button
              className={`${buttonClass} px-6 py-3 rounded-lg font-medium mt-4 transition-colors duration-200`}
              onClick={resetForm}
            >
              Submit Another Profile
            </button>
          </div>
        ) : !selectedRole ? (
          <div className="max-w-3xl mx-auto">
            <div className={`${cardClass}   p-12 `}>
              <h2 className="text-3xl font-bold text-center mb-10">Welcome to the Interview Platform</h2>
              <p className="text-center mb-10 opacity-80">Choose your role to get started with the platform</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <button
                  className={`${roleCardClass} border rounded-2xl p-8 text-center hover:shadow-xl hover:border-blue-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 group`}
                  onClick={() => handleRoleSelect('candidate')}
                >
                  <div className={`w-20 h-20 rounded-full mx-auto mb-6 ${isDarkMode ? 'bg-blue-900 group-hover:bg-blue-500' : 'bg-blue-50 group-hover:bg-blue-100'} flex items-center justify-center transition-colors duration-200`}>
                    <svg className={`w-10 h-10 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Candidate</h3>
                  <p className="text-sm opacity-70">Find interviewers who can help you prepare for your next big opportunity</p>
                </button>
                
                <button
                  className={`${roleCardClass} border rounded-2xl p-8 text-center hover:shadow-xl hover:border-purple-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 group`}
                  onClick={() => handleRoleSelect('interviewer')}
                >
                  <div className={`w-20 h-20 rounded-full mx-auto mb-6 ${isDarkMode ? 'bg-purple-900 group-hover:bg-purple-800' : 'bg-purple-50 group-hover:bg-purple-100'} flex items-center justify-center transition-colors duration-200`}>
                    <svg className={`w-10 h-10 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Interviewer</h3>
                  <p className="text-sm opacity-70">Help candidates prepare and share your expertise</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className={`${cardClass} border rounded-2xl p-8 shadow-lg`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  {selectedRole === 'candidate' ? 'Candidate Profile' : 'Interviewer Profile'}
                </h2>
                <button 
                  onClick={() => setSelectedRole(null)} 
                  className={`${secondaryButtonClass} px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200`}
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
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                        value={formData.candidateProfile.resumeUrl}
                        onChange={(e) => handleInputChange('candidateProfile', 'resumeUrl', e.target.value)}
                        placeholder="https://example.com/resume.pdf"
                      />
                      <p className="mt-1 text-sm opacity-70">Link to your resume or portfolio</p>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Skills (comma separated)</label>
                      <input
                        type="text"
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                        value={formData.candidateProfile.skills.join(', ')}
                        onChange={(e) => handleArrayInputChange('candidateProfile', 'skills', e.target.value)}
                        placeholder="JavaScript, React, Node.js"
                      />
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Experience (years)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                        value={formData.candidateProfile.experience}
                        onChange={(e) => handleInputChange('candidateProfile', 'experience', e.target.value)}
                        placeholder="2.5"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium">GitHub Username</label>
                        <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 transition-colors duration-200`}>
                          <span className="opacity-70 mr-2">github.com/</span>
                          <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none flex-1"
                            value={formData.candidateProfile.githubUsername}
                            onChange={(e) => handleInputChange('candidateProfile', 'githubUsername', e.target.value)}
                            placeholder="username"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium">LeetCode Username</label>
                        <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 transition-colors duration-200`}>
                          <span className="opacity-70 mr-2">leetcode.com/</span>
                          <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none flex-1"
                            value={formData.candidateProfile.leetcodeUsername}
                            onChange={(e) => handleInputChange('candidateProfile', 'leetcodeUsername', e.target.value)}
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium">CodeForces Username</label>
                        <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 transition-colors duration-200`}>
                          <span className="opacity-70 mr-2">codeforces.com/</span>
                          <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none flex-1"
                            value={formData.candidateProfile.codeforcesUsername}
                            onChange={(e) => handleInputChange('candidateProfile', 'codeforcesUsername', e.target.value)}
                            placeholder="username"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium">CodeChef Username</label>
                        <div className={`flex items-center ${inputClass} px-4 py-3 rounded-lg border focus-within:ring-2 focus-within:ring-blue-500 transition-colors duration-200`}>
                          <span className="opacity-70 mr-2">codechef.com/</span>
                          <input
                            type="text"
                            className="bg-transparent border-none focus:outline-none flex-1"
                            value={formData.candidateProfile.codechefUsername}
                            onChange={(e) => handleInputChange('candidateProfile', 'codechefUsername', e.target.value)}
                            placeholder="username"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block mb-2 font-medium">Preferred Roles (comma separated)</label>
                      <input
                        type="text"
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                        value={formData.candidateProfile.preferredRoles.join(', ')}
                        onChange={(e) => handleArrayInputChange('candidateProfile', 'preferredRoles', e.target.value)}
                        placeholder="Frontend Developer, Full Stack Developer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-medium">Expertise (comma separated)</label>
                      <input
                        type="text"
                        className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                        value={formData.interviewerProfile.expertise.join(', ')}
                        onChange={(e) => handleArrayInputChange('interviewerProfile', 'expertise', e.target.value)}
                        placeholder="Algorithms, System Design, React"
                      />
                      <p className="mt-1 text-sm opacity-70">Areas you are comfortable interviewing candidates in</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block mb-2 font-medium">Company</label>
                        <input
                          type="text"
                          className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                          value={formData.interviewerProfile.company}
                          onChange={(e) => handleInputChange('interviewerProfile', 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block mb-2 font-medium">Position</label>
                        <input
                          type="text"
                          className={`${inputClass} w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                          value={formData.interviewerProfile.position}
                          onChange={(e) => handleInputChange('interviewerProfile', 'position', e.target.value)}
                          placeholder="Senior Developer"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="font-medium">Availability Schedule</label>
                        <button
                          type="button"
                          onClick={addScheduleSlot}
                          className={`${secondaryButtonClass} px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition-colors duration-200`}
                        >
                          <Plus className="w-4 h-4" /> Add Slot
                        </button>
                      </div>
                      
                      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {formData.interviewerProfile.availabilitySchedule.map((slot, index) => (
                          <div key={index} className={`grid grid-cols-7 gap-3 mb-3 p-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border`}>
                            <div className="col-span-3">
                              <label className="text-xs block mb-1 opacity-70">Day</label>
                              <select
                                className={`${inputClass} w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                                value={slot.day}
                                onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                              >
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                  <option key={day} value={day}>{day}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="col-span-2">
                              <label className="text-xs block mb-1 opacity-70">Start Time</label>
                              <input
                                type="time"
                                className={`${inputClass} w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                                value={slot.startTime}
                                onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)}
                              />
                            </div>
                            
                            <div className="col-span-2">
                              <label className="text-xs block mb-1 opacity-70">End Time</label>
                              <div className="flex items-center">
                                <input
                                  type="time"
                                  className={`${inputClass} w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                                  value={slot.endTime}
                                  onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)}
                                />
                                {formData.interviewerProfile.availabilitySchedule.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeScheduleSlot(index)}
                                    className={`ml-2 ${isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'} rounded-full p-1 hover:bg-red-500 hover:bg-opacity-10 transition-colors duration-200`}
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="pt-6">
                  <button
                    type="submit"
                    className={`${buttonClass} w-full px-6 py-4 rounded-xl font-medium text-lg transition-colors duration-200`}
                  >
                    Submit Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelectionForm;