import { useState, useEffect } from "react";
import ResultBox from "./ResultBox";

import {
  evaluateStarlark,
  compareResults,
  initStarlark,
} from "../starlarkWasm";
import { evaluateCel, initCelWasm } from "../celWasm";
import { evaluateLua, compareLuaResults, initLua } from "../luaWasm";

function Playground({
  selectedChallenge,
  completedChallenges,
  onMarkCompleted,
  engine,
}) {
  const [jsonText, setJsonText] = useState("");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initStarlark().catch(() => {});
    initCelWasm().catch(() => {});
    initLua().catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedChallenge) {
      setJsonText(JSON.stringify(selectedChallenge.json_input, null, 2));
      setExpression("");
      setResult(null);
    }
  }, [selectedChallenge]);

  useEffect(() => {
    setResult(null);
  }, [engine]);

  const handleSubmit = async () => {
    if (!selectedChallenge) return;
    if (!expression.trim()) {
      setResult({
        passed: false,
        expected: selectedChallenge.expected_result,
        obtained: null,
        error: "Expression is empty",
      });
      return;
    }

    setLoading(true);

    try {
      if (engine === "cel-wasm") {
        const obtained = await evaluateCel(expression, {
          data: selectedChallenge.json_input,
        });
        const expected = selectedChallenge.expected_result;
        const passed = compareResults(obtained, expected);
        setResult({ passed, expected, obtained });
        if (passed) onMarkCompleted(selectedChallenge.id);
        return;
      }

      if (engine === "lua") {
        const rawInput = selectedChallenge.json_input;
        const context =
          rawInput.data && typeof rawInput.data === "object"
            ? rawInput.data
            : rawInput;
        const obtained = await evaluateLua(expression, context);
        const expected = selectedChallenge.expected_result;
        const passed = compareLuaResults(obtained, expected);
        setResult({ passed, expected, obtained });
        if (passed) onMarkCompleted(selectedChallenge.id);
        return;
      }

      if (engine === "wasm") {
        const rawInput = selectedChallenge.json_input;
        const context =
          rawInput.data && typeof rawInput.data === "object"
            ? rawInput.data
            : rawInput;
        const obtained = await evaluateStarlark(expression, context);
        const expected = selectedChallenge.expected_result;
        const passed = compareResults(obtained, expected);
        setResult({ passed, expected, obtained });
        if (passed) onMarkCompleted(selectedChallenge.id);
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/challenges/${selectedChallenge.id}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ expression, engine }),
        },
      );

      const data = await response.json();
      setResult(data);
      if (data.passed) onMarkCompleted(selectedChallenge.id);
    } catch (err) {
      setResult({
        passed: false,
        expected: selectedChallenge.expected_result,
        obtained: null,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const isCompleted =
    selectedChallenge && completedChallenges.includes(selectedChallenge.id);

  const expressionRows =
    engine === "starlark" ||
    engine === "wasm" ||
    engine === "lua" ||
    engine === "lua-server"
      ? 10
      : 5;

  return (
    <div className="playground">
      <div className="playground-header">
        {selectedChallenge ? (
          <>
            <span className="challenge-icon">
              {selectedChallenge.icon || "◈"}
            </span>
            <div>
              <h2 className="playground-title">{selectedChallenge.title}</h2>
              <p className="playground-desc">{selectedChallenge.description}</p>
            </div>
            {isCompleted && <span className="badge-done">✓ Solved</span>}
          </>
        ) : (
          <p className="playground-empty">← Select a challenge to begin</p>
        )}
      </div>

      <div className="editor-stack">
        <div className="panel">
          <div className="panel-label">JSON Input</div>
          <textarea
            className="code-area"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>

        <div className="panel">
          <div className="panel-label">
            Expression
            <span className="engine-tag">{engine}</span>
          </div>
          <textarea
            className="code-area"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            rows={expressionRows}
            spellCheck={false}
            placeholder="Write your expression here..."
          />
        </div>
      </div>

      <div className="submit-row">
        <button
          className={`submit-btn ${loading ? "loading" : ""}`}
          onClick={handleSubmit}
          disabled={!selectedChallenge || loading}
        >
          {loading ? "Evaluating…" : "SUBMIT"}
        </button>
      </div>

      <ResultBox result={result} />
    </div>
  );
}

export default Playground;
