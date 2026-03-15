function TaskDescriptions({ selectedChallenge }) {
  return (
    <div className="task-descriptions">
      <h3>Descriptions Challenges</h3>

      {selectedChallenge ? (
        <div>
          <h4>{selectedChallenge.title}</h4>
          <p>{selectedChallenge.description}</p>

          <h4>Expected result</h4>
          <pre>
            {JSON.stringify(selectedChallenge.expected_result, null, 2)}
          </pre>
        </div>
      ) : (
        <p>Select a challenge</p>
      )}
    </div>
  );
}

export default TaskDescriptions;
