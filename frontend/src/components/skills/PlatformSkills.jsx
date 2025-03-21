import React from 'react';
import { Github, Code2, Terminal } from 'lucide-react';



export const PlatformStats= ({
  platformStats,
  isDarkMode,
  cardClass,
}) => {
  return (
    <div className={`${cardClass} rounded-2xl p-6 border`}>
      <h2 className="text-xl font-semibold mb-6">Platform Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-5 h-5" />
            <span className="font-medium">GitHub</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Repositories</span>
              <span className="font-medium">{platformStats.github.repositories}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Contributions</span>
              <span className="font-medium">{platformStats.github.contributions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Stars</span>
              <span className="font-medium">{platformStats.github.stars}</span>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-5 h-5" />
            <span className="font-medium">LeetCode</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Problems Solved</span>
              <span className="font-medium">{platformStats.leetcode.solved}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Contest Rating</span>
              <span className="font-medium">{platformStats.leetcode.contest_rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Ranking</span>
              <span className="font-medium">Top {platformStats.leetcode.ranking}</span>
            </div>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-xl`}>
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-5 h-5" />
            <span className="font-medium">CodeForces</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Rating</span>
              <span className="font-medium">{platformStats.codeforces.rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Contests</span>
              <span className="font-medium">{platformStats.codeforces.contests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm opacity-70">Problems Solved</span>
              <span className="font-medium">{platformStats.codeforces.problems_solved}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};