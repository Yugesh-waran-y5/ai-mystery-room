export default function SuspectCard({ suspect, selected, onSelect, disabled }) {
  return (
    <div className={`card suspect ${selected ? "selected" : ""}`}>
      <h3>{suspect.name}</h3>
      <p>{suspect.description}</p>
      <button type="button" onClick={() => onSelect(suspect.id)} disabled={disabled}>
        {selected ? "Selected" : "Select suspect"}
      </button>
    </div>
  );
}