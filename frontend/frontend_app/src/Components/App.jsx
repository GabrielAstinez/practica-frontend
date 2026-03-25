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

// ── localStorage helpers ──────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem("playground_state");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Revive Sets for completedByLang
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

function saveState(completedByEngine, completedByLang, engine, darkMode) {
  try {
    localStorage.setItem(
      "playground_state",
      JSON.stringify({
        completedByEngine,
        // Sets aren't JSON-serializable, convert to arrays
        completedByLang: {
          CEL: [...completedByLang.CEL],
          Starlark: [...completedByLang.Starlark],
          Lua: [...completedByLang.Lua],
        },
        engine,
        darkMode,
      }),
    );
  } catch {
    // localStorage not available, silently ignore
  }
}

// ── Initial state from localStorage or defaults ───────
const saved = loadState();

const initialCompletedByEngine = saved?.completedByEngine || {};
const initialCompletedByLang = saved?.completedByLang || {
  CEL: new Set(),
  Starlark: new Set(),
  Lua: new Set(),
};
const initialEngine = saved?.engine || "common";
const initialDarkMode = saved?.darkMode ?? false;

// Apply dark mode immediately before first render
if (initialDarkMode) document.body.classList.add("dark");

// ─────────────────────────────────────────────────────
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // always false on reload = captcha required
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  const [completedByEngine, setCompletedByEngine] = useState(
    initialCompletedByEngine,
  );
  const [completedByLang, setCompletedByLang] = useState(
    initialCompletedByLang,
  );
  const [engine, setEngine] = useState(initialEngine);
  const [darkMode, setDarkMode] = useState(initialDarkMode);

  // Persist whenever any tracked state changes
  useEffect(() => {
    saveState(completedByEngine, completedByLang, engine, darkMode);
  }, [completedByEngine, completedByLang, engine, darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.body.classList.toggle("dark", next);
  };

  const engineCompletions = completedByEngine[engine] || [];

  const handleMarkCompleted = (challengeId) => {
    setCompletedByEngine((prev) => {
      const existing = prev[engine] || [];
      if (existing.includes(challengeId)) return prev;
      return { ...prev, [engine]: [...existing, challengeId] };
    });

    const lang = ENGINE_LANGUAGE[engine];
    setCompletedByLang((prev) => {
      if (prev[lang].has(challengeId)) return prev;
      const next = new Set(prev[lang]);
      next.add(challengeId);
      return { ...prev, [lang]: next };
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

      {/* HEADER */}
      <div className="header">
        <div className="header-title">
          <span className="header-icon">⚡</span>
          <div>
            <span className="header-main">Evaluador de Reglas</span>
            <span className="header-accent"> JSON</span>
          </div>
        </div>

        <div className="header-controls">
          {/* Language score counters */}
          <div className="lang-counters">
            <div className="lang-counter cel">
              <span className="lang-counter-label">CEL</span>
              <span className="lang-counter-score">
                {completedByLang.CEL.size}
              </span>
            </div>
            <div className="lang-counter starlark">
              <span className="lang-counter-label">Starlark</span>
              <span className="lang-counter-score">
                {completedByLang.Starlark.size}
              </span>
            </div>
            <div className="lang-counter lua">
              <span className="lang-counter-label">Lua</span>
              <span className="lang-counter-score">
                {completedByLang.Lua.size}
              </span>
            </div>
          </div>

          {/* Engine selector */}
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
          completedByLang={completedByLang}
        />
      </div>
    </div>
  );
}

export default App;
