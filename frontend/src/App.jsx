import React from 'react'

import { ThemeProvider } from './context/ThemeProvider'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup/SignUP'
import CandidateDashboard from './pages/CandidateDashboard/CandidateDashboard'
import InterviewerDashboard from './pages/InterviewerDashboard/InterviewerDashboard'
import Header from './components/Header/Header'
import HomePage from './pages/Home/HomePage'
// import QuizPage from './pages/QuizApp/QuizApp'



import WEBRTC from './pages/WEBRTC/WEBRTC'
import ProfileCompletion from './pages/ProfileCompletion/ProfileCompletion'

const App = () => {
  return (
    <div>
     <ThemeProvider defaultTheme='dark'>
    <Header/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        
      
  
        <Route path='/candidate-dash' element={<CandidateDashboard/>}/>
    
        <Route path='/interviewer-dash' element={<InterviewerDashboard/>}/>

        {/* <Route path='/quiz' element={<QuizPage/>}/> */}
      
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<SignupPage/>}/>
    
        <Route path='/complete-profile' element={<ProfileCompletion/>}/>
        <Route path='/webrtc' element={<WEBRTC/>}/>
        
       
        </Routes>
     </ThemeProvider>
    </div>
  )
}

export default App
