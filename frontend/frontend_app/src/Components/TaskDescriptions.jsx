const ENGINE_NAMES = {
  common: "CEL (common)",
  pycel: "CEL (pycel)",
  "cel-go": "CEL (Go)",
  "cel-wasm": "CEL (WASM)",
  wasm: "Starlark (WASM)",
  starlark: "Starlark (server)",
  "lua-server": "Lua (server)",
  lua: "Lua (WASM)",
};

function TaskDescriptions({ selectedChallenge, completedByEngine }) {
  // Which engines have solved this challenge?
  const solvedIn = selectedChallenge
    ? Object.entries(completedByEngine)
        .filter(([, ids]) => ids.includes(selectedChallenge.id))
        .map(([eng]) => eng)
    : [];

  return (
    <div className="task-descriptions">
      <h3>Resultado</h3>

      <div className="task-content">
        {selectedChallenge ? (
          <>
            <h4>{selectedChallenge.title}</h4>
            <p style={{ opacity: 0.7, fontSize: 13 }}>
              {selectedChallenge.description}
            </p>

            <div className="result" style={{ marginTop: 12 }}>
              <strong>Expected:</strong>
              <pre>
                {JSON.stringify(selectedChallenge.expected_result, null, 2)}
              </pre>
            </div>

            {/* Per-engine completion for this challenge */}
            <div className="engine-completions">
              <h5>Solved with</h5>
              {Object.entries(ENGINE_NAMES).map(([eng, label]) => {
                const solved = solvedIn.includes(eng);
                return (
                  <div className="completion-row" key={eng}>
                    <span>{label}</span>
                    <span
                      className={
                        solved ? "completion-check" : "completion-pending"
                      }
                    >
                      {solved ? "✔" : "○"}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <p>Selecciona un desafío</p>
        )}
      </div>
    </div>
  );
}

export default TaskDescriptions;
