import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import "@fontsource/milonga";
import "@fontsource/manrope";
import "@fontsource/montserrat";
import "@fontsource/poppins/700.css";
import Signup from './Signup.jsx'
import Signin from './Signin.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  </BrowserRouter>,
)
