import React from 'react';


export const SuggestedResources = ({
  isDarkMode,
  cardClass,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h2 className="text-xl font-semibold mb-4">Suggested Resources</h2>
      <div className="space-y-3">
        <a 
          href="#"
          className={`block ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-4 rounded-xl transition-colors duration-200`}
        >
          <h3 className="font-medium">System Design Fundamentals</h3>
          <p className="text-sm opacity-70 mt-1">Learn the basics of system design</p>
        </a>
        <a 
          href="#"
          className={`block ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-4 rounded-xl transition-colors duration-200`}
        >
          <h3 className="font-medium">Advanced JavaScript Patterns</h3>
          <p className="text-sm opacity-70 mt-1">Master JS design patterns</p>
        </a>
        <a 
          href="#"
          className={`block ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-4 rounded-xl transition-colors duration-200`}
        >
          <h3 className="font-medium">Data Structures Deep Dive</h3>
          <p className="text-sm opacity-70 mt-1">Advanced DSA concepts</p>
        </a>
      </div>
    </div>
  );
};