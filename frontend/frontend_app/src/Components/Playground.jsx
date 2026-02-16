import { useState } from "react";
import JsonInput from "./JsonInput";
import ExpressionInput from "./ExpressionInput";
import Controls from "./Controls";
import ResultBox from "./ResultBox";

function Playground() {
  const [jsonText, setJsonText] = useState("");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");

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

      <Controls
        jsonText={jsonText}
        expression={expression}
        setResult={setResult}
      />

      <ResultBox result={result} />
    </div>
  );
}

export default Playground;
