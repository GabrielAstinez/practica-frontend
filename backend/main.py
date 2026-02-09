from fastapi import FastAPI

app = FastAPI()

@app.post("/evaluar")
def evaluar(payload: dict):
    expression = payload.get("expression")
    data = payload.get("data")

    if expression is None or data is None:
        return {
            "success": False,
            "error": "Falta expression o data"
        }

    try:
        result = eval(expression, {}, data)
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
    