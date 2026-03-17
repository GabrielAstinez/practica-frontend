"""
Lua Engine (server-side)
Evaluates Lua expressions and scripts using the lupa library (Lua 5.4 bindings).
"""

import lupa
from typing import Any


def _to_lua(lua_rt: lupa.LuaRuntime, val: Any) -> Any:
    """Recursively convert Python values into Lua-compatible types."""
    if isinstance(val, dict):
        return lua_rt.table_from({k: _to_lua(lua_rt, v) for k, v in val.items()})
    if isinstance(val, list):
        return lua_rt.table(*[_to_lua(lua_rt, v) for v in val])
    return val


def _from_lua(val: Any) -> Any:
    """Recursively convert Lua result values back to plain Python types."""
    if lupa.lua_type(val) == "table":
        keys = list(val.keys())
        int_keys = sorted(k for k in keys if isinstance(k, int))
        # Sequential integer keys starting at 1 → Python list
        if int_keys and int_keys == list(range(1, len(int_keys) + 1)) and len(int_keys) == len(keys):
            return [_from_lua(val[k]) for k in int_keys]
        # Otherwise → Python dict
        return {str(k): _from_lua(v) for k, v in val.items()}
    return val


def _wrap_script(code: str) -> str:
    """
    Wrap code in an anonymous self-calling function so both expressions and
    multi-statement scripts work uniformly via lua.eval().

    Single-line code without an explicit 'return' gets one prepended:
        price > 80  →  (function() return price > 80 end)()

    Multi-line or code that already contains 'return':
        local r={}     →  (function()
        ...                 local r={}
        return r            ...
                            return r
                        end)()
    """
    trimmed = code.strip()
    lines = trimmed.splitlines()
    has_return = any(line.strip().startswith("return") for line in lines)

    if not has_return and len(lines) == 1:
        body = f"return {trimmed}"
    else:
        body = trimmed

    # Indent body for readability (not required but helps Lua error messages)
    indented = "\n".join("  " + l for l in body.splitlines())
    return f"(function()\n{indented}\nend)()"


class LuaEngine:
    """Server-side Lua engine using lupa (Lua 5.4)."""

    def _prepare_context(self, context: dict) -> dict:
        """Unwrap the 'data' envelope that json_input carries."""
        if "data" in context and isinstance(context["data"], dict):
            return context["data"]
        return context

    def evaluate(self, expression: str, context: dict) -> dict:
        try:
            lua = lupa.LuaRuntime(unpack_returned_tuples=True)
            flat_ctx = self._prepare_context(context)

            # Inject context variables as Lua globals
            for key, value in flat_ctx.items():
                lua.globals()[key] = _to_lua(lua, value)

            script = _wrap_script(expression)
            raw = lua.eval(script)
            result = _from_lua(raw)

            return {"success": True, "result": result}

        except lupa.LuaSyntaxError as e:
            return {"success": False, "result": None, "message": f"Syntax error: {e}"}
        except lupa.LuaError as e:
            return {"success": False, "result": None, "message": f"Runtime error: {e}"}
        except Exception as e:
            return {"success": False, "result": None, "message": str(e)}

    def validate(self, expression: str, context: dict) -> dict:
        """Validate Lua syntax without executing anything that changes state."""
        try:
            lua = lupa.LuaRuntime(unpack_returned_tuples=True)
            script = _wrap_script(expression)
            # load() compiles but does not run; if compilation fails lupa raises LuaSyntaxError
            lua.eval(f"load([[\n{script}\n]])")
            return {"success": True, "message": "Expresión Lua válida", "expression": expression}
        except lupa.LuaSyntaxError as e:
            return {"success": False, "message": f"Syntax error: {e}", "expression": expression}
        except Exception as e:
            return {"success": False, "message": str(e), "expression": expression}


lua_engine = LuaEngine()
