import Playground from "./Playground";
import Challenges from "./Challenges";
import TaskDescriptions from "./TaskDescriptions";

function App() {
  return (
    <div className="layout">
      <TaskDescriptions />
      <Playground />
      <Challenges />
    </div>
  );
}

export default App;
