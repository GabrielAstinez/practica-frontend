import { useState, useEffect } from "react";
import Challenges from "./Challenges";
import Playground from "./Playground";
import TaskDescriptions from "./TaskDescriptions";
import ModalLogin from "./ModalLogin";
import "../index.css";

const ENGINE_LANGUAGE = {
  common: "CEL",
  pycel: "CEL",
  "cel-go": "CEL",
  "cel-wasm": "CEL",
  wasm: "Starlark",
  starlark: "Starlark",
  "lua-server": "Lua",
  lua: "Lua",
};

function loadState() {
  try {
    const raw = localStorage.getItem("playground_state");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    parsed.completedByLang = {
      CEL: new Set(parsed.completedByLang?.CEL || []),
      Starlark: new Set(parsed.completedByLang?.Starlark || []),
      Lua: new Set(parsed.completedByLang?.Lua || []),
    };
    return parsed;
  } catch {
    return null;
  }
}

function saveState(
  completedByEngine,
  completedByLang,
  engine,
  darkMode,
  savedAnswers,
) {
  try {
    localStorage.setItem(
      "playground_state",
      JSON.stringify({
        completedByEngine,
        completedByLang: {
          CEL: [...completedByLang.CEL],
          Starlark: [...completedByLang.Starlark],
        },
        engine,
        darkMode,
        savedAnswers,
      }),
    );
  } catch {}
}

const saved = loadState();
const initialCompletedByEngine = saved?.completedByEngine || {};
const initialCompletedByLang = saved?.completedByLang || {
  CEL: new Set(),
  Starlark: new Set(),
  Lua: new Set(),
};
const initialEngine = saved?.engine || "common";
const initialDarkMode = saved?.darkMode ?? false;
const initialSavedAnswers = saved?.savedAnswers || {};

if (initialDarkMode) document.body.classList.add("dark");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [completedByEngine, setCompletedByEngine] = useState(
    initialCompletedByEngine,
  );
  const [completedByLang, setCompletedByLang] = useState(
    initialCompletedByLang,
  );
  const [engine, setEngine] = useState(initialEngine);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const [savedAnswers, setSavedAnswers] = useState(initialSavedAnswers);
  const [executeInAll, setExecuteInAll] = useState(false);

  useEffect(() => {
    saveState(
      completedByEngine,
      completedByLang,
      engine,
      darkMode,
      savedAnswers,
    );
  }, [completedByEngine, completedByLang, engine, darkMode, savedAnswers]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("dark", next);
  };

  const handleMarkCompleted = (challengeId, targetEngine = engine) => {
    setCompletedByEngine((prev) => {
      const existing = prev[targetEngine] || [];
      if (existing.includes(challengeId)) return prev;
      return { ...prev, [targetEngine]: [...existing, challengeId] };
    });

    const lang = ENGINE_LANGUAGE[targetEngine];
    setCompletedByLang((prev) => {
      if (prev[lang].has(challengeId)) return prev;
      const next = new Set(prev[lang]);
      next.add(challengeId);
      return { ...prev, [lang]: next };
    });
  };

  const handleSaveAnswer = (challengeId, engineKey, code) => {
    setSavedAnswers((prev) => ({
      ...prev,
      [`${challengeId}_${engineKey}`]: code,
    }));
  };

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
          <div className="engine-tabs">
            {Object.keys(ENGINE_LANGUAGE).map((e) => (
              <button
                key={e}
                className={`tab ${engine === e ? "active" : ""}`}
                onClick={() => setEngine(e)}
              >
                {e.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="theme-btn" onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
      <div className="container">
        <Challenges
          onSelectChallenge={setSelectedChallenge}
          completedChallenges={completedByEngine[engine] || []}
          selectedChallenge={selectedChallenge}
        />
        <div className="main">
          <div className="execute-all">
            <label className="execute-all-label" htmlFor="exec-all">
              <span className="header-icon" style={{ fontSize: "18px" }}>
                🚀
              </span>
              Multi-Engine Mode
            </label>
            <label className="switch">
              <input
                type="checkbox"
                id="exec-all"
                checked={executeInAll}
                onChange={(e) => setExecuteInAll(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
            <span className={`mode-status ${executeInAll ? "active" : ""}`}>
              {executeInAll ? "Turbo: ON" : "Single"}
            </span>
          </div>
          <Playground
            selectedChallenge={selectedChallenge}
            completedChallenges={completedByEngine[engine] || []}
            onMarkCompleted={handleMarkCompleted}
            onSaveAnswer={handleSaveAnswer}
            savedAnswers={savedAnswers}
            engine={engine}
            executeInAll={executeInAll}
          />
        </div>
        <TaskDescriptions
          selectedChallenge={selectedChallenge}
          completedByEngine={completedByEngine}
          completedByLang={completedByLang}
        />
      </div>
    </div>
  );
}

export default App;
