import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function TicTacToePage({ boothId }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameResult, setGameResult] = useState(null);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const navigate = useNavigate();

  const goToHOMEPage = async () => {
    navigate("/home");
} ;

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  // Verificar ganador o empate
  useEffect(() => {
    const checkWinner = (newBoard) => {
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
          return newBoard[a];
        }
      }
      if (!newBoard.includes(null)) return "Tie";
      return null;
    };

    const winner = checkWinner(board);
    if (winner) {
      setGameResult(winner);
    } else if (!isPlayerTurn) {
      machineMove();
    }
  }, [board, isPlayerTurn]);

  const handleCellClick = (index) => {
    if (!isPlayerTurn || board[index] || gameResult) return;
    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setIsPlayerTurn(false);
  };

  const machineMove = () => {
    const emptyIndices = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newBoard = [...board];
      newBoard[randomIndex] = "O";
      setTimeout(() => {
        setBoard(newBoard);
        setIsPlayerTurn(true);
      }, 500);
    }
  };

  const saveGameResult = async (finalScore) => {
    const userRef = doc(db, "users", userId);
    const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);

    try {
      await setDoc(progressRef, {
        booth_id: boothId,
        score_obtained: finalScore,
        visited: true
      });

      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newScore = (userData.score || 0) + finalScore;
        const visitedBooths = userData.visited_booths || [];
        const updatedVisitedBooths = visitedBooths.includes(boothId) ? visitedBooths : [...visitedBooths, boothId];

        await updateDoc(userRef, {
          score: newScore,
          visited_booths: updatedVisitedBooths
        });
      }
      console.log("Resultado del juego guardado.");
    } catch (error) {
      console.error("Error guardando resultado del juego:", error);
    }
  };

  const handleEndGame = () => {
    let finalScore = 0;
    if (gameResult === "X") finalScore = 10; // Ganaste
    else if (gameResult === "O") finalScore = -5; // Perdiste
    // Empate: 0 puntos

    saveGameResult(finalScore);
  };


  useEffect(() => {
    if (gameResult) handleEndGame();
  }, [gameResult]);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Tic Tac Toe</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 100px)", gap: "10px", justifyContent: "center" }}>
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleCellClick(index)}
            style={{ width: "100px", height: "100px", backgroundColor: "#eee", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "2rem", cursor: "pointer" }}
          >
            {cell}
          </div>
        ))}
      </div>
      {gameResult && (
        <div style={{ marginTop: "2rem" }}>
          <h3>
            {gameResult === "Tie" ? "Empate" : gameResult === "X" ? "¡Ganaste! (+10 puntos)" : "Perdiste (-5 puntos)"}
          </h3>
          <button onClick={() => navigate("/home")}>Volver al Home</button>
        </div>
      )}
      <button onClick={goToHOMEPage}>Regresar a Home</button>  

    </div>
  );
}
