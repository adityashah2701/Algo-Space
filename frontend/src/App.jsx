import React, { useCallback, useEffect, Suspense, lazy } from "react";
import { ThemeProvider } from "./context/ThemeProvider";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import { useAuthStore } from "./Store/useAuthStore";
import { axiosInstance } from "./lib/axios";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load components
const HomePage = lazy(() => import("./pages/Home/HomePage"));
const LoginPage = lazy(() => import("./pages/Login/Login"));
const SignupPage = lazy(() => import("./pages/Signup/SignUP"));
const CandidateDashboard = lazy(() => import("./pages/CandidateDashboard/CandidateDashboard"));
const InterviewerDashboard = lazy(() => import("./pages/InterviewerDashboard/InterviewerDashboard"));
const WEBRTC = lazy(() => import('./pages/WEBRTC/WEBRTC'));
const ProfileCompletion = lazy(() => import('./pages/ProfileCompletion/ProfileCompletion'));
const Algochallenge = lazy(() => import('./pages/AlgoChallenge/AlgoChallenge'));
const OCR = lazy(() => import('./pages/OCR/OCR'));
const Score = lazy(() => import('./pages/Score/Score'));
const FindJobs = lazy(() => import("./pages/FindJobs/FindJobs"));
const JobPostingPage = lazy(() => import("./pages/JobForm/JobForm"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center p-4 rounded-lg">
      <div className="relative w-16 h-16 mx-auto mb-3">
        {/* Spinner animation */}
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute top-1 left-1 w-14 h-14 border-4 border-t-transparent border-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-t-transparent border-indigo-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        <div className="absolute top-3 left-3 w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>
      </div>
      <p className="text-lg font-medium opacity-80">Loading content...</p>
      <p className="text-xs opacity-60 mt-1">Please wait a moment</p>
    </div>
  </div>
);


const App = () => {
  const { setUser } = useAuthStore();
  
  const fetchDetails = useCallback(async () => {
    const { data } = await axiosInstance.get("/auth/get-profile");
    if (data.success === true) {
      setUser(data.data.user);
    } else {
      console.log(data.message);
    }
  }, [setUser]);
  
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);
  
  return (
    <div>
     <ThemeProvider defaultTheme='dark'>
    <Header/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        
      
  
        <Route path='/candidate-dashboard' element={<ProtectedRoute><CandidateDashboard/></ProtectedRoute>}/>
    
        <Route path='/interviewer-dashboard' element={<ProtectedRoute><InterviewerDashboard/></ProtectedRoute>}/>

       
      
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<SignupPage/>}/>
    
        <Route path='/complete-profile' element={<ProtectedRoute><ProfileCompletion/></ProtectedRoute>}/>
        <Route path='/webrtc' element={<ProtectedRoute><WEBRTC/></ProtectedRoute>}/>

        <Route path='/algo-challenge' element={<ProtectedRoute><Algochallenge/></ProtectedRoute>}/>
        <Route path='/ocr' element={<ProtectedRoute><OCR/></ProtectedRoute>}/>
        <Route path='/score' element={<ProtectedRoute><Score/></ProtectedRoute>}/>
        <Route path='/jobs' element={<ProtectedRoute><FindJobs/></ProtectedRoute>}/>

        
       

        </Routes>
      </ThemeProvider>
      <Toaster />
    </div>
  );
};

export default App;