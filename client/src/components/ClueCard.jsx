export default function ClueCard({ clue, index, onDiscover, busy }) {
  return (
    <div className={`card clue ${clue.discovered ? "found" : "locked"}`}>
      <h3>Clue {index + 1}</h3>
      {clue.discovered ? (
        <p>{clue.description}</p>
      ) : (
        <button type="button" onClick={() => onDiscover(clue.id)} disabled={busy}>
          Investigate
        </button>
      )}
    </div>
  );
}