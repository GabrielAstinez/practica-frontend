def evaluate_expression(expression: str, variables: dict):
    result = eval(expression, {}, variables)

    return {
        "success": True,
        "result": result,
        "expression": expression,
        "data": variables
    }


def validate_expression(expression: str, variables: dict):
    try:
        eval(expression, {}, variables)

        return {
            "success": True,
            "message": "Expresión válida",
            "expression": expression
        }

    except NameError as e:
        return {
            "success": False,
            "message": "Variable no definida",
            "error": str(e)
        }

    except SyntaxError as e:
        return {
            "success": False,
            "message": "Error de sintaxis",
            "error": str(e)
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Error en la expresión",
            "error": str(e)
        }