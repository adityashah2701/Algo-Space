import React from 'react';
import { User } from 'lucide-react';


export const Header = ({
  profile,
  isDarkMode,
  onThemeToggle,
  secondaryButtonClass,
}) => {
  return (
    <header className="flex justify-between items-center py-6 mb-8">
      <div className="flex items-center gap-4">
        <img
          src={profile.profileImage}
          alt={profile.name}
          className="w-12 h-12 rounded-full border-2 border-blue-500"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm opacity-70">{profile.email}</p>
        </div>
      </div>
      <button 
        onClick={onThemeToggle}
        className={`${secondaryButtonClass} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200`}
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </header>
  );
};