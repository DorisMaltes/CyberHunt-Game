import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const boothId = searchParams.get("boothId");

  const [boothData, setBoothData] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [summary, setSummary] = useState([]);

  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [progressData, setProgressData] = useState(null);

  const navigate = useNavigate();


  // FUNCIONES 🔥

  const saveProgressToFirestore = async (finalScore, finalTime) => {
    const userRef = doc(db, "users", userId);
    const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);
  
    try {
      console.log("Guardando progreso para:", userId, boothId, finalScore, finalTime);
  
      // 🔥 Guarda el progreso individual
      await setDoc(progressRef, {
        booth_id: boothId,
        score_obtained: finalScore,
        time_taken: finalTime,
        visited: true
      });
  
      // 🔥 Actualiza el score total del usuario y visited_booths
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const newScore = (userData.score || 0) + finalScore;
        const newTotalTime = (userData.total_time || 0) + finalTime;
        
        const visitedBooths = userData.visited_booths || [];
        const upadatedVisitedBooths = visitedBooths.includes(boothId)
          ? visitedBooths
          : [...visitedBooths, boothId]; //solo lo agrega si es que no esta

  
        await updateDoc(userRef, {
          score: newScore,
          total_time: newTotalTime,
          visited_booths: upadatedVisitedBooths
        });
      }
  
      console.log("Progreso guardado correctamente.");
    } catch (error) {
      console.error("Error guardando progreso:", error);
    }
  };

  const handleFinishQuiz = () => {
    let totalScore = 0;
    const resultSummary = questions.map((q) => {
      const userAnswer = answers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      const points = isCorrect ? q.points_correct : q.points_incorrect;
      totalScore += points;
      return {
        question: q.question_text,
        userAnswer,
        correctAnswer: q.correct_answer,
        isCorrect,
        points,
      };
    });

    setScore(totalScore);
    setSummary(resultSummary);
    setQuizFinished(true);
    setShowSummary(true);

    saveProgressToFirestore(totalScore, elapsedTime);
  };

  const handleSelectDifficulty = async (level) => {
    console.log("Dificultad seleccionada:", level);
    setDifficulty(level);
    setLoadingQuestions(true);

    const questionsRef = collection(db, "booths", boothId, level === "easy" ? "questions_easy" : "questions_hard");
    const questionsSnap = await getDocs(questionsRef);

    const loadedQuestions = questionsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Preguntas cargadas:", loadedQuestions);
    setQuestions(loadedQuestions);
    setLoadingQuestions(false);
  };

  const handleOptionSelect = (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({
      ...answers,
      [currentQuestion.id]: option,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // useEffect 🔥

  useEffect(() => {
    const fetchBoothAndProgress = async () => {
      if (!userId) return;


      const boothRef = doc(db, "booths", boothId);
      const boothSnap = await getDoc(boothRef);

      if (boothSnap.exists()) {
        setBoothData(boothSnap.data());
      }

      const progressRef = doc(db, "users", userId, "user_booth_progress", boothId);
      const progressSnap = await getDoc(progressRef);

      if(progressSnap.exists()){
        setProgressData(progressSnap.data());
      }
    };

    fetchBoothAndProgress();
  }, [boothId, userId]);

  useEffect(() => {
    if (difficulty && questions.length > 0 && !startTime) {
      setStartTime(Date.now());
    }

    let interval = null;
    if (startTime && !quizFinished) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [startTime, difficulty, questions, quizFinished]);

  // Render 🔥

  if (progressData){
    return(
      <div style={{ textAlign: "center", padding: "2rem"}}>
        <h2>Este booth ya fue completado</h2>
        <p>Puntos obtenidos: {progressData.score_obtained}</p>
        <p>Tiempo tomado: {progressData.time_taken} segundos</p>
        <button onClick={() => navigate("/home")}>Regresar al Home</button>
      </div>
    );
  }

  if (!boothData) return <p>Cargando booth...</p>;

  if (showSummary) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Resumen del Quiz</h2>
        <p>Puntaje total: {score}</p>
        <p>Tiempo total: {elapsedTime} segundos</p>

        {summary.map((item, index) => (
          <div key={index} style={{ margin: "1rem 0" }}>
            <p><strong>{item.question}</strong></p>
            <p>Tu respuesta: {item.userAnswer}</p>
            <p>Respuesta correcta: {item.correctAnswer}</p>
            <p style={{ color: item.isCorrect ? "green" : "red" }}>
              {item.isCorrect ? "Correcto" : "Incorrecto"} (Puntos: {item.points})
            </p>
            <button onClick={() => navigate("/home")}>Regresar a Home</button>
          </div>
        ))}
      </div>
    );
  }

  if (difficulty && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Tiempo: {elapsedTime} segundos</p>
        <h2>{currentQuestion.question_text}</h2>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <button
              onClick={() => handleOptionSelect(option)}
              style={{
                backgroundColor: answers[currentQuestion.id] === option ? "lightblue" : "",
                margin: "0.5rem",
              }}
            >
              {option}
            </button>
          </div>
        ))}

        <div style={{ marginTop: "1rem" }}>
          <button onClick={handlePrev} disabled={currentQuestionIndex === 0}>Anterior</button>
          <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1}>Siguiente</button>
          {currentQuestionIndex === questions.length - 1 && (
            <button onClick={handleFinishQuiz} style={{ marginTop: "1rem" }}>
              Terminar Quiz
            </button>
          )}
        </div>

        <p>Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>Quiz para Booth: {boothId}</h2>
      <p>Tipo: {boothData.type}</p>

      {!difficulty && boothData.type === "questions" && (
        <>
          <p>Selecciona la dificultad:</p>
          <button onClick={() => handleSelectDifficulty("easy")}>Fácil</button>
          <button onClick={() => handleSelectDifficulty("hard")}>Difícil</button>
        </>
      )}

      {loadingQuestions && <p>Cargando preguntas...</p>}
    </div>
  );
}
