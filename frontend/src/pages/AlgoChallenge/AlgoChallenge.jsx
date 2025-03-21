import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Code, ChevronRight, CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';

// Mock API for algorithm challenges
const API_URL = 'https://api.example.com/challenges';

// Define supported programming languages
const SUPPORTED_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', defaultCode: 'function solution(params) {\n  // Write your code here\n  \n}' },
  { id: 'python', name: 'Python', defaultCode: 'def solution(params):\n  # Write your code here\n  \n  pass' },
  { id: 'java', name: 'Java', defaultCode: 'class Solution {\n  public static Object solution(Object params) {\n    // Write your code here\n    return null;\n  }\n}' },
  { id: 'cpp', name: 'C++', defaultCode: '#include <vector>\n\nclass Solution {\npublic:\n  auto solution(auto params) {\n    // Write your code here\n    \n  }\n};' },
  { id: 'typescript', name: 'TypeScript', defaultCode: 'function solution(params: any): any {\n  // Write your code here\n  \n}' }
];

// Mock challenges data
const mockChallenges = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `
      Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      You can return the answer in any order.
      
      Example 1:
      Input: nums = [2,7,11,15], target = 9
      Output: [0,1]
      Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
      
      Example 2:
      Input: nums = [3,2,4], target = 6
      Output: [1,2]
      
      Example 3:
      Input: nums = [3,3], target = 6
      Output: [0,1]
      
      Constraints:
      2 <= nums.length <= 10^4
      -10^9 <= nums[i] <= 10^9
      -10^9 <= target <= 10^9
      Only one valid answer exists.
    `,
    testCases: [
      { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1] },
      { input: { nums: [3,2,4], target: 6 }, expected: [1,2] },
      { input: { nums: [3,3], target: 6 }, expected: [0,1] }
    ],
    hints: [
      "Consider using a hash map to store values you've seen and their indices.",
      "For each element, check if the complement (target - current) exists in the hash map."
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    description: `
      Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
      
      An input string is valid if:
      1. Open brackets must be closed by the same type of brackets.
      2. Open brackets must be closed in the correct order.
      3. Every close bracket has a corresponding open bracket of the same type.
      
      Example 1:
      Input: s = "()"
      Output: true
      
      Example 2:
      Input: s = "()[]{}"
      Output: true
      
      Example 3:
      Input: s = "(]"
      Output: false
      
      Constraints:
      1 <= s.length <= 10^4
      s consists of parentheses only '()[]{}'.
    `,
    testCases: [
      { input: { s: "()" }, expected: true },
      { input: { s: "()[]{}" }, expected: true },
      { input: { s: "(]" }, expected: false },
      { input: { s: "([)]" }, expected: false },
      { input: { s: "{[]}" }, expected: true }
    ],
    hints: [
      "Consider using a stack data structure.",
      "When encountering an opening bracket, push it onto the stack.",
      "When encountering a closing bracket, check if it matches the top of the stack."
    ]
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    description: `
      Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.
      
      A subarray is a contiguous part of an array.
      
      Example 1:
      Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
      Output: 6
      Explanation: [4,-1,2,1] has the largest sum = 6.
      
      Example 2:
      Input: nums = [1]
      Output: 1
      
      Example 3:
      Input: nums = [5,4,-1,7,8]
      Output: 23
      
      Constraints:
      1 <= nums.length <= 10^5
      -10^4 <= nums[i] <= 10^4
    `,
    testCases: [
      { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expected: 6 },
      { input: { nums: [1] }, expected: 1 },
      { input: { nums: [5,4,-1,7,8] }, expected: 23 }
    ],
    hints: [
      "Consider using Kadane's algorithm.",
      "Keep track of the maximum sum ending at each position and the global maximum sum."
    ]
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    description: `
      Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.
      
      Example 1:
      Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
      Output: [[1,6],[8,10],[15,18]]
      Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].
      
      Example 2:
      Input: intervals = [[1,4],[4,5]]
      Output: [[1,5]]
      Explanation: Intervals [1,4] and [4,5] are considered overlapping.
      
      Constraints:
      1 <= intervals.length <= 10^4
      intervals[i].length == 2
      0 <= starti <= endi <= 10^4
    `,
    testCases: [
      { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expected: [[1,6],[8,10],[15,18]] },
      { input: { intervals: [[1,4],[4,5]] }, expected: [[1,5]] }
    ],
    hints: [
      "Sort the intervals by their start values.",
      "Iterate through the sorted intervals and merge overlapping ones."
    ]
  },
  {
    id: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: `
      Given a string s, return the longest palindromic substring in s.
      
      Example 1:
      Input: s = "babad"
      Output: "bab" or "aba"
      Explanation: Both "bab" and "aba" are valid longest palindromic substrings.
      
      Example 2:
      Input: s = "cbbd"
      Output: "bb"
      
      Example 3:
      Input: s = "a"
      Output: "a"
      
      Example 4:
      Input: s = "ac"
      Output: "a"
      
      Constraints:
      1 <= s.length <= 1000
      s consist of only digits and English letters.
    `,
    testCases: [
      { input: { s: "babad" }, expected: ["bab", "aba"] },
      { input: { s: "cbbd" }, expected: ["bb"] },
      { input: { s: "a" }, expected: ["a"] },
      { input: { s: "ac" }, expected: ["a", "c"] }
    ],
    hints: [
      "Consider expanding around centers.",
      "Each center can be either a single character or between two characters.",
      "Dynamic programming can also be used to solve this problem."
    ]
  },
  {
    id: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    description: `
      Given an m x n grid of characters board and a string word, return true if word exists in the grid.
      
      The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.
      
      Example 1:
      Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
      Output: true
      
      Example 2:
      Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
      Output: true
      
      Example 3:
      Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
      Output: false
      
      Constraints:
      m == board.length
      n = board[i].length
      1 <= m, n <= 6
      1 <= word.length <= 15
      board and word consists of only lowercase and uppercase English letters.
    `,
    testCases: [
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCCED" }, expected: true },
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "SEE" }, expected: true },
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCB" }, expected: false }
    ],
    hints: [
      "Consider using backtracking with DFS.",
      "Mark visited cells to avoid using the same cell more than once."
    ]
  }
];

// Mock function to evaluate code
const evaluateCode = (code, language, testCases) => {
  return new Promise((resolve) => {
    // In a real implementation, this would be handled by a server-side code execution engine
    
    // Simulate processing time
    setTimeout(() => {
      // Create mock results
      const results = testCases.map((testCase, index) => {
        const passed = Math.random() > 0.3; // Randomly decide if test passed (70% chance)
        const executionTime = Math.random() * 50 + 5; // Random execution time between 5ms and 55ms
        
        return {
          testCaseId: index,
          input: JSON.stringify(testCase.input),
          expected: JSON.stringify(testCase.expected),
          actual: passed ? JSON.stringify(testCase.expected) : JSON.stringify("Wrong output"),
          passed,
          executionTime
        };
      });
      
      // Calculate performance metrics
      const totalTests = results.length;
      const passedTests = results.filter(r => r.passed).length;
      const avgExecutionTime = results.reduce((sum, r) => sum + r.executionTime, 0) / totalTests;
      
      resolve({
        results,
        metrics: {
          totalTests,
          passedTests,
          passRate: (passedTests / totalTests) * 100,
          avgExecutionTime
        }
      });
    }, 1500); // Simulate 1.5 second processing time
  });
};

// Difficulty badge component
const DifficultyBadge = ({ difficulty }) => {
  const colorMap = {
    'Easy': 'bg-green-100 text-green-800 hover:bg-green-100',
    'Medium': 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    'Hard': 'bg-red-100 text-red-800 hover:bg-red-100'
  };

  return (
    <Badge variant="outline" className={`${colorMap[difficulty]} font-medium`}>
      {difficulty}
    </Badge>
  );
};

function AlgorithmChallengesPlatform() {
  // State variables
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [code, setCode] = useState(SUPPORTED_LANGUAGES[0].defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load challenges
  useEffect(() => {
    // In a real app, you'd fetch from an API
    const fetchChallenges = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChallenges(mockChallenges);
        setSelectedChallenge(mockChallenges[0]);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load challenges. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Reset code when changing language
  useEffect(() => {
    if (selectedLanguage) {
      setCode(selectedLanguage.defaultCode);
      setResults(null);
      setMetrics(null);
    }
  }, [selectedLanguage]);

  // Reset code when changing challenge
  useEffect(() => {
    if (selectedChallenge && selectedLanguage) {
      setCode(selectedLanguage.defaultCode);
      setResults(null);
      setMetrics(null);
      setShowHints(false);
    }
  }, [selectedChallenge]);

  // Handle language change
  const handleLanguageChange = (value) => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.id === value);
    if (lang) {
      setSelectedLanguage(lang);
    }
  };

  // Handle challenge change
  const handleChallengeChange = (challengeId) => {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setSelectedChallenge(challenge);
    }
  };

  // Handle code change
  const handleCodeChange = (value) => {
    setCode(value);
  };

  // Handle run code
  const handleRunCode = async () => {
    if (!selectedChallenge || !code.trim()) return;

    setIsRunning(true);
    setResults(null);
    setMetrics(null);

    try {
      // In a real app, this would send the code to a backend for evaluation
      const evalResults = await evaluateCode(
        code,
        selectedLanguage.id,
        selectedChallenge.testCases
      );

      setResults(evalResults.results);
      setMetrics(evalResults.metrics);
    } catch (err) {
      setError('Failed to run code. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-lg">Loading challenges...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button variant="outline" className="mt-4 w-full" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Code className="w-6 h-6 mr-2" />
          Algorithm Challenges
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Language:</span>
            <Select 
              value={selectedLanguage.id} 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <SelectItem key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Theme:</span>
            <Select 
              value={editorTheme} 
              onValueChange={(value) => setEditorTheme(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vs">Light</SelectItem>
                <SelectItem value="vs-dark">Dark</SelectItem>
                <SelectItem value="hc-black">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Font Size:</span>
            <Input
              type="number"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-16"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Challenges sidebar */}
        <div className="w-64 bg-background border-r overflow-hidden flex flex-col">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-lg">Challenges</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2">
              {challenges.map(challenge => (
                <Button
                  key={challenge.id}
                  variant={selectedChallenge && selectedChallenge.id === challenge.id ? "secondary" : "ghost"}
                  className="w-full justify-start mb-1 p-3 h-auto"
                  onClick={() => handleChallengeChange(challenge.id)}
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium">{challenge.title}</span>
                    <div className="mt-1">
                      <DifficultyBadge difficulty={challenge.difficulty} />
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedChallenge ? (
            <Tabs defaultValue="problem" className="flex-1 flex flex-col overflow-hidden">
              <div className="bg-background border-b">
                <div className="px-4 py-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{selectedChallenge.title}</h2>
                    <DifficultyBadge difficulty={selectedChallenge.difficulty} />
                  </div>
                  <TabsList>
                    <TabsTrigger value="problem">Problem</TabsTrigger>
                    <TabsTrigger value="solution">Solution</TabsTrigger>
                    {results && <TabsTrigger value="results">Results</TabsTrigger>}
                  </TabsList>
                </div>
              </div>

              <TabsContent value="problem" className="flex-1 p-4 overflow-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Problem Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-line">
                      {selectedChallenge.description}
                    </div>
                    
                    {selectedChallenge.hints && selectedChallenge.hints.length > 0 && (
                      <Collapsible className="mt-6 border rounded-md p-4">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="flex w-full justify-between p-0 h-auto">
                            <span className="font-semibold flex items-center">
                              <Info className="w-4 h-4 mr-2" />
                              Hints
                            </span>
                            <ChevronRight className="w-4 h-4 transition-transform ui-open:rotate-90" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2">
                          <ul className="ml-6 list-disc space-y-2">
                            {selectedChallenge.hints.map((hint, index) => (
                              <li key={index} className="text-muted-foreground">
                                <span className="font-medium text-foreground">Hint {index + 1}:</span> {hint}
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="solution" className="flex-1 flex flex-col overflow-hidden p-4">
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-hidden">
                    <Editor
                      height="100%"
                      language={selectedLanguage.id}
                      value={code}
                      theme={editorTheme}
                      onChange={handleCodeChange}
                      options={{
                        fontSize: fontSize,
                        minimap: { enabled: true },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        wordWrap: 'on',
                        lineNumbers: 'on'
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2 p-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setCode(selectedLanguage.defaultCode)}
                      disabled={isRunning}
                    >
                      Reset Code
                    </Button>
                    <Button
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="min-w-24"
                    >
                      {isRunning ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Running
                        </>
                      ) : 'Run Code'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {results && (
                <TabsContent value="results" className="flex-1 overflow-auto p-4">
                  <div className="space-y-6">
                    {/* Results metrics */}
                    {metrics && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">Pass Rate</span>
                                <span className="text-sm font-medium">{metrics.passRate.toFixed(1)}%</span>
                              </div>
                              <Progress value={metrics.passRate} 
                                className={
                                  metrics.passRate >= 80 ? "text-green-600" :
                                  metrics.passRate >= 50 ? "text-amber-600" : "text-red-600"
                                }
                              />
                            </div>
                            
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-3xl font-bold">
                                {metrics.passedTests}/{metrics.totalTests}
                              </div>
                              <div className="text-sm text-muted-foreground">Tests Passed</div>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-3xl font-bold">
                                {metrics.avgExecutionTime.toFixed(2)}ms
                              </div>
                              <div className="text-sm text-muted-foreground">Avg. Execution Time</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {/* Test case results */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Test Results</CardTitle>
                        <CardDescription>
                          {metrics && metrics.passedTests === metrics.totalTests ? 
                            'All tests passed successfully!' : 
                            `${metrics?.passedTests || 0} out of ${metrics?.totalTests || 0} tests passed.`
                          }
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.map((result, index) => (
                            <div
                              key={index}
                              className={`border rounded-lg overflow-hidden ${
                                result.passed ? 'border-green-200' : 'border-red-200'
                              }`}
                            >
                              <div className={`flex items-center justify-between px-4 py-3 ${
                                result.passed ? 'bg-green-50' : 'bg-red-50'
                              }`}>
                                <div className="flex items-center">
                                  {result.passed ? 
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" /> :
                                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                  }
                                  <span className="font-medium">Test Case {index + 1}</span>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {result.executionTime.toFixed(2)}ms
                                </div>
                              </div>
                              
                              <div className="p-4 space-y-3 text-sm">
                                <div>
                                  <div className="font-medium mb-1">Input:</div>
                                  <div className="bg-muted p-2 rounded font-mono">{result.input}</div>
                                </div>
                                
                                <div>
                                  <div className="font-medium mb-1">Expected Output:</div>
                                  <div className="bg-muted p-2 rounded font-mono">{result.expected}</div>
                                </div>
                                
                                <div>
                                  <div className="font-medium mb-1">Your Output:</div>
                                  <div className={`p-2 rounded font-mono ${
                                    result.passed ? 'bg-green-50' : 'bg-red-50'
                                  }`}>
                                    {result.actual}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>Select a challenge from the list to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t p-4 text-center text-sm text-muted-foreground">
        Practice makes perfect! Keep coding to improve your algorithmic skills.
      </footer>
    </div>
  );
}

export default AlgorithmChallengesPlatform;