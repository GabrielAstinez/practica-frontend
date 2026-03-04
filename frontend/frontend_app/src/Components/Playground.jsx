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
  const [result, setResult] = useState("");

  useEffect(() => {
    if (selectedChallenge) {
      setJsonText(JSON.stringify(selectedChallenge.json_input, null, 2));
      setExpression("");
      setResult("");
    }
  }, [selectedChallenge]);

  const handleSubmit = async () => {
    if (!selectedChallenge) return;

    const response = await fetch(
      `http://localhost:8000/api/challenges/${selectedChallenge.id}/submit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expression: expression,
          engine: "common",
        }),
      },
    );

    const data = await response.json();

    if (data.passed) {
      setResult("Correct ✅");

      if (!completedChallenges.includes(selectedChallenge.id)) {
        setCompletedChallenges([...completedChallenges, selectedChallenge.id]);
      }
    } else {
      setResult("Incorrect ❌");
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
      />

      <Controls onSubmit={handleSubmit} disabled={!selectedChallenge} />

      <ResultBox result={result} />
    </div>
  );
}

export default Playground;
