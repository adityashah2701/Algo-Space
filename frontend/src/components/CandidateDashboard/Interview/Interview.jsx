import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { Star } from '@/components/shared/Star';




export const InterviewList = ({
  title,
  interviews,
  type,
  isDarkMode,
  cardClass,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h2 className="text-xl font-semibold mb-6">{title}</h2>
      <div className="space-y-4">
        {interviews.map(interview => (
          type === 'upcoming' ? (
            <div 
              key={interview.id}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl flex items-center justify-between`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  interview.status === 'confirmed' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {interview.status === 'confirmed' ? <CheckCircle2 /> : <Clock />}
                </div>
                <div>
                  <h3 className="font-medium">{interview.company}</h3>
                  <p className="text-sm opacity-70">
                    {format(new Date(interview.date), 'MMM d, yyyy h:mm a')}
                  </p>
                  <p className="text-sm mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      {interview.type}
                    </span>
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 opacity-50" />
            </div>
          ) : (
            <div 
              key={interview.id}
              className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium">{interview.company}</h3>
                  <p className="text-sm opacity-70">
                    {format(new Date(interview.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {interview.type}
                </span>
              </div>
              <p className="text-sm opacity-90">{interview.feedback}</p>
              {interview.rating && (
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      filled={i < interview.rating}
                      isDark={isDarkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
};