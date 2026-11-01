import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getResult, errorMessage } from "../services/api.js";

export default function Result() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getResult(id).then(setResult).catch((err) => setError(errorMessage(err)));
  }, [id]);

  if (error) return <p className="message error">{error}</p>;
  if (!result) return <p className="message">Loading result...</p>;

  return (
    <div className="result">
      <h1>{result.correct ? "Case solved!" : "Wrong accusation"}</h1>
      <h2>{result.title}</h2>
      <p className="score">Score: {result.score}</p>
      <p>
        The culprit was <strong>{result.culprit.name}</strong>.
      </p>
      <p>
        Clues discovered: {result.cluesDiscovered} · Hints used: {result.hintsUsed} ·
        Difficulty: {result.difficulty}
      </p>

      <div className="card">
        <h3>The solution</h3>
        <p>{result.explanation}</p>
      </div>

      <Link to="/" className="btn-link">Play again / New mystery</Link>
    </div>
  );
}