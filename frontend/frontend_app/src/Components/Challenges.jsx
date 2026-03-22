import { useEffect, useState } from "react";

const DIFF_CLASS = {
  easy: "diff-easy",
  medium: "diff-medium",
  hard: "diff-hard",
};
const DIFF_LABEL = { easy: "Easy", medium: "Medium", hard: "Hard" };

function Challenges({
  onSelectChallenge,
  completedChallenges,
  selectedChallenge,
}) {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/challenges")
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data.challenges);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="challenges">
      <h3>Challenges</h3>

      {loading ? (
        <p style={{ color: "#9ca3af", fontSize: 13 }}>Loading…</p>
      ) : (
        challenges.map((challenge) => {
          const isCompleted = completedChallenges.includes(challenge.id);
          const isSelected = selectedChallenge?.id === challenge.id;

          return (
            <div
              key={challenge.id}
              className={`challenge ${isSelected ? "active" : ""}`}
              onClick={() => onSelectChallenge(challenge)}
            >
              <div className="challenge-icon-wrap">
                {challenge.icon || "📋"}
              </div>

              <div className="challenge-info">
                <div className="challenge-title">{challenge.title}</div>
                <div
                  className={`challenge-diff ${DIFF_CLASS[challenge.difficulty] || ""}`}
                >
                  {DIFF_LABEL[challenge.difficulty] || challenge.difficulty}
                </div>
              </div>

              <div className="challenge-check">
                {isCompleted ? (
                  <span className="done-icon">✔</span>
                ) : (
                  <span className="pending-icon">○</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Challenges;
