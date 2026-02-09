function JsonInput({ value, onChange }) {
  return (
    <div className="panel">
      <h4>JSON Input</h4>
      <textarea value={value} onChange={onChange} rows={6} />
    </div>
  );
}

export default JsonInput;
