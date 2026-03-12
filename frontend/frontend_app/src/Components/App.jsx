import { useState, useEffect } from "react";
import Playground from "./Playground";
import Challenges from "./Challenges";
import TaskDescriptions from "./TaskDescriptions";
import ModalLogin from "./ModalLogin";

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedChallenges, setCompletedChallenges] = useState([]);

  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("logged");
    if (savedLogin === "true") {
      setIsLogged(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem("logged", "true");
    setIsLogged(true);
  };

  return (
    <>
      <ModalLogin isOpen={!isLogged} onLoginSuccess={handleLoginSuccess} />

      {isLogged && (
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
      )}
    </>
  );
}

export default App;
