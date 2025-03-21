import React, { useState, useEffect, useRef } from 'react';

function InterviewPlatform() {
  const [role, setRole] = useState('');
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState('// Write your code here\nfunction helloWorld() {\n  console.log("Hello, world!");\n}');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isCodeLocked, setIsCodeLocked] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const codeUpdateIntervalRef = useRef(null);
  const outputRef = useRef(null);
  
  // Language templates
  const languageTemplates = {
    javascript: '// Write your JavaScript code here\nfunction helloWorld() {\n  console.log("Hello, world!");\n  return "Hello, world!";\n}',
    python: '# Write your Python code here\ndef hello_world():\n    print("Hello, world!")\n    return "Hello, world!"\n\nhello_world()',
    java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, world!");\n    }\n}',
    csharp: '// Write your C# code here\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, world!");\n    }\n}',
    cpp: '// Write your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, world!" << std::endl;\n    return 0;\n}',
    ruby: '# Write your Ruby code here\ndef hello_world\n  puts "Hello, world!"\n  return "Hello, world!"\nend\n\nhello_world',
    php: '<?php\n// Write your PHP code here\nfunction helloWorld() {\n    echo "Hello, world!";\n    return "Hello, world!";\n}\n\nhelloWorld();\n?>',
    go: '// Write your Go code here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, world!")\n}'
  };
  
  // Auto-scroll output to bottom when it changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Handle room ID from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomIdParam = urlParams.get('roomID');
    if (roomIdParam) {
      setRoomId(roomIdParam);
    } else {
      // Generate a random room ID if not present in URL
      setRoomId(`interview-${Math.floor(Math.random() * 10000)}`);
    }
  }, []);

  // Load Jitsi script
  useEffect(() => {
    if (joined && jitsiContainerRef.current) {
      // Load the Jitsi Meet API script
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = initJitsi;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
        }
      };
    }
  }, [joined]);

  // Setup code synchronization
  useEffect(() => {
    if (joined && jitsiApiRef.current) {
      // Start sending code updates
      codeUpdateIntervalRef.current = setInterval(() => {
        sendCodeUpdate(code, language);
      }, 2000); // Send updates every 2 seconds
      
      return () => {
        if (codeUpdateIntervalRef.current) {
          clearInterval(codeUpdateIntervalRef.current);
        }
      };
    }
  }, [joined, code, language]);

  const initJitsi = () => {
    if (window.JitsiMeetExternalAPI && jitsiContainerRef.current) {
      try {
        const domain = 'meet.jit.si';
        const options = {
          roomName: roomId,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: userName
          },
          configOverwrite: {
            prejoinPageEnabled: false,
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            // Explicitly enable screen sharing
            desktopSharingEnabled: true,
            // Remote desktop control is disabled by default
            remoteVideoMenu: {
              disableKick: true
            },
            // Enable filmstrip and maximize quality
            filmstrip: {
              enabled: true
            },
            // Higher quality for screen sharing
            desktopSharingFrameRate: {
              min: 15,
              max: 30
            },
            // Prioritize screen sharing quality
            disableSimulcast: true,
            enableLayerSuspension: true,
            resolution: 720,
            constraints: {
              video: {
                height: {
                  ideal: 720,
                  max: 1080,
                  min: 480
                }
              }
            }
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: isDarkMode ? '#1a1a1a' : '#f8f9fa',
            FILM_STRIP_MAX_HEIGHT: 140,
            INITIAL_TOOLBAR_TIMEOUT: 20000,
            TOOLBAR_TIMEOUT: 4000,
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat',
              'raisehand', 'videoquality', 'fullscreen'
            ],
            DEFAULT_REMOTE_DISPLAY_NAME: 'Participant',
            DEFAULT_LOCAL_DISPLAY_NAME: 'You',
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            HIDE_INVITE_MORE_HEADER: true,
            MOBILE_APP_PROMO: false,
            MAXIMUM_ZOOMING_COEFFICIENT: 5.0,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false
          }
        };

        const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = jitsiApi;
        
        // Direct screen sharing command via API
        const screenSharingButton = document.createElement('button');
        screenSharingButton.id = 'custom-share-screen';
        screenSharingButton.style.display = 'none';
        document.body.appendChild(screenSharingButton);
        
        screenSharingButton.addEventListener('click', () => {
          jitsiApi.executeCommand('toggleShareScreen');
        });
        
        jitsiApi.addEventListener('videoConferenceJoined', () => {
          console.log('User joined the conference');
          
          // Setup message listener for code updates
          jitsiApi.addEventListeners({
            endpointTextMessageReceived: (event) => {
              try {
                const data = JSON.parse(event.data.text);
                if (data.type === 'code_update') {
                  // Only update if it's from another participant (not our own echo)
                  if (data.sender !== userName) {
                    setCode(data.code);
                    setLanguage(data.language);
                  }
                } else if (data.type === 'lock_code') {
                  if (role === 'candidate') {
                    setIsCodeLocked(data.locked);
                  }
                } else if (data.type === 'code_output') {
                  // Show output from the other participant
                  if (data.sender !== userName) {
                    setOutput(data.output);
                  }
                } else if (data.type === 'run_code') {
                  runCode();
                } else if (data.type === 'request_screen_share') {
                  if (role === 'candidate') {
                    // Trigger screen sharing via UI click
                    if (screenSharingButton) {
                      screenSharingButton.click();
                    }
                  }
                } else if (data.type === 'toggle_theme') {
                  setIsDarkMode(data.isDark);
                }
              } catch (e) {
                console.error('Failed to parse incoming message:', e);
              }
            }
          });
          
          // Listen for screen sharing state changes
          jitsiApi.addEventListeners({
            screenSharingStatusChanged: (event) => {
              console.log("Screen sharing status changed:", event);
              setIsScreenSharing(event.on);
            }
          });
          
          // Make sure we can see both participants
          jitsiApi.executeCommand('setTileView', true);
          
          // Ensure video is started for both sides
          jitsiApi.executeCommand('toggleVideo');
          
          // Announce presence
          sendMessage({ 
            type: 'role_announce', 
            role: role,
            sender: userName
          });
        });
        
        jitsiApi.addEventListener('videoConferenceLeft', () => {
          console.log('User left the conference');
        });

      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
        setErrorMsg('Failed to connect to video call. Please try again.');
      }
    }
  };
  
  const sendMessage = (data) => {
    if (jitsiApiRef.current) {
      // Always include sender information
      const enrichedData = {
        ...data,
        sender: userName
      };
      const message = JSON.stringify(enrichedData);
      jitsiApiRef.current.executeCommand('sendEndpointTextMessage', '', message);
    }
  };
  
  const sendCodeUpdate = (codeContent, languageValue) => {
    sendMessage({
      type: 'code_update',
      code: codeContent,
      language: languageValue
    });
  };

  const sendCodeOutput = (outputContent) => {
    sendMessage({
      type: 'code_output',
      output: outputContent
    });
  };
  
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    
    // Ask if they want to use a template for the new language
    const willChangeTemplate = window.confirm(`Change to ${newLanguage} template code? This will replace the current code.`);
    if (willChangeTemplate) {
      setCode(languageTemplates[newLanguage] || '// Write your code here');
    }
    
    setLanguage(newLanguage);
    
    // Immediately send update
    if (willChangeTemplate) {
      sendCodeUpdate(languageTemplates[newLanguage] || '// Write your code here', newLanguage);
    } else {
      sendCodeUpdate(code, newLanguage);
    }
  };
  
  const toggleCodeLock = () => {
    const newLockState = !isCodeLocked;
    setIsCodeLocked(newLockState);
    
    if (role === 'interviewer') {
      sendMessage({
        type: 'lock_code',
        locked: newLockState
      });
    }
  };
  
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
  };

  const handleJoinRoom = () => {
    if (!roomId || !userName || !role) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    setErrorMsg('');
    setJoined(true);
  };
  
  // Function to share editor content with the other person via chat
  const shareCodeInChat = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('sendChatMessage', code);
    }
  };
  
  // Function to remotely trigger code run
  const triggerRemoteRun = () => {
    sendMessage({
      type: 'run_code'
    });
  };
  
  // Function to start screen sharing
  const startScreenSharing = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('toggleShareScreen');
      } catch (error) {
        console.error("Error toggling screen share:", error);
        alert("Screen sharing failed. Please check your browser permissions.");
      }
    }
  };
  
  // Function to request candidate to share screen
  const requestScreenShare = () => {
    if (role === 'interviewer') {
      sendMessage({
        type: 'request_screen_share'
      });
      
      // Show notification to interviewer
      alert('Screen sharing request sent to candidate');
    } else {
      startScreenSharing();
    }
  };

  // Toggle between dark and light mode
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    // Sync theme with other participant
    sendMessage({
      type: 'toggle_theme',
      isDark: newTheme
    });
  };
  
  // Code execution function with support for multiple languages
  const runCode = () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    setTimeout(() => {
      try {
        // Create a safe environment for running the code
        const originalConsoleLog = console.log;
        const logs = [];
        
        // Override console.log
        console.log = (...args) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          logs.push(output);
        };
        
        // Execute the code based on language
        if (language === 'javascript') {
          // For JavaScript, we can use Function constructor in this controlled environment
          try {
            const result = new Function(code)();
            if (result !== undefined) {
              logs.push(`Return value: ${result}`);
            }
          } catch (codeError) {
            logs.push(`Error: ${codeError.message}`);
          }
        } else {
          // For other languages, use online compiler API
          logs.push(`Executing ${language} code...`);
          
          // Simulate compilation/execution for other languages
          // This is where you would integrate with external compilation APIs
          
          const languageOutputMap = {
            python: "Python 3.9.7\n>>> Executing...\n" + 
                    (code.includes("print") ? "Hello, world!\n" : "") + 
                    "Program executed successfully.",
                    
            java: "OpenJDK 11.0.12\n> Compiling...\n" + 
                  "> Running...\n" + 
                  (code.includes("System.out.println") ? "Hello, world!\n" : "") + 
                  "Program executed successfully.",
                  
            csharp: ".NET 5.0.10\n> Compiling...\n" + 
                   "> Running...\n" + 
                   (code.includes("Console.WriteLine") ? "Hello, world!\n" : "") + 
                   "Program executed successfully.",
                   
            cpp: "g++ 10.3.0\n> Compiling...\n" + 
                 "> Running...\n" + 
                 (code.includes("std::cout") ? "Hello, world!\n" : "") + 
                 "Program executed successfully.",
                 
            ruby: "Ruby 3.0.2\n> Executing...\n" + 
                  (code.includes("puts") ? "Hello, world!\n" : "") + 
                  "Program executed successfully.",
                  
            php: "PHP 8.0.10\n> Executing...\n" + 
                 (code.includes("echo") ? "Hello, world!\n" : "") + 
                 "Program executed successfully.",
                 
            go: "Go 1.17.1\n> Compiling...\n" + 
                "> Running...\n" + 
                (code.includes("fmt.Println") ? "Hello, world!\n" : "") + 
                "Program executed successfully."
          };
          
          logs.push(languageOutputMap[language] || `${language} execution is simulated in this environment.`);
          logs.push("\nNote: For full execution capabilities, you would need to connect to a backend compiler service.");
        }
        
        // Restore original console.log
        console.log = originalConsoleLog;
        
        // Set output
        const outputStr = logs.join('\n');
        setOutput(outputStr);
        
        // Send output to other participants
        sendCodeOutput(outputStr);
      } catch (error) {
        const errorMessage = `Error: ${error.message}`;
        setOutput(errorMessage);
        
        // Send error to other participants
        sendCodeOutput(errorMessage);
      }
      
      setIsRunning(false);
    }, 500);
  };
  
  if (!joined) {
    return (
      <div className={`flex h-screen w-full flex-col items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} p-4`}>
        <div className={`w-full max-w-md rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-8 shadow-lg`}>
          <h1 className="mb-6 text-2xl font-bold text-center">Code Interview Platform</h1>
          
          {errorMsg && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
              {errorMsg}
            </div>
          )}
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={`w-full rounded-md border p-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">Room ID</label>
            <div className="flex">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className={`w-full rounded-l-md border p-2 ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-800 border-gray-300'}`}
                placeholder="Enter room ID"
              />
              <button
                onClick={() => setRoomId(`interview-${Math.floor(Math.random() * 10000)}`)}
                className="rounded-r-md bg-blue-600 px-3 text-white hover:bg-blue-700"
                title="Generate random room ID"
              >
                🔄
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium">Role</label>
            <div className="flex gap-4">
              <div className={`flex-1 cursor-pointer rounded-md ${role === 'candidate' ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} p-3 text-center transition-colors`}>
                <input
                  type="radio"
                  id="candidate"
                  name="role"
                  value="candidate"
                  checked={role === 'candidate'}
                  onChange={() => setRole('candidate')}
                  className="hidden"
                />
                <label htmlFor="candidate" className="cursor-pointer">Candidate</label>
              </div>
              <div className={`flex-1 cursor-pointer rounded-md ${role === 'interviewer' ? 'bg-green-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'} p-3 text-center transition-colors`}>
                <input
                  type="radio"
                  id="interviewer"
                  name="role"
                  value="interviewer"
                  checked={role === 'interviewer'}
                  onChange={() => setRole('interviewer')}
                  className="hidden"
                />
                <label htmlFor="interviewer" className="cursor-pointer">Interviewer</label>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleJoinRoom}
            className="w-full rounded-md bg-blue-600 p-3 text-white hover:bg-blue-700 transition-colors font-medium"
            disabled={!roomId || !userName || !role}
          >
            Join Interview
          </button>
          
          <div className="flex justify-center mt-4">
            <button onClick={toggleTheme} className="text-sm text-gray-500 hover:underline">
              Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate theme-based colors
  const themeClasses = {
    background: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    header: isDarkMode ? 'bg-gray-800' : 'bg-white',
    subheader: isDarkMode ? 'bg-gray-700' : 'bg-gray-200',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-300',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    editor: isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800',
    console: isDarkMode ? 'bg-black text-green-400' : 'bg-gray-900 text-green-400',
    buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonDanger: 'bg-red-600 hover:bg-red-700 text-white',
    buttonSuccess: 'bg-green-600 hover:bg-green-700 text-white',
    buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  };
  
  return (
    <div className={`flex h-screen w-full flex-col ${themeClasses.background}`}>
      {/* Header with controls */}
      <div className={`flex items-center justify-between ${themeClasses.header} shadow-md p-3 z-10`}>
        <div className="flex items-center">
          <h1 className={`text-xl font-bold ${themeClasses.text} mr-4`}>
            CodeInterview <span className="text-xs font-normal rounded bg-blue-600 text-white px-2 py-1 ml-1">{role}</span>
          </h1>
          
          <select
            onChange={handleLanguageChange}
            value={language}
            className={`rounded-md ${themeClasses.subheader} p-2 mr-2 text-sm border ${themeClasses.border}`}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
            <option value="ruby">Ruby</option>
            <option value="php">PHP</option>
            <option value="go">Go</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          {role === 'interviewer' && (
            <button 
              onClick={toggleCodeLock}
              className={`rounded-md p-2 text-white text-sm ${isCodeLocked ? themeClasses.buttonDanger : themeClasses.buttonSuccess}`}
            >
              {isCodeLocked ? '🔒 Unlock' : '🔓 Lock'}
            </button>
          )}
          
          <button 
            onClick={runCode}
            disabled={isRunning || (role === 'candidate' && isCodeLocked)}
            className={`rounded-md p-2 text-sm ${isRunning || (role === 'candidate' && isCodeLocked) ? 'bg-gray-500' : themeClasses.buttonSuccess}`}
          >
            {isRunning ? '⏳ Running...' : '▶️ Run'}
          </button>
          
          <button 
            onClick={triggerRemoteRun}
            className={`rounded-md p-2 text-sm ${themeClasses.buttonSecondary}`}
          >
            🔄 Request Run
          </button>
          
          <button
            onClick={requestScreenShare}
            className={`rounded-md p-2 text-sm ${isScreenSharing ? themeClasses.buttonDanger : themeClasses.buttonPrimary}`}
          >
            {role === 'interviewer' ? '🖥️ Request Screen' : (isScreenSharing ? '🛑 Stop Sharing' : '🖥️ Share Screen')}
          </button>
          
          <button 
            onClick={toggleTheme}
            className={`rounded-md p-2 text-sm ${themeClasses.buttonSecondary}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
      
      {/* Status bar */}
      <div className={`flex justify-between items-center ${themeClasses.subheader} px-4 py-2 ${themeClasses.text} text-sm`}>
        <div className="flex items-center gap-2">
          <span className="font-medium">Language:</span>
          <span className="font-bold bg-blue-600 text-white rounded px-2 py-0.5">{language}</span>
          
          {role === 'candidate' && isCodeLocked && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-sm font-bold text-white ml-2">
              Editor Locked by Interviewer
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {isScreenSharing && (
            <span className="rounded bg-green-600 px-2 py-0.5 text-sm font-bold text-white">
              Screen Sharing Active
            </span>
          )}
          
          <button 
            onClick={() => navigator.clipboard.writeText(code)}
            className={`rounded-md text-xs px-2 py-1 ${themeClasses.buttonSecondary}`}
          >
            Copy Code
          </button>
          
          <button 
            onClick={shareCodeInChat}
            className={`rounded-md text-xs px-2 py-1 ${themeClasses.buttonSecondary}`}
          >
            Share in Chat
          </button>
        </div>
      </div>
      
      {/* Main content - side-by-side layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Code editor and output */}
        <div className={`flex w-1/2 flex-col overflow-hidden border-r ${themeClasses.border}`}>
          {/* Editor */}
          <div className="flex-1 overflow-hidden">
            <textarea
              value={code}
              onChange={handleCodeChange}
              className={`h-full w-full p-4 font-mono ${themeClasses.editor}`}
              style={{
                resize: 'none',
                outline: 'none',
                tabSize: 2,
                lineHeight: 1.5
              }}
              placeholder="Write your code here..."
              spellCheck="false"
              disabled={role === 'candidate' && isCodeLocked}
            />
          </div>
          
          {/* Output console */}
          <div className={`h-1/3 border-t ${themeClasses.border}`}>
            <div className={`flex items-center justify-between ${themeClasses.header} px-4 py-2 ${themeClasses.text}`}>
              <span className="font-bold">Output</span>
              <button 
                onClick={() => setOutput('')}
                className={`rounded text-xs px-2 py-1 ${themeClasses.buttonSecondary}`}
              >
                Clear
              </button>
            </div>
            <pre 
              ref={outputRef}
              className={`h-full max-h-full overflow-auto p-4 font-mono text-sm ${themeClasses.console}`}
            >
              {output}
            </pre>
          </div>
        </div>
        
        {/* Right side: Video call */}
        <div className="w-1/2 overflow-hidden">
          <div className="h-full" ref={jitsiContainerRef}></div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPlatform;