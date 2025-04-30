import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Home() {
  const [userName, setUserName] = useState("");
  const [userScore, setUserScore] = useState("");
  const [userVisitedBooths, setUsersVisitedBooths] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUserName(userData.name || "Jugador");
        setUserScore(userData.score || "error");
        setUsersVisitedBooths(userData.visited_booths);
      }
    };

    fetchUserData();
  }, [userId]);



  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>¡Hola, {userName}! 👋</h1>
      <h2>Tu puntaje es: {userScore}</h2>
      <h2>Haz visitado: {userVisitedBooths.length} booths</h2>

      <div style={{ marginTop: "2rem" }}>
        <button
          onClick={() => navigate("/qr")}
          style={{ fontSize: "1.2rem", padding: "1rem", marginRight: "1rem" }}
        >
          Escanea un QR 📷
        </button>

        <button
          onClick={() => navigate("/leaderboard")}
          style={{ fontSize: "1.2rem", padding: "1rem" }}
        >
          Ver Leaderboard 🏆
        </button>
      </div>
    </div>
  );
}

export default Home;
