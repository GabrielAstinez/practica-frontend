import JsonInput from "./JsonInput";
import ExpressionInput from "./ExpressionInput";
import Controls from "./Controls";
import ResultBox from "./ResultBox";

function Playground() {
  return (
    <div className="playground">
      <JsonInput />
      <ExpressionInput />
      <Controls />
      <ResultBox />

      {/* Boton abajo del playground */}
      <div className="playground-footer">
        <JsonInput />
        <ExpressionInput />
        <Controls />
        <ResultBox />
      </div>
    </div>
  );
}

export default Playground;
