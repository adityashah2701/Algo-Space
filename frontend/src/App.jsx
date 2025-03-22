import React, { useCallback, useEffect } from "react";

import { ThemeProvider } from "./context/ThemeProvider";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/SignUP";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard/InterviewerDashboard";
import Header from "./components/Header/Header";
import HomePage from "./pages/Home/HomePage";



import WEBRTC from './pages/WEBRTC/WEBRTC'
import ProfileCompletion from './pages/ProfileCompletion/ProfileCompletion'

import Algochallenge from './pages/AlgoChallenge/AlgoChallenge'
import OCR from './pages/OCR/OCR'

import Score from './pages/Score/Score'
import { useAuthStore } from "./Store/useAuthStore";
import { axiosInstance } from "./lib/axios";
import FindJobs from "./pages/FindJobs/FindJobs";
import { Toaster } from "react-hot-toast";
import JobPostingPage from "./pages/JobForm/JobForm";
import ProtectedRoute from "./components/ProtectedRoute";



const App = () => {
  const { setUser } = useAuthStore();

  const fetchDetails = useCallback(async () => {
    const { data } = await axiosInstance.get("/auth/get-profile");
    if (data.success === true) {
      setUser(data.data.user);
    } else {
      console.log(data.message);
    }
  },[setUser]);
  useEffect(()=>{
    fetchDetails();
  },[fetchDetails])
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
        <Route path='/create-job' element={<ProtectedRoute><JobPostingPage/></ProtectedRoute>}/>

        <Route path='/algo-challenge' element={<ProtectedRoute><Algochallenge/></ProtectedRoute>}/>
        <Route path='/ocr' element={<ProtectedRoute><OCR/></ProtectedRoute>}/>
        <Route path='/score' element={<ProtectedRoute><Score/></ProtectedRoute>}/>
        <Route path='/jobs' element={<ProtectedRoute><FindJobs/></ProtectedRoute>}/>

        
       

        </Routes>
      </ThemeProvider>
      <Toaster/>
    </div>
  );
};

export default App;
