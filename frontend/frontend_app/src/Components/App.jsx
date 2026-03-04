import { useState } from "react";
import Playground from "./Playground";
import Challenges from "./Challenges";
import TaskDescriptions from "./TaskDescriptions";

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  return (
    <div className="layout">
      <TaskDescriptions selectedChallenge={selectedChallenge} />

      <Playground
        selectedChallenge={selectedChallenge}
        completedChallenges={completedChallenges}
        setCompletedChallenges={setCompletedChallenges}
      />

      <Challenges
        onSelectChallenge={setSelectedChallenge}
        completedChallenges={completedChallenges}
      />
    </div>
  );
}

export default App;
