function ExpressionInput({ value, onChange }) {
  return (
    <div className="panel">
      <h4>Expression</h4>
      <input type="text" value={value} onChange={onChange} />
    </div>
  );
}

export default ExpressionInput;
