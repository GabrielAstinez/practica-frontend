import json
import os
import subprocess
import sys

# Path to the compiled Go binary (relative to this file's directory)
_BINARY = os.path.join(os.path.dirname(__file__), "..", "cel_go", "cel_evaluator")
if sys.platform == "win32":
    _BINARY += ".exe"


class CelGoEngine:
    """Evaluates CEL expressions by delegating to the native Go cel-go binary."""

    def evaluate(self, expression: str, context: dict) -> dict:
        try:
            payload = json.dumps({"expression": expression, "context": context})
            proc = subprocess.run(
                [_BINARY],
                input=payload.encode("utf-8"),
                capture_output=True,
                timeout=10,
            )
            if proc.returncode != 0:
                stderr = proc.stderr.decode("utf-8", errors="replace").strip()
                return {"success": False, "result": None, "message": f"Binary error: {stderr}"}

            output = json.loads(proc.stdout.decode("utf-8"))
            return output

        except FileNotFoundError:
            return {
                "success": False,
                "result": None,
                "message": (
                    "cel_evaluator binary not found. "
                    "Run: cd backend/cel_go && go build -o cel_evaluator.exe ."
                ),
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "result": None, "message": "Evaluation timed out (>10s)"}
        except json.JSONDecodeError as e:
            return {"success": False, "result": None, "message": f"Invalid binary output: {e}"}
        except Exception as e:
            return {"success": False, "result": None, "message": str(e)}


cel_go_engine = CelGoEngine()
