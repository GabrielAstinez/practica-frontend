function Controls() {
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

      <button>Validate</button>
      <button>Evaluate</button>
    </div>
  );
}

export default Controls;
