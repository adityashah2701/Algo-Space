import React from 'react';
import { Github, Code2, Terminal, Coffee } from 'lucide-react';



export const PlatformProfiles = ({
  profile,
  isDarkMode,
  cardClass,
  onProfileUpdate,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h2 className="text-xl font-semibold mb-6">Platform Profiles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <Github className="w-5 h-5" />
            <span className="font-medium">GitHub</span>
          </div>
          <input
            type="text"
            value={profile.githubUsername}
            onChange={(e) => onProfileUpdate('githubUsername', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            placeholder="GitHub username"
          />
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <Code2 className="w-5 h-5" />
            <span className="font-medium">LeetCode</span>
          </div>
          <input
            type="text"
            value={profile.leetcodeUsername}
            onChange={(e) => onProfileUpdate('leetcodeUsername', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            placeholder="LeetCode username"
          />
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <Terminal className="w-5 h-5" />
            <span className="font-medium">CodeForces</span>
          </div>
          <input
            type="text"
            value={profile.codeforcesUsername}
            onChange={(e) => onProfileUpdate('codeforcesUsername', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            placeholder="CodeForces username"
          />
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-3">
            <Coffee className="w-5 h-5" />
            <span className="font-medium">CodeChef</span>
          </div>
          <input
            type="text"
            value={profile.codechefUsername}
            onChange={(e) => onProfileUpdate('codechefUsername', e.target.value)}
            className={`w-full px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
            placeholder="CodeChef username"
          />
        </div>
      </div>
    </div>
  );
};