import React from 'react'
import { Button } from './components/ui/button'
import { ThemeProvider } from './context/ThemeProvider'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup/SignUP'
import RoleSelectionForm from './pages/SelectRole/RoleSelectionForm'
import WEBRTC from './pages/WEBRTC/WEBRTC'

const App = () => {
  return (
    <div>
     <ThemeProvider defaultTheme='dark'>

      <Routes>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<SignupPage/>}/>
        <Route path='/register/role' element={<RoleSelectionForm/>}/>
        <Route path='/webrtc' element={<WEBRTC/>}/>
        
       
        </Routes>
     </ThemeProvider>
      
    </div>
  )
}

export default App
