import { init, Env, CELFunction, listType, Options } from "wasm-cel/browser";

const PUBLIC = process.env.PUBLIC_URL || "";

let initPromise = null;

/**
 * Load the CEL WASM binary once (singleton).
 * Assets are served from /cel.wasm and /wasm_exec.js (public/).
 */
export function initCelWasm() {
  if (!initPromise) {
    initPromise = init(PUBLIC + "/cel.wasm", PUBLIC + "/wasm_exec.js");
  }
  return initPromise;
}

/**
 * Infer the CEL type string from a JavaScript value.
 * Nested maps (objects) use "dyn" to allow any value type at runtime.
 */
function inferCelType(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "string") return "string";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "int" : "double";
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: "list", elementType: "dyn" };
    const elementType = inferCelType(value[0]);
    return { kind: "list", elementType };
  }
  if (typeof value === "object") {
    return { kind: "map", keyType: "string", valueType: "dyn" };
  }
  return "dyn";
}

/**
 * Custom `sum(list)` function — not in standard CEL/Go but used for ch12.
 * Accepts list<int> or list<double>.
 */
const sumIntFn = CELFunction.new("sum")
  .param("list", listType("int"))
  .returns("int")
  .implement((list) => list.reduce((a, b) => a + b, 0));

const sumDblFn = CELFunction.new("sum")
  .param("list", listType("double"))
  .returns("double")
  .implement((list) => list.reduce((a, b) => a + b, 0));

/**
 * Evaluate a CEL expression in the browser using the wasm-cel WebAssembly module.
 *
 * @param {string}  expression - CEL expression string.
 * @param {object}  context    - Variables (already unwrapped from json_input.data).
 * @returns {Promise<any>}     - Result of the expression.
 */
export async function evaluateCel(expression, context) {
  await initCelWasm();

  const variables = Object.entries(context).map(([name, value]) => ({
    name,
    type: inferCelType(value),
  }));

  const env = await Env.new({
    variables,
    functions: [sumIntFn, sumDblFn],
    options: [Options.crossTypeNumericComparisons()],
  });
  const program = await env.compile(expression);
  return program.eval(context);
}
