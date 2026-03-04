function ChallengeItem({ challenge, completed, onClick }) {
  return (
    <div
      className="challenge"
      onClick={() => onClick(challenge)}
      style={{ cursor: "pointer", marginBottom: "8px" }}
    >
      <span>{completed ? "✅" : "⭕"}</span>
      <span style={{ marginLeft: "8px" }}>{challenge.title}</span>
      {completed && (
        <span style={{ marginLeft: "8px", color: "green" }}>Completed</span>
      )}
    </div>
  );
}

export default ChallengeItem;
