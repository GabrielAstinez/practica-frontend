from .pycel_engine import pycel_engine
from .cel_common_engine import cel_common_engine


def evaluate_expression(expression: str, variables: dict, language: str = "CEL", engine: str = "common"):
    """
    Evalúa una expresión en el lenguaje especificado
    
    Args:
        expression: Expresión a evaluar
        variables: Contexto de variables
        language: Lenguaje de la expresión (CEL o Starlark)
        engine: Motor CEL a usar ('pycel' o 'common'). Default: 'common'
    """
    if language.upper() == "CEL":
        if engine.lower() == "pycel":
            return pycel_engine.evaluate(expression, variables)
        elif engine.lower() == "common":
            return cel_common_engine.evaluate(expression, variables)
        else:
            return {
                "success": False,
                "message": f"Motor CEL no soportado: {engine}. Use 'pycel' o 'common'",
                "expression": expression
            }
    elif language.upper() == "STARLARK":
        # TODO: Implementar Starlark
        return {
            "success": False,
            "message": "Starlark aún no implementado",
            "expression": expression
        }
    else:
        return {
            "success": False,
            "message": f"Lenguaje no soportado: {language}",
            "expression": expression
        }


def validate_expression(expression: str, variables: dict, language: str = "CEL", engine: str = "common"):
    """
    Valida una expresión en el lenguaje especificado
    
    Args:
        expression: Expresión a validar
        variables: Contexto de variables
        language: Lenguaje de la expresión (CEL o Starlark)
        engine: Motor CEL a usar ('pycel' o 'common'). Default: 'common'
    """
    if language.upper() == "CEL":
        if engine.lower() == "pycel":
            return pycel_engine.validate(expression, variables)
        elif engine.lower() == "common":
            return cel_common_engine.validate(expression, variables)
        else:
            return {
                "success": False,
                "message": f"Motor CEL no soportado: {engine}. Use 'pycel' o 'common'",
                "expression": expression
            }
    elif language.upper() == "STARLARK":
        # TODO: Implementar Starlark
        return {
            "success": False,
            "message": "Starlark aún no implementado",
            "expression": expression
        }
    else:
        return {
            "success": False,
            "message": f"Lenguaje no soportado: {language}",
            "expression": expression
        }
