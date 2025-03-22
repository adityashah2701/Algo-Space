import React, { useCallback, useEffect } from "react";

import { ThemeProvider } from "./context/ThemeProvider";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/SignUP";
import CandidateDashboard from "./pages/CandidateDashboard/CandidateDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard/InterviewerDashboard";
import Header from "./components/Header/Header";
import HomePage from "./pages/Home/HomePage";
// import QuizPage from './pages/QuizApp/QuizApp'



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



const App = () => {
  const { setUser } = useAuthStore();

  const fetchDetails = useCallback(async () => {
    const { data } = await axiosInstance.get("/auth/get-profile");
    if (data.success === true) {
      setUser(data.data.user);
    } else {
      console.log(data.message);
    }
  },[]);
  useEffect(()=>{
    fetchDetails();
  },[])
  return (

    <div>
     <ThemeProvider defaultTheme='dark'>
    <Header/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        
      
  
        <Route path='/candidate-dashboard' element={<CandidateDashboard/>}/>
    
        <Route path='/interviewer-dashboard' element={<InterviewerDashboard/>}/>

       
      
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<SignupPage/>}/>
    
        <Route path='/complete-profile' element={<ProfileCompletion/>}/>
        <Route path='/webrtc' element={<WEBRTC/>}/>
<Route path="/create-job" element={<JobPostingPage/>}/>
        <Route path='/algo-challenge' element={<Algochallenge/>}/>
        <Route path='/ocr' element={<OCR/>}/>
        <Route path='/score' element={<Score/>}/>
        <Route path='/jobs' element={<FindJobs/>}/>

        
       

        </Routes>
      </ThemeProvider>
      <Toaster/>
    </div>
  );
};

export default App;
