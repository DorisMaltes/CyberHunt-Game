// src/pages/Register.jsx
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { getAuth,createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";



export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      
        // 1. Registro en Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Crear documento en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        company: company,
        email: email,
        score: 0,
        total_time: 0,
        visited_booths: []
      });

      navigate("/login"); // Redirige al login después de registrarse
    } 
    catch (error) 
    {
        console.error("Error en registro:", error.message);
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("Este correo ya está registrado.");
            break;
          case "auth/invalid-email":
            setErrorMessage("Correo electrónico no válido.");
            break;
          case "auth/weak-password":
            setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
            break;
          default:
            setErrorMessage("Ocurrió un error. Intenta de nuevo.");
        }
      }
  };

  return (
    <div>
      <h2>Registro</h2>
      <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="Compañía" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
}
