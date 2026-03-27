"""
CEL (Common Expression Language) Engine
Implementación usando cel-python para evaluar expresiones CEL
"""

import json
import celpy
import celpy.celtypes
from typing import Dict, Any


def _to_cel_activation(context: Dict[str, Any]) -> Dict:
    """
    Converts a plain Python dict to a celpy activation where every value is
    a proper CEL type (MapType, ListType, StringType, IntType, …).

    celpy requires this because field-selection (e.g. ``user.name``) only
    works on celtypes.MapType, not on a plain Python dict.
    Using CELJSONDecoder is the canonical way to do this conversion.
    """
    # Unwrap the 'data' wrapper that the API always adds
    raw = context.get("data", context)
    cel_map = json.loads(json.dumps(raw), cls=celpy.CELJSONDecoder)
    # Unpack the top-level MapType into a plain dict so each key becomes a
    # named variable in the CEL activation
    return {k: v for k, v in cel_map.items()}


def _sum_fn(*args):
    """Custom ``sum(list)`` function – not in standard celpy."""
    lst = args[0]
    total = celpy.celtypes.DoubleType(0)
    for v in lst:
        total = celpy.celtypes.DoubleType(float(total) + float(v))
    return total


_CUSTOM_FUNCTIONS = {"sum": _sum_fn}


class CELEngine:
    """Motor de evaluación de expresiones CEL"""

    def __init__(self):
        self.env = celpy.Environment()
    
    def validate(self, expression: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida si una expresión CEL es sintácticamente correcta
        
        Args:
            expression: Expresión CEL a validar
            context: Variables disponibles para la evaluación
            
        Returns:
            Dict con resultado de validación
        """
        try:
            # Compilar la expresión CEL para validar sintaxis
            _ = self.env.compile(expression)
            
            return {
                "success": True,
                "message": "Expresión CEL válida",
                "expression": expression
            }
            
        except celpy.CELParseError as e:
            return {
                "success": False,
                "message": "Error de sintaxis en expresión CEL",
                "error": str(e),
                "expression": expression
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": "Error al validar expresión CEL",
                "error": str(e),
                "expression": expression
            }
    
    def evaluate(self, expression: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evalúa una expresión CEL con el contexto proporcionado
        
        Args:
            expression: Expresión CEL a evaluar
            context: Diccionario con variables para la evaluación
            
        Returns:
            Dict con resultado de la evaluación
        """
        try:
            # Preparar contexto como tipos CEL nativos
            activation = _to_cel_activation(context)

            # Compilar la expresión CEL
            ast = self.env.compile(expression)

            # Crear el programa ejecutable (con sum() custom)
            program = self.env.program(ast, functions=_CUSTOM_FUNCTIONS)

            # Evaluar con el contexto proporcionado
            result = program.evaluate(activation)
            
            return {
                "success": True,
                "result": result,
                "expression": expression,
                "data": context
            }
            
        except celpy.CELParseError as e:
            return {
                "success": False,
                "message": "Error de sintaxis en expresión CEL",
                "error": str(e),
                "expression": expression
            }
            
        except celpy.CELEvalError as e:
            return {
                "success": False,
                "message": "Error al evaluar expresión CEL",
                "error": str(e),
                "expression": expression
            }
            
        except KeyError as e:
            return {
                "success": False,
                "message": "Variable no definida en el contexto",
                "error": f"Variable no encontrada: {str(e)}",
                "expression": expression
            }
            
        except AttributeError as e:
            return {
                "success": False,
                "message": "Atributo no encontrado",
                "error": str(e),
                "expression": expression
            }
            
        except Exception as e:
            return {
                "success": False,
                "message": "Error inesperado al evaluar expresión CEL",
                "error": f"{type(e).__name__}: {str(e)}",
                "expression": expression
            }


# Instancia global del motor CEL
pycel_engine = CELEngine()
