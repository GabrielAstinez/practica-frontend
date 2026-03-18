function ExpressionInput({ value, onChange, engine }) {
  const isMultiLine = engine === "starlark" || engine === "wasm" || engine === "lua" || engine === "lua-server";
  const engineLabel = {
    "starlark": "Starlark",
    "wasm": "Starlark/WASM",
    "cel-wasm": "CEL/WASM",
    "lua": "Lua/WASM",
    "cel-go": "CEL/Go",
    "lua-server": "Lua/server",
  }[engine];
  return (
    <div className="panel">
      <h4>
        Expression{" "}
        {engineLabel && (
          <span style={{ fontWeight: "normal", fontSize: "0.85em", color: "#888" }}>
            ({engineLabel})
          </span>
        )}
      </h4>
      <textarea
        value={value}
        onChange={onChange}
        rows={isMultiLine ? 6 : 2}
        style={{ fontFamily: "monospace", width: "100%", resize: "vertical" }}
      />
    </div>
  );
}

export default ExpressionInput;
