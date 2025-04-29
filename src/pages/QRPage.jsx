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

    if (data.includes("/booths/")) {
      const splitted = data.split("/booths/");
      const boothId = splitted[1];
      
      // 🔥 Cargar el booth desde Firestore
      const boothRef = doc(db, "booths", boothId);
      const boothSnap = await getDoc(boothRef);
      
      if (boothSnap.exists()) {
        const boothData = boothSnap.data();
        console.log("Booth data:", boothData);
        
        if (boothData.type === "questions") {
          // 🔥 Redirige al quiz general
          navigate(`/quiz?boothId=${boothId}`);
        } else if (boothData.type === "game") {
          navigate("/game");
        } else if (boothData.type === "random") {
          navigate("/random/roulette");
        } else {
          alert("Tipo de booth no reconocido.");
        }
      } else {
        alert("Booth no encontrado.");
      }
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
