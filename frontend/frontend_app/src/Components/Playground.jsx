import { useState, useEffect, useRef } from "react";
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
  onSaveAnswer,
  savedAnswers,
  engine,
  executeInAll,
}) {
  const [jsonText, setJsonText] = useState("");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Referencia para leer savedAnswers sin disparar el useEffect
  const savedAnswersRef = useRef(savedAnswers);

  // Mantener la referencia actualizada
  useEffect(() => {
    savedAnswersRef.current = savedAnswers;
  }, [savedAnswers]);

  useEffect(() => {
    initStarlark().catch(() => {});
    initCelWasm().catch(() => {});
    initLua().catch(() => {});
  }, []);

  // Efecto corregido para evitar el parpadeo y eliminar el warning
  useEffect(() => {
    if (selectedChallenge) {
      setJsonText(JSON.stringify(selectedChallenge.json_input, null, 2));

      const key = `${selectedChallenge.id}_${engine}`;
      // Leemos de la Ref, así savedAnswers no es dependencia
      const saved = savedAnswersRef.current[key] || "";

      setExpression(saved);
      setResult(null);
    }
  }, [selectedChallenge?.id, engine, selectedChallenge]);

  const runEvaluation = async (targetEngine, expr) => {
    const rawInput = selectedChallenge.json_input;
    const context =
      rawInput.data && typeof rawInput.data === "object"
        ? rawInput.data
        : rawInput;

    if (targetEngine === "cel-wasm") {
      const obtained = await evaluateCel(expr, context);
      const passed = compareResults(
        obtained,
        selectedChallenge.expected_result,
      );
      return { passed, expected: selectedChallenge.expected_result, obtained };
    }
    if (targetEngine === "lua") {
      const obtained = await evaluateLua(expr, context);
      const passed = compareLuaResults(
        obtained,
        selectedChallenge.expected_result,
      );
      return { passed, expected: selectedChallenge.expected_result, obtained };
    }
    if (targetEngine === "wasm") {
      const obtained = await evaluateStarlark(expr, context);
      const passed = compareResults(
        obtained,
        selectedChallenge.expected_result,
      );
      return { passed, expected: selectedChallenge.expected_result, obtained };
    }

    const response = await fetch(
      `http://localhost:8000/api/challenges/${selectedChallenge.id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expression: expr, engine: targetEngine }),
      },
    );
    return await response.json();
  };

  const handleSubmit = async () => {
    if (!selectedChallenge || !expression.trim()) return;
    setLoading(true);

    try {
      if (executeInAll) {
        const engines = [
          "common",
          "pycel",
          "cel-go",
          "cel-wasm",
          "wasm",
          "starlark",
          "lua-server",
          "lua",
        ];
        let currentRes = null;

        for (const e of engines) {
          try {
            const res = await runEvaluation(e, expression);
            if (res.passed) {
              onMarkCompleted(selectedChallenge.id, e);
              onSaveAnswer(selectedChallenge.id, e, expression);
            }
            if (e === engine) currentRes = res;
          } catch (err) {
            console.error(`Error in engine ${e}:`, err);
          }
        }
        setResult(currentRes || { error: "Execution completed" });
      } else {
        const res = await runEvaluation(engine, expression);
        setResult(res);
        if (res.passed) {
          onMarkCompleted(selectedChallenge.id, engine);
          onSaveAnswer(selectedChallenge.id, engine, expression);
        }
      }
    } catch (err) {
      setResult({ passed: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const isCompleted =
    selectedChallenge && completedChallenges.includes(selectedChallenge.id);

  return (
    <div className="playground">
      <div className="playground-header">
        {selectedChallenge ? (
          <>
            <span className="challenge-icon">
              {selectedChallenge.icon || "◈"}
            </span>
            <div style={{ flex: 1 }}>
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
          <textarea className="code-area" value={jsonText} readOnly rows={8} />
          <div className="hint">
            💡 <b>Hint:</b> All JSON inputs start with <code>data</code> as
            root. Omit root in expression. Example: <code>user.name</code>.
          </div>
        </div>

        <div className="panel">
          <div className="panel-label">
            Expression <span className="engine-tag">{engine}</span>
          </div>
          <textarea
            className="code-area"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="submit-row">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || !selectedChallenge}
        >
          {loading ? "Evaluating…" : executeInAll ? "SUBMIT TO ALL" : "SUBMIT"}
        </button>
      </div>

      <ResultBox result={result} />
    </div>
  );
}

export default Playground;
