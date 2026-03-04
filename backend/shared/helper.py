import json
from shared.pycel_engine import pycel_engine
from shared.cel_common_engine import cel_common_engine


def _normalize(value):
    """
    Convierte resultados del engine a tipos Python normales
    para evitar problemas de comparación.
    """
    try:
        return json.loads(json.dumps(value))
    except Exception:
        return str(value)


def compare_results(obtained, expected):
    return _normalize(obtained) == _normalize(expected)


def evaluate_expression(expression: str, variables: dict, language: str = "CEL", engine: str = "common"):
    if language.upper() == "CEL":
        if engine.lower() == "pycel":
            result = pycel_engine.evaluate(expression, variables)
        elif engine.lower() == "common":
            result = cel_common_engine.evaluate(expression, variables)
        else:
            return {
                "success": False,
                "message": f"Motor CEL no soportado: {engine}",
                "expression": expression
            }
    else:
        return {
            "success": False,
            "message": f"Lenguaje no soportado: {language}",
            "expression": expression
        }

    if result.get("success"):
        result["result"] = _normalize(result.get("result"))

    return result


def validate_expression(expression: str, variables: dict, language: str = "CEL", engine: str = "common"):
    if language.upper() == "CEL":
        if engine.lower() == "pycel":
            return pycel_engine.validate(expression, variables)
        elif engine.lower() == "common":
            return cel_common_engine.validate(expression, variables)
        else:
            return {
                "success": False,
                "message": f"Motor CEL no soportado: {engine}",
                "expression": expression
            }
    else:
        return {
            "success": False,
            "message": f"Lenguaje no soportado: {language}",
            "expression": expression
        }