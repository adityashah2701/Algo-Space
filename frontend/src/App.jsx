import React from 'react'

import { ThemeProvider } from './context/ThemeProvider'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup/SignUP'

import WEBRTC from './pages/WEBRTC/WEBRTC'
import ProfileCompletion from './pages/ProfileCompletion/ProfileCompletion'

const App = () => {
  return (
    <div>
     <ThemeProvider defaultTheme='dark'>

      <Routes>
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
