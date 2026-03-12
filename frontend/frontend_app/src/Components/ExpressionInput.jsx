function ExpressionInput({ value, onChange, engine }) {
  const isMultiLine = engine === "starlark" || engine === "wasm";
  return (
    <div className="panel">
      <h4>
        Expression{" "}
        {isMultiLine && (
          <span style={{ fontWeight: "normal", fontSize: "0.85em", color: "#888" }}>
            ({engine === "wasm" ? "Starlark/WASM" : "Starlark"})
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
