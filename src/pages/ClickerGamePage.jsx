import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function ClickerGamePage({ boothId }) {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const navigate = useNavigate();

    const [alreadyPlayed, setAlreadyPlayed] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!userId) return;

      const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        setAlreadyPlayed(true);
        setScore(progressSnap.data().score_obtained);
      }
    };

    checkProgress();
  }, [userId, boothId]);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(10);
    setGameFinished(false);
  };

  const handleClick = () => {
    if (timeLeft > 0) {
      setScore(prev => prev + 1);
    }
  };

  const saveGameResult = async () => {
    const userRef = doc(db, "users", userId);
    const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);

    try {
      await setDoc(progressRef, {
        booth_id: boothId,
        score_obtained: score,
        visited: true
      });

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newScore = (userData.score || 0) + score;
        const visitedBooths = userData.visited_booths || [];
        const updatedVisitedBooths = visitedBooths.includes(boothId) ? visitedBooths : [...visitedBooths, boothId];

        await updateDoc(userRef, {
          score: newScore,
          visited_booths: updatedVisitedBooths
        });
      }
      setGameFinished(true); // 🔥 Marcar que terminó
    } catch (error) {
      console.error("Error guardando progreso del clicker game:", error);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && gameStarted) {
      saveGameResult();
    }
  }, [timeLeft, gameStarted]);

  if (alreadyPlayed) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Ya jugaste este booth</h2>
        <p>Puntaje obtenido: {score}</p>
        <button onClick={() => navigate("/home")}>Volver al Home</button>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>¡Clicker Challenge!</h2>
        <p>👉 Tienes 10 segundos para hacer la mayor cantidad de clics posibles.</p>
        <button onClick={startGame}>¡Comenzar!</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Tiempo restante: {timeLeft} segundos</h2>
      <h3>Puntaje: {score}</h3>
      {timeLeft > 0 ? (
        <button onClick={handleClick} style={{ fontSize: "2rem", padding: "1rem 2rem", marginTop: "2rem" }}>
          ¡Haz clic aquí!
        </button>
      ) : (
        <div>
          <p>Juego terminado. Puntaje final: {score}</p>
          <button onClick={() => navigate("/home")} style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
            Volver al Home
          </button>
        </div>
      )}
    </div>
  );
}
