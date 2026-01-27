import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginForm from './features/auth/LoginForm'
import RegisterForm from './features/auth/RegisterForm'

function App() {
  return (
    <>
    <Routes >
        <Route index path='/login' element={<LoginForm />} ></Route>
        <Route path='/register' element={<RegisterForm />} ></Route>
    </Routes>
    </>
  )
}

export default App
