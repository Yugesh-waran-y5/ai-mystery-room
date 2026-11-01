import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCase, discoverClue, requestHint, accuse, errorMessage } from "../services/api.js";
import SuspectCard from "../components/SuspectCard.jsx";
import ClueCard from "../components/ClueCard.jsx";
import HintPanel from "../components/HintPanel.jsx";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCase(id)
      .then((data) => {
        if (data.status === "completed") navigate(`/result/${id}`, { replace: true });
        else setGame(data);
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id, navigate]);

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      const data = await action();
      if (data?.case) setGame(data.case);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleAccuse() {
    const name = game.suspects.find((s) => s.id === selected)?.name;
    if (!window.confirm(`Accuse ${name}? You can only accuse once.`)) return;
    setBusy(true);
    setError("");
    try {
      await accuse(id, selected);
      navigate(`/result/${id}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  if (error && !game) return <p className="message error">{error}</p>;
  if (!game) return <p className="message">Loading case file...</p>;

  const found = game.clues.filter((c) => c.discovered).length;

  return (
    <div className="game">
      <h1>{game.title}</h1>
      <span className="badge">{game.difficulty.toUpperCase()}</span>
      <p className="story">{game.story}</p>

      {error && <p className="message error">{error}</p>}

      <h2>Suspects</h2>
      <div className="grid">
        {game.suspects.map((s) => (
          <SuspectCard
            key={s.id}
            suspect={s}
            selected={selected === s.id}
            onSelect={setSelected}
            disabled={busy}
          />
        ))}
      </div>

      <h2>Clues ({found}/{game.clues.length})</h2>
      <div className="grid">
        {game.clues.map((c, i) => (
          <ClueCard
            key={c.id}
            clue={c}
            index={i}
            busy={busy}
            onDiscover={(clueId) => run(() => discoverClue(id, clueId))}
          />
        ))}
      </div>

      <HintPanel
        hints={game.hints}
        hintsUsed={game.hintsUsed}
        totalHints={game.totalHints}
        busy={busy}
        onRequest={() => run(() => requestHint(id))}
      />

      <div className="accuse-bar">
        <button type="button" disabled={!selected || busy} onClick={handleAccuse}>
          {selected ? "Make your accusation" : "Select a suspect to accuse"}
        </button>
      </div>
    </div>
  );
}