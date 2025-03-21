import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeProvider';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

const ProfileCompletion = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    // Form data with separate objects for candidate and interviewer profiles
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
const {completeProfile} = useAuthStore();
    // Load user data from localStorage on component mount
    useEffect(() => {
        const fetchUserData = () => {
            try {
                // Get user data from localStorage
                const userData = localStorage.getItem('user');
                if (!userData) {
                    toast.error('User not found. Please login again.');
                    navigate('/login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                // Get selected role from localStorage
                const role = localStorage.getItem('selectedRole');
                if (!role) {
                    toast.error('Please select a role first.');
                    navigate('/register/role');
                    return;
                }
                
                setSelectedRole(role);

                // If user already has profile data, pre-fill the form
                if (parsedUser[role]) {
                    setFormData(prev => ({
                        ...prev,
                        [role]: { ...prev[role], ...parsedUser[role] }
                    }));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                toast.error('Error loading user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [profile, field] = name.split('.');
        setFormData(prev => ({
            ...prev,
            [profile]: { ...prev[profile], [field]: value }
        }));
    };

    // Handle multi-select skills/expertise (arrays)
    const handleArrayInputChange = (profile, field, value) => {
        // Split comma-separated values into array
        const arrayValues = value.split(',').map(item => item.trim()).filter(item => item);
        
        setFormData(prev => ({
            ...prev,
            [profile]: { ...prev[profile], [field]: arrayValues }
        }));
    };

    // Handle availability schedule changes for interviewers
    const handleScheduleChange = (index, field, value) => {
        const updatedSchedule = [...formData.interviewer.availabilitySchedule];
        updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
        setFormData(prev => ({
            ...prev,
            interviewer: { ...prev.interviewer, availabilitySchedule: updatedSchedule }
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
            interviewer: { ...prev.interviewer, availabilitySchedule: updatedSchedule }
        }));
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            // Use FormData to collect form data
            const fd = new FormData(e.target);
            fd.append("userId",user._id)
           const res = await completeProfile(fd);
           if(res.user){
            navigate("/dashboard");
           }

            // Simulating API call success
            setTimeout(() => {
                toast.success('Profile updated successfully');
                navigate('/dashboard');
                setLoading(false);
            }, 1000);
            
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-200">
            <div className="max-w-6xl mx-auto p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="border rounded-xl p-8 shadow-lg">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">
                                {selectedRole === 'candidate' ? 'Candidate Profile' : 'Interviewer Profile'}
                            </h2>
                            <button 
                                type="button"
                                onClick={() => navigate('/register/role')} 
                                className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors duration-200 border"
                            >
                                <ChevronDown className="w-4 h-4" /> Change Role
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {selectedRole === 'candidate' ? (
                                // Candidate Profile Form
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 font-medium">Resume URL</label>
                                        <input
                                            type="url"
                                            name="candidate.resumeUrl"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.candidate.resumeUrl}
                                            placeholder="https://example.com/resume.pdf"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            name="candidate.skills"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.candidate.skills.join(', ')}
                                            placeholder="JavaScript, React, Node.js"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Experience (years)</label>
                                        <input
                                            type="number"
                                            name="candidate.experience"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.candidate.experience}
                                            placeholder="3"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">GitHub Username</label>
                                        <input
                                            type="text"
                                            name="candidate.githubUsername"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.candidate.githubUsername}
                                            placeholder="username"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block mb-2 font-medium">LeetCode Username</label>
                                            <input
                                                type="text"
                                                name="candidate.leetcodeUsername"
                                                className="w-full px-4 py-3 rounded-lg border"
                                                defaultValue={formData.candidate.leetcodeUsername}
                                                placeholder="username"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">CodeForces Username</label>
                                            <input
                                                type="text"
                                                name="candidate.codeforcesUsername"
                                                className="w-full px-4 py-3 rounded-lg border"
                                                defaultValue={formData.candidate.codeforcesUsername}
                                                placeholder="username"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">CodeChef Username</label>
                                            <input
                                                type="text"
                                                name="candidate.codechefUsername"
                                                className="w-full px-4 py-3 rounded-lg border"
                                                defaultValue={formData.candidate.codechefUsername}
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Preferred Roles (comma separated)</label>
                                        <input
                                            type="text"
                                            name="candidate.preferredRoles"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.candidate.preferredRoles.join(', ')}
                                            placeholder="Frontend Developer, Full Stack Engineer"
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                // Interviewer Profile Form
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 font-medium">Company</label>
                                        <input
                                            type="text"
                                            name="interviewer.company"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.interviewer.company}
                                            placeholder="Company Name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Position</label>
                                        <input
                                            type="text"
                                            name="interviewer.position"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.interviewer.position}
                                            placeholder="Senior Developer"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Expertise (comma separated)</label>
                                        <input
                                            type="text"
                                            name="interviewer.expertise"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            defaultValue={formData.interviewer.expertise.join(', ')}
                                            placeholder="Algorithms, System Design, React"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="font-medium">Availability Schedule</label>
                                            <button 
                                                type="button" 
                                                onClick={addScheduleSlot} 
                                                className="px-3 py-1 rounded-lg text-sm flex items-center gap-1 border"
                                            >
                                                <Plus className="w-4 h-4" /> Add Slot
                                            </button>
                                        </div>
                                        {formData.interviewer.availabilitySchedule.map((slot, index) => (
                                            <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-3 mb-3 p-3 rounded-xl border">
                                                <div className="md:col-span-3">
                                                    <select 
                                                        name={`interviewer.schedule[${index}].day`}
                                                        value={slot.day} 
                                                        onChange={(e) => handleScheduleChange(index, 'day', e.target.value)} 
                                                        className="w-full px-3 py-2 rounded-lg border"
                                                    >
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                                                            <option key={day} value={day}>{day}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="block text-xs mb-1">Start</label>
                                                    <input 
                                                        type="time" 
                                                        name={`interviewer.schedule[${index}].startTime`}
                                                        value={slot.startTime} 
                                                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} 
                                                        className="w-full px-3 py-2 rounded-lg border" 
                                                    />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="block text-xs mb-1">End</label>
                                                    <input 
                                                        type="time" 
                                                        name={`interviewer.schedule[${index}].endTime`}
                                                        value={slot.endTime} 
                                                        onChange={(e) => handleScheduleChange(index, 'endTime', e.target.value)} 
                                                        className="w-full px-3 py-2 rounded-lg border" 
                                                    />
                                                </div>
                                                <div className="md:col-span-1 flex items-end justify-center">
                                                    {formData.interviewer.availabilitySchedule.length > 1 && (
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeScheduleSlot(index)} 
                                                            className="px-2 py-2 rounded text-destructive border border-destructive"
                                                        >
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            <button 
                                type="submit" 
                                className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Complete Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletion;