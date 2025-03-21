import React, { useState, useEffect, useRef } from 'react';
import { executeCode } from "../../services/codeExecution";

// Language templates with proper syntax for each language
const languageTemplates = {
  javascript: `// Write your JavaScript code here
function helloWorld() {
  console.log("Hello, world!");
  return "Hello, world!";
}

helloWorld();`,
  python: `# Write your Python code here
def hello_world():
    print("Hello, world!")
    return "Hello, world!"

hello_world()`,
  java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}`,
  csharp: `// Write your C# code here
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, world!");
    }
}`,
  cpp: `// Write your C++ code here
#include <iostream>

int main() {
    std::cout << "Hello, world!" << std::endl;
    return 0;
}`,
  ruby: `# Write your Ruby code here
def hello_world
  puts "Hello, world!"
  return "Hello, world!"
end

hello_world`,
  php: `<?php
// Write your PHP code here
function helloWorld() {
    echo "Hello, world!";
    return "Hello, world!";
}

helloWorld();
?>`,
  go: `// Write your Go code here
package main

import "fmt"

func main() {
    fmt.Println("Hello, world!")
}`
};

function InterviewPlatform() {
  const [role, setRole] = useState('');
  const [roomId, setRoomId] = useState('');
  const [userName, setUserName] = useState('');
  const [joined, setJoined] = useState(false);
  const [code, setCode] = useState(languageTemplates.javascript);
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
      setRoomId(`interview-${Math.floor(Math.random() * 10000)}`);
    }
  }, []);

  // Load Jitsi script
  useEffect(() => {
    if (joined && jitsiContainerRef.current) {
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
      codeUpdateIntervalRef.current = setInterval(() => {
        sendCodeUpdate(code, language);
      }, 2000);
      
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
            desktopSharingEnabled: true,
            remoteVideoMenu: {
              disableKick: true
            },
            filmstrip: {
              enabled: true
            },
            desktopSharingFrameRate: {
              min: 15,
              max: 30
            },
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
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'chat',
              'raisehand', 'videoquality', 'fullscreen'
            ]
          }
        };

        const jitsiApi = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = jitsiApi;

        const screenSharingButton = document.createElement('button');
        screenSharingButton.id = 'custom-share-screen';
        screenSharingButton.style.display = 'none';
        document.body.appendChild(screenSharingButton);
        
        screenSharingButton.addEventListener('click', () => {
          jitsiApi.executeCommand('toggleShareScreen');
        });

        jitsiApi.addEventListener('videoConferenceJoined', () => {
          jitsiApi.addEventListeners({
            endpointTextMessageReceived: (event) => {
              try {
                const data = JSON.parse(event.data.text);
                if (data.type === 'code_update' && data.sender !== userName) {
                  setCode(data.code);
                  setLanguage(data.language);
                } else if (data.type === 'lock_code' && role === 'candidate') {
                  setIsCodeLocked(data.locked);
                } else if (data.type === 'code_output' && data.sender !== userName) {
                  setOutput(data.output);
                } else if (data.type === 'run_code') {
                  runCode();
                } else if (data.type === 'request_screen_share' && role === 'candidate') {
                  screenSharingButton.click();
                } else if (data.type === 'toggle_theme') {
                  setIsDarkMode(data.isDark);
                }
              } catch (e) {
                console.error('Failed to parse incoming message:', e);
              }
            },
            screenSharingStatusChanged: (event) => {
              setIsScreenSharing(event.on);
            }
          });

          jitsiApi.executeCommand('setTileView', true);
          jitsiApi.executeCommand('toggleVideo');
          
          sendMessage({ 
            type: 'role_announce', 
            role: role,
            sender: userName
          });
        });

      } catch (error) {
        console.error('Failed to initialize Jitsi:', error);
        setErrorMsg('Failed to connect to video call. Please try again.');
      }
    }
  };

  const sendMessage = (data) => {
    if (jitsiApiRef.current) {
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
    const willChangeTemplate = window.confirm(`Change to ${newLanguage} template code? This will replace the current code.`);
    
    if (willChangeTemplate) {
      setCode(languageTemplates[newLanguage]);
    }
    
    setLanguage(newLanguage);
    
    if (willChangeTemplate) {
      sendCodeUpdate(languageTemplates[newLanguage], newLanguage);
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

  const shareCodeInChat = () => {
    if (jitsiApiRef.current) {
      jitsiApiRef.current.executeCommand('sendChatMessage', code);
    }
  };

  const triggerRemoteRun = () => {
    sendMessage({
      type: 'run_code'
    });
  };

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

  const requestScreenShare = () => {
    if (role === 'interviewer') {
      sendMessage({
        type: 'request_screen_share'
      });
      alert('Screen sharing request sent to candidate');
    } else {
      startScreenSharing();
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    sendMessage({
      type: 'toggle_theme',
      isDark: newTheme
    });
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...\n');
    
    try {
      const output = await executeCode(code, language);
      setOutput(output);
      sendCodeOutput(output);
    } catch (error) {
      const errorMessage = `Error: ${error.message}`;
      setOutput(errorMessage);
      sendCodeOutput(errorMessage);
    }
    
    setIsRunning(false);
  };

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

  return (
    <div className={`flex h-screen w-full flex-col ${themeClasses.background}`}>
      {/* Header with controls */}
      <div className={`flex items-center justify-between ${themeClasses.header} shadow-md p-3 z-10`}>
        <div className="flex items-center">
          <h1 className={`text-xl font-bold ${themeClasses.text} mr-4`}>
            CodeInterview <span className="text-xs font-normal rounded bg-blue-600 text-white px-2 py-1 ml-1">{role}</span>
          </h1>
          
          {role === 'candidate' && (
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
          )}
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
          
          {role === 'candidate' && (
            <>
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
            </>
          )}
          
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
      
      {/* Status bar for candidate */}
      {role === 'candidate' && (
        <div className={`flex justify-between items-center ${themeClasses.subheader} px-4 py-2 ${themeClasses.text} text-sm`}>
          <div className="flex items-center gap-2">
            <span className="font-medium">Language:</span>
            <span className="font-bold bg-blue-600 text-white rounded px-2 py-0.5">{language}</span>
            
            {isCodeLocked && (
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
      )}
      
      {/* Main content - side-by-side layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left side: Code editor and output (only for candidate) */}
        {role === 'candidate' && (
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
        )}
        
        {/* Video call container (full width for interviewer, half width for candidate) */}
        <div className={`${role === 'candidate' ? 'w-1/2' : 'w-full'} overflow-hidden`}>
          <div className="h-full" ref={jitsiContainerRef}></div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPlatform;