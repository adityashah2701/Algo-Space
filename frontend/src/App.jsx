import React from 'react'
import { Button } from './components/ui/button'
import { ThemeProvider } from './context/ThemeProvider'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup/SignUP'
import RoleSelectionForm from './pages/SelectRole/RoleSelectionForm'
import CandidateDashboard from './pages/CandidateDashboard/CandidateDashboard'
import InterviewerDashboard from './pages/InterviewerDashboard/InterviewerDashboard'
import Header from './components/Header/Header'
import HomePage from './pages/Home/HomePage'
// import QuizPage from './pages/QuizApp/QuizApp'



const App = () => {
  return (
    <div>
     <ThemeProvider defaultTheme='dark'>
    <Header/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
 
        <Route path='/signup' element={<SignupPage/>}/>
      
        <Route path='/role' element={<RoleSelectionForm/>}/>
  
        <Route path='/candidate-dash' element={<CandidateDashboard/>}/>
    
        <Route path='/interviewer-dash' element={<InterviewerDashboard/>}/>

        {/* <Route path='/quiz' element={<QuizPage/>}/> */}
      
        </Routes>
     </ThemeProvider>
    </div>
  )
}

export default App
