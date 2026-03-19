import { useState, useEffect } from "react";
import JsonInput from "./JsonInput";
import ExpressionInput from "./ExpressionInput";
import Controls from "./Controls";
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
  setCompletedChallenges,
}) {
  const [jsonText, setJsonText] = useState("");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [engine, setEngine] = useState("common");

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

  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    if (!expression.trim()) {
      setResult({
        passed: false,
        expected: selectedChallenge.expected_result,
        obtained: null,
        error: "Expresión vacía",
      });
      return;
    }

    // ── CEL WebAssembly ────────────────────────────────────────────────
    if (engine === "cel-wasm") {
      try {
        const rawInput = selectedChallenge.json_input;
        const context = {
          data: rawInput,
        };

        const obtained = await evaluateCel(expression, context);
        const expected = selectedChallenge.expected_result;
        const passed = compareResults(obtained, expected);

        setResult({
          passed,
          expected,
          obtained,
        });

        if (passed && !completedChallenges.includes(selectedChallenge.id)) {
          setCompletedChallenges([
            ...completedChallenges,
            selectedChallenge.id,
          ]);
        }
      } catch (err) {
        setResult({
          passed: false,
          expected: selectedChallenge.expected_result,
          obtained: null,
          error: err.message,
        });
      }
      return;
    }

    // ── Lua WebAssembly ────────────────────────────────────────────────
    if (engine === "lua") {
      try {
        const rawInput = selectedChallenge.json_input;
        const context =
          rawInput.data && typeof rawInput.data === "object"
            ? rawInput.data
            : rawInput;

        const obtained = await evaluateLua(expression, context);
        const expected = selectedChallenge.expected_result;
        const passed = compareLuaResults(obtained, expected);

        setResult({
          passed,
          expected,
          obtained,
        });

        if (passed && !completedChallenges.includes(selectedChallenge.id)) {
          setCompletedChallenges([
            ...completedChallenges,
            selectedChallenge.id,
          ]);
        }
      } catch (err) {
        setResult({
          passed: false,
          expected: selectedChallenge.expected_result,
          obtained: null,
          error: err.message,
        });
      }
      return;
    }

    // ── Starlark WebAssembly ───────────────────────────────────────────
    if (engine === "wasm") {
      try {
        const rawInput = selectedChallenge.json_input;
        const context =
          rawInput.data && typeof rawInput.data === "object"
            ? rawInput.data
            : rawInput;

        const obtained = await evaluateStarlark(expression, context);
        const expected = selectedChallenge.expected_result;
        const passed = compareResults(obtained, expected);

        setResult({
          passed,
          expected,
          obtained,
        });

        if (passed && !completedChallenges.includes(selectedChallenge.id)) {
          setCompletedChallenges([
            ...completedChallenges,
            selectedChallenge.id,
          ]);
        }
      } catch (err) {
        setResult({
          passed: false,
          expected: selectedChallenge.expected_result,
          obtained: null,
          error: err.message,
        });
      }
      return;
    }

    // ── Backend ────────────────────────────────────────────────────────
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
          <option value="cel-go">CEL (Go)</option>
          <option value="cel-wasm">CEL (WebAssembly)</option>
          <option value="wasm">Starlark (WebAssembly)</option>
          <option value="starlark">Starlark (server)</option>
          <option value="lua-server">Lua (server)</option>
          <option value="lua">Lua (WebAssembly)</option>
        </select>
      </div>

      <Controls onSubmit={handleSubmit} disabled={!selectedChallenge} />

      <ResultBox result={result} />
    </div>
  );
}

export default Playground;
