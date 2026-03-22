import { useState } from "react";
import Challenges from "./Challenges";
import Playground from "./Playground";
import TaskDescriptions from "./TaskDescriptions";
import ModalLogin from "./ModalLogin";
import "../index.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedByEngine, setCompletedByEngine] = useState({});
  const [engine, setEngine] = useState("common");
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const engineCompletions = completedByEngine[engine] || [];

  const handleMarkCompleted = (challengeId) => {
    setCompletedByEngine((prev) => {
      const existing = prev[engine] || [];
      if (existing.includes(challengeId)) return prev;
      return { ...prev, [engine]: [...existing, challengeId] };
    });
  };

  const engineLabel =
    {
      common: "CEL · common",
      pycel: "CEL · pycel",
      "cel-go": "CEL · Go",
      "cel-wasm": "CEL · WASM",
      wasm: "Starlark · WASM",
      starlark: "Starlark · server",
      "lua-server": "Lua · server",
      lua: "Lua · WASM",
    }[engine] || engine;

  return (
    <div className="app">
      <ModalLogin
        isOpen={!isLoggedIn}
        onLoginSuccess={() => setIsLoggedIn(true)}
      />

      <div className="header">
        <div className="header-title">
          <span className="header-icon">⚡</span>
          <div>
            <span className="header-main">Evaluador de Reglas</span>
            <span className="header-accent"> JSON</span>
          </div>
        </div>

        <div className="header-controls">
          <div className="engine-row">
            <label className="engine-label">Engine</label>
            <select
              className="engine-select"
              value={engine}
              onChange={(e) => setEngine(e.target.value)}
            >
              <option value="common">CEL (common)</option>
              <option value="pycel">CEL (pycel)</option>
              <option value="cel-go">CEL (Go)</option>
              <option value="cel-wasm">CEL (WebAssembly)</option>
              <option value="wasm">Starlark (WebAssembly)</option>
              <option value="starlark">Starlark (server)</option>
              <option value="lua-server">Lua (server)</option>
              <option value="lua">Lua (WebAssembly)</option>
            </select>
            <span className="engine-badge">{engineLabel}</span>
          </div>

          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="container">
        <Challenges
          onSelectChallenge={setSelectedChallenge}
          completedChallenges={engineCompletions}
          selectedChallenge={selectedChallenge}
        />

        <div className="main">
          <Playground
            selectedChallenge={selectedChallenge}
            completedChallenges={engineCompletions}
            onMarkCompleted={handleMarkCompleted}
            engine={engine}
          />
        </div>

        <TaskDescriptions
          selectedChallenge={selectedChallenge}
          completedByEngine={completedByEngine}
        />
      </div>
    </div>
  );
}

export default App;
