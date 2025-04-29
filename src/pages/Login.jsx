// src/pages/Login.jsx
import { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

    const registerFromLogIn = async () => {
        navigate("/register");
    } ;

  const handleLogin = async () => {
    try 
    {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Usuario logueado:", user.uid);

      navigate("/home"); // Redirige al homepage después de loguearse
    } 
    catch (error) 
    {
      console.error("Error en login:", error.message);

      switch(error.code){
        case "auth/invalid-email":
          setErrorMessage("El correo electrónico no es válido.");
          break;
        case "auth/user-not-found":
          setErrorMessage("Usuario no encontrado. ¿Te registraste?");
          break;
        case "auth/wrong-password":
          setErrorMessage("Contraseña incorrecta.");
          break;
        default:
          setErrorMessage("Ocurrió un error. Intenta de nuevo.");
      }
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      
      <button onClick={handleLogin}>Login</button>
      <button onClick={registerFromLogIn}>Register</button>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}
