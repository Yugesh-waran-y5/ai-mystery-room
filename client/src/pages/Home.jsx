import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Shield, Brain, Fingerprint } from "lucide-react";
import { createCase, errorMessage } from "../services/api.js";

export default function Home() {
  const [premise, setPremise] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (premise.trim().length < 10) {
      setMessage("Please enter a mystery idea of at least 10 characters.");
      return;
    }
    setMessage("");
    setLoading(true);
    try {
      const mystery = await createCase(premise.trim(), difficulty);
      navigate(`/game/${mystery.id}`);
    } catch (err) {
      console.error("Create mystery failed:", err);
      setMessage(`${errorMessage(err)} (${err?.code || err?.message})`);
      setLoading(false);
    }
  }

  return (
    <>
      <div className="badge">
        <Shield size={15} /> INTELLIGENT MYSTERY GENERATOR
      </div>

      <h1>
        Every mystery has a <span>secret.</span>
        <br /> Can you uncover it?
      </h1>

      <p className="description">
        Enter a world of secrets, suspects and hidden clues. Let AI create your
        mystery. Your detective skills will reveal the truth.
      </p>

      <section className="features">
        <div className="feature"><Search /><h3>Investigate</h3><p>Discover hidden clues.</p></div>
        <div className="feature"><Brain /><h3>Think Smart</h3><p>Analyze every suspect.</p></div>
        <div className="feature"><Fingerprint /><h3>Find the Truth</h3><p>Reveal the culprit.</p></div>
      </section>

      <section className="setup">
        <h2>Create Your Mystery</h2>
        <p>Give your detective story a starting point.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="premise">Mystery premise</label>
          <textarea
            id="premise"
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            placeholder="Example: A priceless diamond disappears from a locked museum..."
            rows={4}
            maxLength={500}
            disabled={loading}
          />

          <label htmlFor="difficulty">Choose difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "The AI is writing your mystery..." : <>Create Mystery <span>→</span></>}
          </button>
        </form>

        {message && <p className="message error">{message}</p>}
      </section>

      <footer>AI MYSTERY ROOM · THINK LIKE A DETECTIVE</footer>
    </>
  );
}