import axios from 'axios';

const JUDGE0_API = 'https://judge0-ce.p.rapidapi.com';

// Language IDs for Judge0 API
const LANGUAGE_IDS = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  csharp: 51,      // C#
  cpp: 54,         // C++
  ruby: 72,        // Ruby
  php: 68,         // PHP
  go: 60,          // Go
};




export const executeCode = async (code, language) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': '164fbbef41mshbb22e31e20a580dp12ab7ejsnb37feb969706',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    };

    // Create submission
    const submission= {
      source_code: code,
      language_id: LANGUAGE_IDS[language],
      stdin: ''
    };

    const submissionResponse = await axios.post(
      `${JUDGE0_API}/submissions`,
      submission,
      { headers }
    );

    const { token } = submissionResponse.data;

    // Wait for a moment to allow processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get submission result
    const resultResponse = await axios.get(
      `${JUDGE0_API}/submissions/${token}`,
      { headers }
    );

    const result = resultResponse.data;

    // Format the output
    let output = '';
    
    if (result.compile_output) {
      output += `Compilation Output:\n${result.compile_output}\n\n`;
    }
    
    if (result.stdout) {
      output += `Program Output:\n${result.stdout}\n`;
    }
    
    if (result.stderr) {
      output += `Error Output:\n${result.stderr}\n`;
    }
    
    if (result.message) {
      output += `Message:\n${result.message}\n`;
    }

    output += `\nStatus: ${result.status.description}`;

    return output;
  } catch (error) {
    console.error('Code execution error:', error);
    return `Error executing code: ${error.message}`;
  }
};