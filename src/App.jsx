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
import GamePage from "./pages/GamePage";
import Leaderboard from "./pages/Leaderboard";
import RoulettePage from "./pages/RoulettePage";

import Cloud from "./components/cloud";



function App() {
  

  return (
    <>
      <Cloud 
        speed={25} 
        startSide="left" 
        imageUrl="/nube1.png" 
        topPosition="15%"
      />
      <Cloud 
        speed={40} 
        startSide="right" 
        imageUrl="/nube2.png" 
        topPosition="30%"
        cloudWidth="200px"
      />
    </>
  );
  
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<Login />} />
    //     <Route path="/register" element={<Register />} />
    //     <Route path="/home" element={<Home />} />
    //     <Route path="/qr" element={<QRPage />} />
    //     <Route path="/quiz" element={<QuizPage />} /> {/* 🔥 Nueva ruta */}
    //     <Route path="/game" element={<GamePage />} />
    //     <Route path="/leaderboard" element={<Leaderboard />} />
    //     <Route path="/random/roulette" element={<RoulettePage />} />
    //   </Routes>
    // </Router>

}





export default App
