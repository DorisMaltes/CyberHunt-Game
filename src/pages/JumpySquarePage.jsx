import { useNavigate } from "react-router-dom";


export default function JumpySquarePage() {
    const navigate = useNavigate();

    const regresarAHome = async () => {
        navigate("/home");
    } ;
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Hola desde JumpySquarePage</h1>
        <p>A game like flappy bird, under construction</p>
        <button onClick={regresarAHome}>Regresar a Home</button>
      </div>
    );
  }
  