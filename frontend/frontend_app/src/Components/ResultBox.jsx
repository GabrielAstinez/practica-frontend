function ResultBox({ result }) {
  if (!result) {
    return (
      <div className="result-container">
        <div className="result-empty">
          ⏳ Result will be shown here after evaluation...
        </div>
      </div>
    );
  }

  return (
    <div className={`result-container ${result.passed ? "success" : "fail"}`}>
      <div className="panel-label">
        Evaluation Result: {result.passed ? "✅ PASSED" : "❌ FAILED"}
      </div>
      <div className="result-grid">
        <div className="result-item">
          <strong>Expected:</strong>
          <code>{JSON.stringify(result.expected)}</code>
        </div>
        <div className="result-item">
          <strong>Obtained:</strong>
          <code>{JSON.stringify(result.obtained)}</code>
        </div>
      </div>
      {result.error && <div className="result-error-msg">{result.error}</div>}
    </div>
  );
}

export default ResultBox;
