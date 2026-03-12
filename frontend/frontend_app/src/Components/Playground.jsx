import { useState, useEffect } from "react";
import JsonInput from "./JsonInput";
import ExpressionInput from "./ExpressionInput";
import Controls from "./Controls";
import ResultBox from "./ResultBox";
import { evaluateStarlark, compareResults, initStarlark } from "../starlarkWasm";

function Playground({
  selectedChallenge,
  completedChallenges,
  setCompletedChallenges,
}) {
  const [jsonText, setJsonText] = useState("");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [engine, setEngine] = useState("common");

  // Preload the WASM binary in the background on mount
  useEffect(() => {
    initStarlark().catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedChallenge) {
      setJsonText(JSON.stringify(selectedChallenge.json_input, null, 2));
      setExpression("");
      setResult("");
    }
  }, [selectedChallenge]);

  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    // ── WebAssembly path: evaluate entirely in the browser ──────────────────
    if (engine === "wasm") {
      try {
        const rawInput = selectedChallenge.json_input;
        const context =
          rawInput.data && typeof rawInput.data === "object"
            ? rawInput.data
            : rawInput;

        const wasmResult = await evaluateStarlark(expression, context);
        const obtained = wasmResult;
        const expected = selectedChallenge.expected_result;
        const passed = compareResults(obtained, expected);

        setResult(
          `Engine: wasm (browser)\n\nResult: ${JSON.stringify(obtained)}\n\nExpected: ${JSON.stringify(expected)}\n\nStatus: ${passed ? "Correct ✅" : "Incorrect ❌"}`
        );

        if (passed && !completedChallenges.includes(selectedChallenge.id)) {
          setCompletedChallenges([...completedChallenges, selectedChallenge.id]);
        }
      } catch (err) {
        setResult(`Error: ${err.message}`);
      }
      return;
    }

    // ── Backend path (CEL / Starlark server-side) ───────────────────────────
    const response = await fetch(
      `http://localhost:8000/api/challenges/${selectedChallenge.id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: expression,
          engine: engine,
        }),
      },
    );

    const data = await response.json();

    if (!data.success) {
      setResult(`Error: ${data.message}`);
      return;
    }

    const resultText = `
Engine: ${engine}

Result: ${JSON.stringify(data.obtained)}

Expected: ${JSON.stringify(data.expected)}

Status: ${data.passed ? "Correct ✅" : "Incorrect ❌"}
`;

    setResult(resultText);

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
