
import { InterviewList } from '@/components/CandidateDashboard/Interview/Interview';
import { Header } from '@/components/CandidateDashboard/layout/Header';
import { NavigationTabs } from '@/components/CandidateDashboard/navigation/Navigation';
import { PlatformProfiles } from '@/components/CandidateDashboard/profile/PlatformProfile';
import { ProfileOverview } from '@/components/CandidateDashboard/profile/ProfileOverview';
import { QuickStats } from '@/components/Sidebar/QuickStats';
import { SuggestedResources } from '@/components/Sidebar/SuggestedResources';
import { PlatformStats } from '@/components/skills/PlatformSkills';
import { SkillsProgress } from '@/components/skills/SkillProgress';
import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { useAuthStore } from '@/store/useAuthStore';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
const { theme, setTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Mock data - In a real app, this would come from your backend

  const [profile, setProfile] = useState({
    name: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    gender: user?.gender,
    profileImage: user?.profilePicture || "./default.jpeg",
    skills: user?.candidateProfile?.skills || [],
    experience: user?.experience,
    resumeUrl: '',
    githubUsername: user?.candidateProfile?.githubUsername,
    leetcodeUsername: user?.candidateProfile?.leetcodeUsername,
    codeforcesUsername: user?.candidateProfile?.codeforcesUsername,
    codechefUsername: user?.candidateProfile?.codechefUsername,
    preferredRoles: user?.candidateProfile?.preferredRoles || []
  });

  const [interviews, setInterviews] = useState({
    upcoming: [
      {
        id: 1,
        interviewer: 'Sarah Smith',
        company: 'TechCorp',
        date: '2024-03-25T14:00:00',
        status: 'confirmed',
        type: 'Technical'
      },
      {
        id: 2,
        interviewer: 'Mike Brown',
        company: 'DevInc',
        date: '2024-03-28T15:30:00',
        status: 'pending',
        type: 'System Design'
      }
    ],
    past: [
      {
        id: 3,
        interviewer: 'Emily White',
        company: 'CodeLabs',
        date: '2024-03-10T11:00:00',
        feedback: 'Strong problem-solving skills. Could improve system design knowledge.',
        rating: 4,
        type: 'Technical'
      }
    ]
  });

  const [skillsProgress] = useState({
    'Problem Solving': 85,
    'System Design': 70,
    'Data Structures': 90,
    'Algorithms': 80,
    'Frontend Development': 95
  });

  const [platformStats] = useState({
    github: {
      repositories: 25,
      contributions: 847,
      stars: 124
    },
    leetcode: {
      solved: 342,
      contest_rating: 1856,
      ranking: '15%'
    },
    codeforces: {
      rating: 1742,
      contests: 28,
      problems_solved: 456
    }
  });

  const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
  const cardClass = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const buttonClass = isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const secondaryButtonClass = isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';
  
  const tabClass = (tab) => 
    `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
      activeTab === tab 
        ? `${buttonClass} text-white` 
        : `${secondaryButtonClass} ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
    }`;
  const handleSkillRemove = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillAdd = (event) => {
    if (event.key === 'Enter') {
      const input = event.target ;
      const newSkill = input.value.trim();
      if (newSkill && !profile.skills.includes(newSkill)) {
        setProfile(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill]
        }));
        input.value = '';
      }
    }
  };

  const handleProfileUpdate = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className={`min-h-screen ${themeClass} transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto p-6">
        <Header
          profile={profile}
          isDarkMode={isDarkMode}
          onThemeToggle={() => setIsDarkMode(!isDarkMode)}
          secondaryButtonClass={secondaryButtonClass}
        />

        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabClass={tabClass}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'profile' && (
              <>
                <ProfileOverview
                  profile={profile}
                  isDarkMode={isDarkMode}
                  cardClass={cardClass}
                  secondaryButtonClass={secondaryButtonClass}
                  buttonClass={buttonClass}
                  onSkillRemove={handleSkillRemove}
                  onSkillAdd={handleSkillAdd}
                />
                <PlatformProfiles
                  profile={profile}
                  isDarkMode={isDarkMode}
                  cardClass={cardClass}
                  onProfileUpdate={handleProfileUpdate}
                />
              </>
            )}

            {activeTab === 'interviews' && (
              <>
                <InterviewList
                  title="Upcoming Interviews"
                  interviews={interviews.upcoming}
                  type="upcoming"
                  isDarkMode={isDarkMode}
                  cardClass={cardClass}
                />
                <InterviewList
                  title="Past Interviews"
                  interviews={interviews.past}
                  type="past"
                  isDarkMode={isDarkMode}
                  cardClass={cardClass}
                />
              </>
            )}

            {activeTab === 'skills' && (
              <>
                <SkillsProgress
                  skillsProgress={skillsProgress}
                  isDarkMode={isDarkMode}
                  cardClass={cardClass}
                />
                <PlatformStats
                  platformStats={platformStats}
                  isDarkMode={isDarkMode}
                  cardClass={cardClass}
                />
              </>
            )}
          </div>

          <div className="space-y-8">
            <QuickStats
              upcomingInterviews={interviews.upcoming.length}
              skillsCount={profile.skills.length}
              isDarkMode={isDarkMode}
              cardClass={cardClass}
            />
            <SuggestedResources
              isDarkMode={isDarkMode}
              cardClass={cardClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;