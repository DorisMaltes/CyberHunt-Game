import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TicTacToePage from "./TicTacToePage";
import JumpySquarePage from "./JumpySquarePage"; // 🔥 Importamos el nuevo juego
import ClickerGamePage from "./ClickerGamePage";


export default function GamePage() {
  const [searchParams] = useSearchParams();
  const boothId = searchParams.get("boothId");
  const gameType = searchParams.get("game"); // 🔥 Nuevo parámetro
  const navigate = useNavigate();

  useEffect(() => {
    if (!boothId || !gameType) {
      // 🔥 Si falta boothId o gameType, manda al home
      navigate("/home");
    }
  }, [boothId, gameType, navigate]);

  // 🔥 Según el tipo de juego que indique el QR
  if (gameType === "tictactoe") {
    return <TicTacToePage boothId={boothId} />;
  }
  if (gameType == "jumpysquare")
  {
    return<JumpySquarePage boothId={boothId}/>;
  }
  if (gameType== "clicker"){
    return<ClickerGamePage boothId={boothId}/>
  }

  // 🔥 Más adelante aquí podrías agregar otros juegos
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Juego no encontrado</h2>
      <button onClick={() => navigate("/home")}>Volver al Home</button>
    </div>
  );
}
