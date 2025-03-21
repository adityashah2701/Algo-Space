import React from 'react';
import { Edit3, FileText, Upload, X } from 'lucide-react';



export const ProfileOverview = ({
  profile,
  isDarkMode,
  cardClass,
  secondaryButtonClass,
  buttonClass,
  onSkillRemove,
  onSkillAdd,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-xl font-semibold">Profile Overview</h2>
        <button className={`${secondaryButtonClass} p-2 rounded-lg`}>
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm opacity-70 mb-1">Name</label>
          <p className="font-medium">{profile.name}</p>
        </div>
        <div>
          <label className="block text-sm opacity-70 mb-1">Email</label>
          <p className="font-medium">{profile.email}</p>
        </div>
        <div>
          <label className="block text-sm opacity-70 mb-1">Gender</label>
          <p className="font-medium">{profile.gender}</p>
        </div>
        <div>
          <label className="block text-sm opacity-70 mb-1">Experience</label>
          <p className="font-medium">{profile.experience} years</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm opacity-70 mb-2">Resume</label>
        <div className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm">resume.pdf</span>
          </div>
          <button className={`${buttonClass} px-3 py-1 rounded text-white text-sm`}>
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm opacity-70 mb-2">Skills</label>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span 
              key={skill}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-1 rounded-full text-sm flex items-center gap-2`}
            >
              {skill}
              <button 
                onClick={() => onSkillRemove(skill)}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add skill..."
            onKeyPress={onSkillAdd}
            className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} px-3 py-1 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>
    </div>
  );
};