function ExpressionInput({ value, onChange, engine }) {
  const isStarlark = engine === "starlark";
  return (
    <div className="panel">
      <h4>Expression {isStarlark && <span style={{ fontWeight: "normal", fontSize: "0.85em", color: "#888" }}>(Starlark)</span>}</h4>
      <textarea
        value={value}
        onChange={onChange}
        rows={isStarlark ? 6 : 2}
        style={{ fontFamily: "monospace", width: "100%", resize: "vertical" }}
      />
    </div>
  );
}

export default ExpressionInput;
