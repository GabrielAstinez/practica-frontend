function Controls({ onSubmit, disabled }) {
  return (
    <div className="controls">
      <button onClick={onSubmit} disabled={disabled}>
        Submit
      </button>
    </div>
  );
}

export default Controls;
