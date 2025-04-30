import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";


export default function RoulettePage() {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const boothId = searchParams.get("boothId");

    const [alreadyPlayed, setAlreadyPlayed] = useState(false);
    const [result, setResult] = useState(null);
    const [spinning, setSpinning] = useState(false);

    const possibleResults = [10, 5, -5, -10];

    useEffect(() => {
    const checkProgress = async () => {
        if (!userId) return;

        const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);
        const progressSnap = await getDoc(progressRef);

        if (progressSnap.exists()) {
            setAlreadyPlayed(true);
            setResult(progressSnap.data().score_obtained);
    }
    };

    checkProgress();
    }, [userId]);

  const handleSpin = async () => {
    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * possibleResults.length);
    const prize = possibleResults[randomIndex];
    setTimeout(() => {
      setResult(prize);
      setSpinning(false);
      saveResult(prize);
    }, 2000); // Simula tiempo de giro
  };

  const saveResult = async (prize) => {
    const userRef = doc(db, "users", userId);
    const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);

    try {
      await setDoc(progressRef, {
        booth_id: boothId,
        score_obtained: prize,
        visited: true
      });

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newScore = (userData.score || 0) + prize;
        const visitedBooths = userData.visited_booths || [];
        const updatedVisitedBooths = visitedBooths.includes(boothId)
          ? visitedBooths
          : [...visitedBooths, boothId];

        await updateDoc(userRef, {
          score: newScore,
          visited_booths: updatedVisitedBooths
        });
      }
    } catch (error) {
      console.error("Error guardando resultado de la ruleta:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🎰 ¡Gira la ruleta!</h1>

      {alreadyPlayed ? (
        <>
          <p>Ya jugaste este booth.</p>
          <h2>Resultado anterior: {result > 0 ? `+${result}` : result} puntos</h2>
        </>
      ) : spinning ? (
        <p>🎡 Girando...</p>
      ) : result !== null ? (
        <>
          <h2>¡Resultado!: {result > 0 ? `+${result}` : result} puntos</h2>
          <button onClick={() => navigate("/home")}>Volver al Home</button>
        </>
      ) : (
        <button
          onClick={handleSpin}
          style={{ fontSize: "1.5rem", padding: "1rem 2rem" }}
        >
          Gira 🎯
        </button>
      )}
    </div>
  );
}
