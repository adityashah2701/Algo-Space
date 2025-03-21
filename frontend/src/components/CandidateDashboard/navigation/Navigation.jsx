import React from 'react';
import { User, Calendar, Award } from 'lucide-react';


export const NavigationTabs= ({
  activeTab,
  setActiveTab,
  tabClass,
}) => {
  return (
    <nav className="flex gap-2 mb-8">
      <button 
        onClick={() => setActiveTab('profile')}
        className={tabClass('profile')}
      >
        <User className="w-4 h-4 inline mr-2" />
        Profile
      </button>
      <button 
        onClick={() => setActiveTab('interviews')}
        className={tabClass('interviews')}
      >
        <Calendar className="w-4 h-4 inline mr-2" />
        Interviews
      </button>
      <button 
        onClick={() => setActiveTab('skills')}
        className={tabClass('skills')}
      >
        <Award className="w-4 h-4 inline mr-2" />
        Skills
      </button>
    </nav>
  );
};