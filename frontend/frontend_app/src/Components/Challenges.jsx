import ChallengeItem from "./ChallengeItem";

function Challenges() {
  return (
    <div className="challenges">
      <h3>Challenges</h3>

      <ChallengeItem text="Filter value from JSON record" completed />
      <ChallengeItem text="Compare two values" completed />
      <ChallengeItem text="Check if strings are equal" completed />
      <ChallengeItem text="Compare dates" completed />
      <ChallengeItem text="Compare numbers" />
    </div>
  );
}

export default Challenges;
