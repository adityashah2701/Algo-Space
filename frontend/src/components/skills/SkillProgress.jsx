import React from 'react';


export const SkillsProgress = ({
  skillsProgress,
  isDarkMode,
  cardClass,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h2 className="text-xl font-semibold mb-6">Skills Progress</h2>
      <div className="space-y-6">
        {Object.entries(skillsProgress).map(([skill, progress]) => (
          <div key={skill}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{skill}</span>
              <span className="text-sm opacity-70">{progress}%</span>
            </div>
            <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="h-full rounded-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};