import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, doc, setDoc } from "firebase/firestore"; 



function Home() {
    const navigate = useNavigate();

    const goToQRPage = async () => {
        navigate("/qr");
    } ;

    return(
    <div >
        <h1>HOLA</h1>
        <button onClick={goToQRPage}>Escanea un QR 📷</button>
    </div>
    );
}

export default Home