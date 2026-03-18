import { LuaFactory } from "wasmoon";

let factoryPromise = null;

/**
 * Initialise the Lua WASM factory once (singleton).
 * wasmoon bundles its own glue.wasm — no public/ file needed.
 */
export function initLua() {
  if (!factoryPromise) {
    factoryPromise = Promise.resolve(new LuaFactory());
  }
  return factoryPromise;
}

/**
 * Normalize a value before comparison (same logic as starlarkWasm.js).
 */
function normalize(value) {
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
export function compareLuaResults(obtained, expected) {
  const a = normalize(obtained);
  const b = normalize(expected);
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 0.001;
  }
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Evaluate Lua code in the browser via wasmoon (WebAssembly).
 *
 * The code may be:
 *   - A single expression (no "return"): automatically prefixed with "return"
 *   - A multi-line block that ends with an explicit "return ..."
 *
 * Context variables are injected as Lua globals before execution.
 *
 * @param {string} code     - Lua expression or multi-line script.
 * @param {object} context  - Variables to inject (already unwrapped from data).
 * @returns {Promise<any>}  - Value returned by the Lua script.
 */
export async function evaluateLua(code, context) {
  const factory = await initLua();
  const lua = await factory.createEngine();

  try {
    // Inject context variables as Lua globals
    for (const [key, value] of Object.entries(context)) {
      lua.global.set(key, value);
    }

    // Auto-prepend "return" for single-line expressions that lack it
    const trimmed = code.trim();
    const lines = trimmed.split("\n");
    const hasReturn = lines.some((l) => l.trim().startsWith("return"));
    const script = hasReturn || lines.length > 1 ? trimmed : `return ${trimmed}`;

    return await lua.doString(script);
  } finally {
    lua.global.close();
  }
}
