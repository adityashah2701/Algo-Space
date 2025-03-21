import React from 'react'
import { Button } from './components/ui/button'
import { ThemeProvider } from './context/ThemeProvider'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/Login/Login'
import SignupPage from './pages/Signup/SignUP'
import RoleSelectionForm from './pages/SelectRole/RoleSelectionForm'

const App = () => {
  return (
    <div>
     <ThemeProvider defaultTheme='dark'>

      <Routes>
        <Route path='/login' element={<LoginPage/>}>
        </Route>
        <Route path='/register' element={<SignupPage/>}>
        </Route>
        <Route path='/register/role' element={<RoleSelectionForm/>}>
        </Route>
        </Routes>
     </ThemeProvider>
      
    </div>
  )
}

export default App
