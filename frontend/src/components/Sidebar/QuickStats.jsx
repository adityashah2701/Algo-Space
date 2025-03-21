import React from 'react';



export const QuickStats= ({
  upcomingInterviews,
  skillsCount,
  isDarkMode,
  cardClass,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
      <div className="space-y-4">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <span className="text-sm opacity-70">Upcoming Interviews</span>
          <p className="text-2xl font-bold mt-1">{upcomingInterviews}</p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <span className="text-sm opacity-70">Skills</span>
          <p className="text-2xl font-bold mt-1">{skillsCount}</p>
        </div>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <span className="text-sm opacity-70">Interview Success Rate</span>
          <p className="text-2xl font-bold mt-1">85%</p>
        </div>
      </div>
    </div>
  );
};