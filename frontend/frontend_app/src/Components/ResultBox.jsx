function ResultBox({ result }) {
  return (
    <div className="result">
      <strong>Result:</strong>
      <div style={{ whiteSpace: "pre-wrap" }}>
        {result || "Result will be shown here..."}
      </div>
    </div>
  );
}

export default ResultBox;
