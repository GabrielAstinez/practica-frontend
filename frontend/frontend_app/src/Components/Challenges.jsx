import { useEffect, useState } from "react";
import ChallengeItem from "./ChallengeItem";

function Challenges({ onSelectChallenge, completedChallenges }) {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/challenges")
      .then((res) => res.json())
      .then((data) => setChallenges(data.challenges));
  }, []);

  return (
    <div className="challenges">
      <h3>Challenges</h3>

      {challenges.map((challenge) => (
        <ChallengeItem
          key={challenge.id}
          challenge={challenge}
          completed={completedChallenges.includes(challenge.id)}
          onClick={onSelectChallenge}
        />
      ))}
    </div>
  );
}

export default Challenges;
