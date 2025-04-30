import { useState, useEffect } from "react";
import QRScanner from "../components/QRScanner";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function QRPage() {
  const [scannedData, setScannedData] = useState(null);
  const navigate = useNavigate();

  const handleScan = async (data) => {
    setScannedData(data);

    let relativePath = data;

    //si el QR escaneado es un URL completa, conviertelo a relativo de esta manera:
    if (data.startsWith("http")){
      const url = new URL (data);
      relativePath = url.pathname + url.search; //quedrá solo la ruta relativa
    }

    if (relativePath.includes("/booths/")) {
      const splitted = relativePath.split("/booths/");
      const boothId = splitted[1];
      
      const boothRef = doc(db, "booths", boothId);
      const boothSnap = await getDoc(boothRef);

      if (boothSnap.exists()) 
      {
        const boothData = boothSnap.data();
        console.log("Booth data:", boothData);

        if (boothData.type === "questions") {
          navigate(`/quiz?boothId=${boothId}`);
        } else if (boothData.type === "game") {
          navigate(`/game?boothId=${boothId}&game=tictactoe`);
        } else if (boothData.type === "random") {
          navigate(`/random/roulette?boothId=${boothId}`);
        } else {
          alert("Tipo de booth no reconocido.");
        }
      } else {
        alert("Booth no encontrado.");
      }
    } else if (relativePath.includes("/game") || relativePath.includes("/random")) {
      // 🔥 Si el QR es de juego o random, navegar directo
      navigate(relativePath);
    } else {
      alert("QR no válido.");
    }
  };

  return (
    <div>
      {!scannedData ? (
        <QRScanner onScan={handleScan} />
      ) : (
        <p>QR escaneado: {scannedData}</p>
      )}
    </div>
  );
}
