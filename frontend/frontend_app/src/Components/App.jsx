import { useState } from "react";
import Playground from "./Playground";
import Challenges from "./Challenges";
import TaskDescriptions from "./TaskDescriptions";
import ModalLogin from "./ModalLogin";

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  // 🔹 ahora inicia abierto
  const [isLoginOpen, setIsLoginOpen] = useState(true);

  return (
    <>
      <button
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
        onClick={() => setIsLoginOpen(true)}
      >
        Login
      </button>

      <ModalLogin isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

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
    </>
  );
}

export default App;
