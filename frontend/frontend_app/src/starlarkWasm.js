import { Starlark } from "starlark-wasm";

let initPromise = null;

/**
 * Load the starlark WASM binary once (singleton).
 * The file is served from /starlark.wasm (public/).
 */
export function initStarlark() {
  if (!initPromise) {
    initPromise = Starlark.init(process.env.PUBLIC_URL + "/starlark.wasm");
  }
  return initPromise;
}

/**
 * Wrap a single-line expression (or multi-line block without a def) in a
 * `def main(...):` function so starlark-wasm can call it with kwargs.
 * If the code already starts with `def `, it is used as-is.
 */
function wrapCode(code, context) {
  const trimmed = code.trim();

  if (trimmed.startsWith("def ")) {
    // User supplied a full function definition — use as-is
    return trimmed;
  }

  const keys = Object.keys(context);
  const params =
    keys.length > 0
      ? keys.map((k) => `${k}=None`).join(", ") + ", **_"
      : "**_";

  const lines = trimmed.split("\n");
  if (lines.length > 1) {
    // Multi-line block: indent every line and add implicit `return None`
    const indented = lines.map((l) => "    " + l).join("\n");
    return `def main(${params}):\n${indented}`;
  }

  // Single-line expression: return its value
  return `def main(${params}):\n    return ${trimmed}`;
}

/**
 * Normalize a value before comparison (mirrors the Python backend _normalize).
 */
export function normalize(value) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return String(value);
  }
}

/**
 * Compare an obtained result against an expected value.
 * Uses a small tolerance for floating-point numbers.
 */
export function compareResults(obtained, expected) {
  const a = normalize(obtained);
  const b = normalize(expected);
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 0.001;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Evaluate Starlark code in the browser using WebAssembly.
 *
 * @param {string} code     - Starlark expression or `def main(...)` function.
 * @param {object} context  - Variables to inject (top-level, already unwrapped
 *                            from json_input.data if present).
 * @returns {Promise<any>}  - Result returned by the expression / main().
 */
export async function evaluateStarlark(code, context) {
  await initStarlark();

  const fullCode = wrapCode(code, context);

  const runtime = new Starlark({
    load: async (filename) => {
      if (filename === "expr.star") return fullCode;
      throw new Error(`Unknown module: ${filename}`);
    },
    print: () => {},
  });

  return runtime.run("expr.star", "main", [], context, 10);
}
