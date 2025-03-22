import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/Store/useAuthStore';

const ProfileCompletion = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
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
    const { completeProfile } = useAuthStore();

    useEffect(() => {
        // Fetch user data from localStorage
        const fetchUserData = () => {
            try {
                const userData = localStorage.getItem('user');
                if (!userData) {
                    toast.error('User not found. Please login again.');
                    navigate('/login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                // Pre-fill form data if available
                const role = parsedUser.role;
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

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [profile, field] = name.split('.');
        
        setFormData(prev => ({
            ...prev,
            [profile]: { ...prev[profile], [field]: value }
        }));
    };

    // Handle array inputs (comma-separated values)
    const handleArrayInputChange = (e) => {
        const { name, value } = e.target;
        const [profile, field] = name.split('.');
        
        const arrayValues = value.split(',').map(item => item.trim()).filter(item => item);
        
        setFormData(prev => ({
            ...prev,
            [profile]: { ...prev[profile], [field]: arrayValues }
        }));
    };

    // Handle availability schedule changes (for interviewer)
    const handleScheduleChange = (index, field, value) => {
        const updatedSchedule = [...formData.interviewer.availabilitySchedule];
        updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
        
        setFormData(prev => ({
            ...prev,
            interviewer: { ...prev.interviewer, availabilitySchedule: updatedSchedule }
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            // Get the user's role
            const role = user.role;
            
            // Create proper data structure for the API
            const apiData = {
                userId: user._id
            };
            
            // Add role-specific data
            if (role === 'candidate') {
                // Get form values and properly convert arrays
                const skills = formData.candidate.skills;
                const preferredRoles = formData.candidate.preferredRoles;
                
                apiData.resumeUrl = formData.candidate.resumeUrl;
                apiData.skills = Array.isArray(skills) ? skills : 
                                (typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : []);
                apiData.experience = formData.candidate.experience;
                apiData.githubUsername = formData.candidate.githubUsername;
                apiData.leetcodeUsername = formData.candidate.leetcodeUsername;
                apiData.codeforcesUsername = formData.candidate.codeforcesUsername;
                apiData.codechefUsername = formData.candidate.codechefUsername;
                apiData.preferredRoles = Array.isArray(preferredRoles) ? preferredRoles : 
                                        (typeof preferredRoles === 'string' ? preferredRoles.split(',').map(r => r.trim()) : []);
            } else if (role === 'interviewer') {
                // Get form values and properly convert arrays
                const expertise = formData.interviewer.expertise;
                
                apiData.expertise = Array.isArray(expertise) ? expertise : 
                                   (typeof expertise === 'string' ? expertise.split(',').map(e => e.trim()) : []);
                apiData.company = formData.interviewer.company;
                apiData.position = formData.interviewer.position;
                apiData.availabilitySchedule = formData.interviewer.availabilitySchedule;
            }
            
            console.log('Submitting data:', apiData);
            
            // Call the API with prepared data
            const res = await completeProfile(apiData);
            console.log(res)
            if (res.success === true) {
                navigate("/dashboard");
            }
            toast.success('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user || !user.role) {
        return <div className="min-h-screen flex items-center justify-center">Invalid user data. Please login again.</div>;
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-200">
            <div className="max-w-6xl mx-auto p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="border rounded-xl p-8 shadow-lg">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold">
                                {user.role === 'candidate' ? 'Candidate Profile' : 'Interviewer Profile'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {user.role === 'candidate' ? (
                                // Candidate Form
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 font-medium">Resume URL</label>
                                        <input
                                            type="url"
                                            name="candidate.resumeUrl"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            value={formData.candidate.resumeUrl || ''}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/resume.pdf"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Skills (comma separated)</label>
                                        <input
                                            type="text"
                                            name="candidate.skills"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            value={Array.isArray(formData.candidate.skills) ? formData.candidate.skills.join(', ') : ''}
                                            onChange={handleArrayInputChange}
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
                                            value={formData.candidate.experience || ''}
                                            onChange={handleInputChange}
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
                                            value={formData.candidate.githubUsername || ''}
                                            onChange={handleInputChange}
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
                                                value={formData.candidate.leetcodeUsername || ''}
                                                onChange={handleInputChange}
                                                placeholder="username"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">CodeForces Username</label>
                                            <input
                                                type="text"
                                                name="candidate.codeforcesUsername"
                                                className="w-full px-4 py-3 rounded-lg border"
                                                value={formData.candidate.codeforcesUsername || ''}
                                                onChange={handleInputChange}
                                                placeholder="username"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2 font-medium">CodeChef Username</label>
                                            <input
                                                type="text"
                                                name="candidate.codechefUsername"
                                                className="w-full px-4 py-3 rounded-lg border"
                                                value={formData.candidate.codechefUsername || ''}
                                                onChange={handleInputChange}
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
                                            value={Array.isArray(formData.candidate.preferredRoles) ? formData.candidate.preferredRoles.join(', ') : ''}
                                            onChange={handleArrayInputChange}
                                            placeholder="Frontend Developer, Full Stack Engineer"
                                            required
                                        />
                                    </div>
                                </div>
                            ) : (
                                // Interviewer Form
                                <div className="space-y-6">
                                    <div>
                                        <label className="block mb-2 font-medium">Company</label>
                                        <input
                                            type="text"
                                            name="interviewer.company"
                                            className="w-full px-4 py-3 rounded-lg border"
                                            value={formData.interviewer.company || ''}
                                            onChange={handleInputChange}
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
                                            value={formData.interviewer.position || ''}
                                            onChange={handleInputChange}
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
                                            value={Array.isArray(formData.interviewer.expertise) ? formData.interviewer.expertise.join(', ') : ''}
                                            onChange={handleArrayInputChange}
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
                                                        value={slot.startTime} 
                                                        onChange={(e) => handleScheduleChange(index, 'startTime', e.target.value)} 
                                                        className="w-full px-3 py-2 rounded-lg border" 
                                                    />
                                                </div>
                                                <div className="md:col-span-1">
                                                    <label className="block text-xs mb-1">End</label>
                                                    <input 
                                                        type="time" 
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