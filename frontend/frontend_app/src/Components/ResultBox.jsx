function ResultBox({ result }) {
  console.log("RESULT RECIBIDO:", result);

  if (!result) {
    return (
      <div className="result">
        <strong>Result:</strong>
        <div>Result will be shown here...</div>
      </div>
    );
  }

  return (
    <div className="result">
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default ResultBox;
