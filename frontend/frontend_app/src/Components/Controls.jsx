function Controls({ jsonText, expression, setResult }) {
  const handleValidate = async () => {
    try {
      const parsedData = JSON.parse(jsonText);

      const response = await fetch("http://localhost:8000/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "CEL",
          expression: expression,
          data: parsedData.data,
        }),
      });

      const result = await response.json();
      setResult(JSON.stringify(result));
    } catch (error) {
      setResult("Error al validar");
    }
  };

  const handleEvaluate = async () => {
    try {
      const parsedData = JSON.parse(jsonText);

      const response = await fetch("http://localhost:8000/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "CEL",
          expression: expression,
          data: parsedData.data,
        }),
      });

      const result = await response.json();
      setResult(JSON.stringify(result));
    } catch (error) {
      setResult("Error al evaluar");
    }
  };

  return (
    <div className="controls">
      <select>
        <option>CEL</option>
        <option>STARLARK</option>
      </select>

      <div className="control-group">
        <span>Mode: </span>
        <select>
          <option>API Backend</option>
        </select>
      </div>

      <button onClick={handleValidate}>Validate</button>
      <button onClick={handleEvaluate}>Evaluate</button>
    </div>
  );
}

export default Controls;
