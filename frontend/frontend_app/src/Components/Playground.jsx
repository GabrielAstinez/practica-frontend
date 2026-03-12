import { useState, useEffect } from "react";
import JsonInput from "./JsonInput";
import ExpressionInput from "./ExpressionInput";
import Controls from "./Controls";
import ResultBox from "./ResultBox";

function Playground({
  selectedChallenge,
  completedChallenges,
  setCompletedChallenges,
}) {
  const [jsonText, setJsonText] = useState("");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [engine, setEngine] = useState("common");

  useEffect(() => {
    if (selectedChallenge) {
      setJsonText(JSON.stringify(selectedChallenge.json_input, null, 2));
      setExpression("");
      setResult(null);
    }
  }, [selectedChallenge]);

  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    const response = await fetch(
      `http://localhost:8000/api/challenges/${selectedChallenge.id}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expression: expression,
          engine: engine,
        }),
      },
    );

    const data = await response.json();

    // ahora simplemente guardamos el resultado que devuelve el backend
    setResult(data);

    if (data.passed && !completedChallenges.includes(selectedChallenge.id)) {
      setCompletedChallenges([...completedChallenges, selectedChallenge.id]);
    }
  };

  return (
    <div className="playground">
      <JsonInput
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />

      <ExpressionInput
        value={expression}
        onChange={(e) => setExpression(e.target.value)}
        engine={engine}
      />

      <div className="panel">
        <h4>Engine</h4>
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="common">CEL (common)</option>
          <option value="pycel">CEL (pycel)</option>
          <option value="wasm">WebAssembly</option>
          <option value="starlark">Starlark</option>
        </select>
      </div>

      <Controls onSubmit={handleSubmit} disabled={!selectedChallenge} />

      <ResultBox result={result} />
    </div>
  );
}

export default Playground;
