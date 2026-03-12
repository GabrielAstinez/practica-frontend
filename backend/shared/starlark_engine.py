"""
Starlark Engine
Implementación usando starlark-pyo3 (Rust-backed) para evaluar código Starlark
"""

import re
import starlark
from datetime import datetime, timezone
from typing import Dict, Any


def _parse_timestamp(s: str) -> float:
    """Convierte un string ISO 8601 a timestamp Unix float (segundos)"""
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(timezone.utc).timestamp()


def _matches(s: str, pattern: str) -> bool:
    """Evalúa si `s` cumple el patrón regex `pattern`"""
    return bool(re.search(pattern, s))


class StarlarkEngine:
    """Motor de evaluación de código Starlark"""

    def _prepare_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extrae el contenido de 'data' al nivel superior, igual que los otros engines
        """
        if "data" in context and isinstance(context["data"], dict):
            return context["data"]
        return context

    def _build_module(self, context: Dict[str, Any]) -> starlark.Module:
        """
        Crea un Module de Starlark con:
          - las variables del contexto como globals
          - helpers: sum(), matches(), timestamp()
        """
        module = starlark.Module()
        for key, value in context.items():
            module[key] = value

        # Helpers no disponibles en Starlark estándar
        module.add_callable("sum", sum)
        module.add_callable("matches", _matches)
        module.add_callable("timestamp", _parse_timestamp)
        return module

    def validate(self, expression: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida la sintaxis del código Starlark sin evaluarlo.
        """
        try:
            starlark.parse("expression.star", expression)
            return {
                "success": True,
                "message": "Expresión Starlark válida",
                "expression": expression,
            }
        except starlark.StarlarkError as e:
            return {
                "success": False,
                "message": "Error de sintaxis en expresión Starlark",
                "error": str(e),
                "expression": expression,
            }
        except Exception as e:
            return {
                "success": False,
                "message": "Error al validar expresión Starlark",
                "error": f"{type(e).__name__}: {str(e)}",
                "expression": expression,
            }

    def evaluate(self, expression: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evalúa código Starlark con el contexto proporcionado.
        El resultado es el valor de la última expresión del código.

        Args:
            expression: Código Starlark a evaluar (puede ser multi-línea)
            context: Diccionario con variables para la evaluación

        Returns:
            Dict con el resultado de la evaluación
        """
        try:
            eval_context = self._prepare_context(context)
            module = self._build_module(eval_context)

            ast = starlark.parse("expression.star", expression)
            result = starlark.eval(module, ast, starlark.Globals.standard())

            return {
                "success": True,
                "result": result,
                "expression": expression,
                "data": context,
            }

        except starlark.StarlarkError as e:
            error_msg = str(e)
            if "Parse error" in error_msg or "expected" in error_msg.lower():
                message = "Error de sintaxis en expresión Starlark"
            elif "Variable" in error_msg and "not found" in error_msg:
                message = "Variable no definida en el contexto"
            elif "type" in error_msg.lower():
                message = "Error de tipo en la evaluación"
            else:
                message = "Error al evaluar expresión Starlark"
            return {
                "success": False,
                "message": message,
                "error": error_msg,
                "expression": expression,
            }

        except Exception as e:
            return {
                "success": False,
                "message": "Error inesperado al evaluar expresión Starlark",
                "error": f"{type(e).__name__}: {str(e)}",
                "expression": expression,
            }


# Instancia global del motor
starlark_engine = StarlarkEngine()
