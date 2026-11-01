export default function HintPanel({ hints, hintsUsed, totalHints, onRequest, busy }) {
  const left = totalHints - hintsUsed;
  return (
    <div className="card hint-panel">
      <h3>Hints ({left} left)</h3>
      {hints.length === 0 && <p>No hints used yet. Each hint costs 10 points.</p>}
      <ol>
        {hints.map((h, i) => <li key={i}>{h}</li>)}
      </ol>
      <button type="button" onClick={onRequest} disabled={busy || left <= 0}>
        {left > 0 ? "Ask for a hint (-10 points)" : "No hints left"}
      </button>
    </div>
  );
}