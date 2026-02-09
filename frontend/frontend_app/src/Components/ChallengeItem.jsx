function ChallengeItem({ text, completed }) {
  return (
    <div className="challenge">
      <span>{completed ? "✅" : "⭕"}</span>
      <span>{text}</span>
      {completed && <span className="done">Completed</span>}
    </div>
  );
}

export default ChallengeItem;
