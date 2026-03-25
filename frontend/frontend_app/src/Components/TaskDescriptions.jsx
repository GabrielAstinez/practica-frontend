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

function TaskDescriptions({
  selectedChallenge,
  completedByEngine,
  completedByLang,
}) {
  const solvedIn = selectedChallenge
    ? Object.entries(completedByEngine)
        .filter(([, ids]) => ids.includes(selectedChallenge.id))
        .map(([eng]) => eng)
    : [];

  return (
    <div className="task-descriptions">
      <h3>Resultado</h3>

      {selectedChallenge ? (
        <div className="task-content">
          <h4>{selectedChallenge.title}</h4>
          <p style={{ opacity: 0.7, fontSize: 13, marginTop: 4 }}>
            {selectedChallenge.description}
          </p>

          <div className="result" style={{ marginTop: 12 }}>
            <strong>Expected:</strong>
            <pre>
              {JSON.stringify(selectedChallenge.expected_result, null, 2)}
            </pre>
          </div>

          <div className="engine-completions" style={{ marginTop: 18 }}>
            <h5>Resuelto con</h5>
            {["CEL", "Starlark", "Lua"].map((lang) => {
              const solved = completedByLang[lang]?.has(selectedChallenge.id);
              return (
                <div className="completion-row" key={lang}>
                  <span style={{ fontWeight: 600 }}>{lang}</span>
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

          <div className="engine-completions" style={{ marginTop: 14 }}>
            <h5>Engine específico</h5>
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
        </div>
      ) : (
        <p>Selecciona un desafío</p>
      )}
    </div>
  );
}

export default TaskDescriptions;
