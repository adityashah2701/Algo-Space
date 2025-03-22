import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

function LeetCodeSkillAnalyzer() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    setUserData(null);
    setAssessment(null);
    
    try {
      // Using Vite's built-in proxy to handle CORS
      console.log(`Fetching data for username: ${username}`);
      
      const query = `
        query userProfileCalendar($username: String!, $year: Int) {
          matchedUser(username: $username) {
            userCalendar(year: $year) {
              activeYears
              streak
              totalActiveDays
              dccBadges {
                timestamp
                badge {
                  name
                  icon
                }
              }
              submissionCalendar
            }
          }
        }
      `;
      
      const response = await fetch('/api/leetcode/graphql/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          variables: {
            username: username.trim(),
            year: new Date().getFullYear()
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.data || !result.data.matchedUser) {
        throw new Error('User not found or no data available');
      }
      
      if (!result.data || !result.data.matchedUser) {
        throw new Error('User not found or no data available');
      }
      
      setUserData(result);
      
      // Calculate skill assessment
      const assessmentResult = scoreUserSkills(result);
      setAssessment(assessmentResult);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  // Function to score user skills based on LeetCode data
  const scoreUserSkills = (userData) => {
    const userCalendar = userData.data.matchedUser.userCalendar;
    const submissionCalendar = JSON.parse(userCalendar.submissionCalendar);
    
    // Extract metrics
    const streak = userCalendar.streak;
    const totalActiveDays = userCalendar.totalActiveDays;
    const numBadges = userCalendar.dccBadges.length;
    
    // Calculate submission statistics
    const submissions = Object.values(submissionCalendar);
    const totalSubmissions = submissions.reduce((sum, count) => sum + count, 0);
    const maxSubmissionsInOneDay = Math.max(...submissions);
    const averageSubmissionsPerActiveDay = totalSubmissions / totalActiveDays;
    
    // Calculate intensity metrics
    const intenseDays = submissions.filter(count => count >= 10).length;
    const percentIntenseDays = (intenseDays / Object.keys(submissionCalendar).length) * 100;
    
    // Calculate monthly activity
    const monthlyActivity = {};
    Object.keys(submissionCalendar).forEach(timestamp => {
      const date = new Date(Number(timestamp) * 1000);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyActivity[yearMonth]) {
        monthlyActivity[yearMonth] = 0;
      }
      
      monthlyActivity[yearMonth] += submissionCalendar[timestamp];
    });
    
    // Calculate improvement trend
    const monthlySubmissions = Object.entries(monthlyActivity)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, value]) => value);
    
    const recentMonths = monthlySubmissions.slice(-3); // Last 3 months
    const olderMonths = monthlySubmissions.slice(0, -3);

    const recentAvg = recentMonths.length > 0 ? 
      recentMonths.reduce((sum, val) => sum + val, 0) / recentMonths.length : 0;
    const olderAvg = olderMonths.length > 0 ? 
      olderMonths.reduce((sum, val) => sum + val, 0) / olderMonths.length : 0;

    const improvementRate = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;
    
    // Calculate scores
    const streakScore = Math.min(20, streak / 2);
    const activeFrequencyScore = Math.min(15, (totalActiveDays / 365) * 30);
    const submissionScore = Math.min(15, (totalSubmissions / 1000) * 15);
    const intensityScore = Math.min(10, (percentIntenseDays / 20) * 10);
    const improvementScore = Math.min(20, improvementRate > 0 ? Math.min(20, improvementRate / 5) : 0);
    const badgeScore = Math.min(10, numBadges * 10);
    const maxSubmissionScore = Math.min(10, (maxSubmissionsInOneDay / 50) * 10);
    
    // Calculate total score
    const totalScore = 
      streakScore + 
      activeFrequencyScore + 
      submissionScore + 
      intensityScore +
      improvementScore +
      badgeScore + 
      maxSubmissionScore;
    
    // Determine skill level
    let skillLevel = "Beginner";
    if (totalScore >= 90) {
      skillLevel = "Expert";
    } else if (totalScore >= 75) {
      skillLevel = "Advanced";
    } else if (totalScore >= 50) {
      skillLevel = "Intermediate";
    } else if (totalScore >= 25) {
      skillLevel = "Beginner+";
    }
    
    // Prepare data for visualizations
    const monthlyData = Object.entries(monthlyActivity)
      .map(([month, count]) => ({
        month,
        submissions: count
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
    
    const scoreBreakdown = [
      { name: "Streak", score: streakScore, fullMark: 20 },
      { name: "Activity", score: activeFrequencyScore, fullMark: 15 },
      { name: "Volume", score: submissionScore, fullMark: 15 },
      { name: "Intensity", score: intensityScore, fullMark: 10 },
      { name: "Improvement", score: improvementScore, fullMark: 20 },
      { name: "Badges", score: badgeScore, fullMark: 10 },
      { name: "Max Output", score: maxSubmissionScore, fullMark: 10 }
    ];
    
    // Generate recommendations
    const recommendations = [];
    
    if (streakScore < 10) {
      recommendations.push("Improve consistency by maintaining a longer coding streak.");
    }
    
    if (activeFrequencyScore < 7) {
      recommendations.push("Increase frequency of coding days to build stronger coding habits.");
    }
    
    if (submissionScore < 7) {
      recommendations.push("Focus on completing more coding problems overall.");
    }
    
    if (intensityScore < 5) {
      recommendations.push("Try to have more high-intensity sessions (10+ submissions per day).");
    }
    
    if (improvementScore < 10) {
      recommendations.push("Work on improving your monthly submission rate over time.");
    }
    
    if (badgeScore < 5) {
      recommendations.push("Participate in more daily coding challenges to earn badges.");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("Great work! Continue maintaining your excellent coding practice.");
    }
    
    return {
      metrics: {
        streak,
        totalActiveDays,
        totalSubmissions,
        maxSubmissionsInOneDay,
        averageSubmissionsPerActiveDay: parseFloat(averageSubmissionsPerActiveDay.toFixed(2)),
        intenseDays,
        percentIntenseDays: percentIntenseDays.toFixed(1),
        improvementRate: improvementRate.toFixed(1)
      },
      scores: {
        streakScore: parseFloat(streakScore.toFixed(1)),
        activeFrequencyScore: parseFloat(activeFrequencyScore.toFixed(1)),
        submissionScore: parseFloat(submissionScore.toFixed(1)),
        intensityScore: parseFloat(intensityScore.toFixed(1)),
        improvementScore: parseFloat(improvementScore.toFixed(1)),
        badgeScore: parseFloat(badgeScore.toFixed(1)),
        maxSubmissionScore: parseFloat(maxSubmissionScore.toFixed(1)),
        totalScore: Math.round(totalScore * 10) / 10
      },
      skillLevel,
      monthlyData,
      scoreBreakdown,
      recommendations
    };
  };

  // Generate skill level badge color (with lighter backgrounds for better contrast with black text)
  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Expert": return "bg-green-200";
      case "Advanced": return "bg-blue-200";
      case "Intermediate": return "bg-yellow-200";
      case "Beginner+": return "bg-orange-200";
      default: return "bg-gray-200";
    }
  };

  // Render the UI
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          LeetCode Skill Analyzer
        </h1>
        <p className="mt-2 text-gray-600">
          Analyze LeetCode activity and get insights on coding skills
        </p>
      </header>
      
      {/* Username Input Form */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <label htmlFor="username" className="block text-lg font-medium text-gray-700">
              Enter LeetCode Username
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 
                text-lg px-4 py-3 text-black"
                required
                disabled={loading}
              />
              <button
                type="submit"
                className={`inline-flex items-center px-6 py-3 border border-gray-300 text-lg font-medium rounded-md shadow-sm text-black ${
                  loading ? 'bg-blue-200' : 'bg-blue-300 hover:bg-blue-400'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500">
              Enter a valid LeetCode username to analyze their coding activity and generate a skill assessment.
            </p>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-100 text-red-800 rounded-lg text-center">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-1">Please check the username and try again.</p>
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading && !error && (
        <div className="flex justify-center items-center my-12">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      )}
      
      {/* Assessment Results */}
      {assessment && !loading && !error && (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-5xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-1 text-black">LeetCode Skill Assessment</h1>
            <div className="flex justify-center items-center">
              <div className={`text-black ${getSkillLevelColor(assessment.skillLevel)} rounded-full px-4 py-1 text-lg font-semibold`}>
                {assessment.skillLevel} Coder
              </div>
              <div className="ml-3 text-2xl font-bold text-gray-700">
                {assessment.scores.totalScore}/100
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Score Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Skill Score Breakdown</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius="70%" data={assessment.scoreBreakdown}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={30} domain={[0, 20]} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="#93c5fd"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Maximum"
                      dataKey="fullMark"
                      stroke="#9ca3af"
                      fill="#d1d5db"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Activity */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Monthly Submission Activity</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assessment.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#93c5fd" stroke="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Consistency</h3>
              <div className="flex justify-between items-center text-black">
                <div>
                  <div className="text-sm  text-black">Current Streak</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.streak} days</div>
                </div>
                <div>
                  <div className="text-sm  text-black">Active Days</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.totalActiveDays}</div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Productivity</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-black">Total Submissions</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.totalSubmissions}</div>
                </div>
                <div>
                  <div className="text-sm text-black">Max Daily</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.maxSubmissionsInOneDay}</div>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Intensity</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-black">High-Intensity Days</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.intenseDays}</div>
                </div>
                <div>
                  <div className="text-sm text-black">Percentage</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.percentIntenseDays}%</div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-black">Growth</h3>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-black">Recent Change</div>
                  <div className={`text-2xl font-bold ${Number(assessment.metrics.improvementRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {assessment.metrics.improvementRate}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-black">Avg per Day</div>
                  <div className="text-2xl font-bold text-black">{assessment.metrics.averageSubmissionsPerActiveDay}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Skill Development Recommendations</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {assessment.recommendations.map((recommendation, index) => (
                <li key={index} className="text-black">{recommendation}</li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Score Breakdown</h2>
              <div className="space-y-3">
                {Object.entries(assessment.scores).map(([key, value]) => {
                  if (key === 'totalScore') return null;
                  
                  // Format the key for display
                  const formattedKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase())
                    .replace(/Score$/, '');
                  
                  // Get the maximum value for this score component
                  const scoreItem = assessment.scoreBreakdown.find(item => 
                    item.name.toLowerCase() === formattedKey.toLowerCase()
                  );
                  const maxValue = scoreItem ? scoreItem.fullMark : 20;
                  
                  return (
                    <div key={key}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{formattedKey}</span>
                        <span className="text-sm font-medium text-gray-700">{value}/{maxValue}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-400 h-2.5 rounded-full" 
                          style={{ width: `${(value / maxValue) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Achievements & Badges</h2>
              <div className="flex flex-col items-center justify-center h-full">
                {userData.data.matchedUser.userCalendar.dccBadges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {userData.data.matchedUser.userCalendar.dccBadges.map((badge, index) => (
                      <div key={index} className="text-center p-4 bg-white rounded-lg shadow">
                        <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center bg-yellow-100 rounded-full">
                          <span role="img" aria-label="badge" className="text-3xl">🏆</span>
                        </div>
                        <div className="font-medium text-gray-900">{badge.badge.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(badge.timestamp * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <span role="img" aria-label="trophy" className="text-5xl mb-4 block">🏆</span>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Badges Yet</h3>
                    <p className="text-gray-500">
                      Complete daily challenges to earn badges and improve your score!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-8">
            Assessment based on LeetCode activity data. Scores are calculated using an algorithm that evaluates consistency, volume, intensity, and achievements.
          </div>
        </div>
      )}
      
      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} LeetCode Skill Analyzer | All data is sourced from LeetCode's public API</p>
      </footer>
    </div>
  );
}

export default LeetCodeSkillAnalyzer;