import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from "./pages/Register";
import Home from "./pages/Home"; 
import Login from "./pages/LogIn";
import QRPage from "./pages/QRPage";
import QuizPage from "./pages/Quizpage";


function App() {
  

  return (
  
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/qr" element={<QRPage />} />
        <Route path="/quiz" element={<QuizPage />} /> {/* 🔥 Nueva ruta */}
      </Routes>
    </Router>

  );
}





export default App
