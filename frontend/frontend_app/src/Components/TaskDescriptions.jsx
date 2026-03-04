function TaskDescriptions({ selectedChallenge }) {
  return (
    <div className="task-descriptions">
      <h3>Descriptions Challenges</h3>

      {selectedChallenge ? (
        <div>
          <h4>{selectedChallenge.title}</h4>
          <p>{selectedChallenge.description}</p>
        </div>
      ) : (
        <p>Select a challenge</p>
      )}
    </div>
  );
}

export default TaskDescriptions;
