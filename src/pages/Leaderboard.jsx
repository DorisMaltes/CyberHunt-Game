import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [userRank, setUserRank] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const pageSize = 10;

  useEffect(() => {
    const fetchPlayers = async () => {
      const usersRef = collection(db, "users");
      const usersSnap = await getDocs(usersRef);

      const loadedPlayers = usersSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenar por score descendente
      loadedPlayers.sort((a, b) => (b.score || 0) - (a.score || 0));

      // Guardar posición del usuario actual
      const index = loadedPlayers.findIndex(p => p.id === userId);
      setUserRank(index >= 0 ? index + 1 : null);

      setPlayers(loadedPlayers);
    };

    fetchPlayers();
  }, [userId]);


  const pagePlayers = players.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const totalPages = Math.ceil(players.length / pageSize);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>🏆 Leaderboard 🏆</h1>

      <table style={{ margin: "2rem auto", width: "90%", maxWidth: "700px", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid black" }}>
            <th style={{ padding: "1rem" }}>Posición</th>
            <th style={{ padding: "1rem" }}>Nombre</th>
            <th style={{ padding: "1rem" }}>Puntaje</th>
          </tr>
        </thead>
        <tbody>
          {pagePlayers.map((player, index) => {
            const globalIndex = currentPage * pageSize + index;
            const isCurrentUser = player.id === userId;
            const isFirst = globalIndex === 0;

            return (
              <tr
                key={player.id}
                style={{
                  backgroundColor: isCurrentUser ? "#ffd700" : "transparent",
                  fontWeight: isCurrentUser ? "bold" : "normal"
                }}
              >
                <td style={{ padding: "0.8rem" }}>
                  {globalIndex + 1}
                  {isFirst && " 👑"}
                </td>
                <td style={{ padding: "0.8rem" }}>{player.name || "Jugador"}</td>
                <td style={{ padding: "0.8rem" }}>{player.score || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div style={{ margin: "1rem" }}>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}>
            ⬅️ Anterior
          </button>
          <span style={{ margin: "0 1rem" }}>
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages - 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Siguiente ➡️
          </button>
        </div>
      )}

      {/* Si el usuario está fuera del top 10, mostrar su posición */}
      {userRank && userRank > (currentPage + 1) * pageSize && (
        <div style={{ marginTop: "2rem", backgroundColor: "#eee", padding: "1rem", borderRadius: "10px" }}>
          <p>🔍 Tu posición: {userRank}°</p>
        </div>
      )}

      <button onClick={() => navigate("/home")} style={{ fontSize: "1.2rem", padding: "1rem", marginTop: "2rem" }}>
        Volver al Home
      </button>
    </div>
  );
}

export default Leaderboard;
