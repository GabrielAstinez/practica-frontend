function ChallengeItem({ challenge, completed, onClick, isActive }) {
  return (
    <div
      className={`challenge ${isActive ? "active" : ""}`}
      onClick={() => onClick(challenge)}
    >
      <span>{completed ? "✅" : "⭕"}</span>
      <span>{challenge.title}</span>
    </div>
  );
}

export default ChallengeItem;
