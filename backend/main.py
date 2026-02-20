from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluateRequest(BaseModel):
    language: str
    expression: str
    data: dict

@app.post("/api/evaluate")
def evaluate(req: EvaluateRequest):

    variables = req.data

    result = eval(req.expression, {}, variables)

    return {
        "success": True,
        "": result,
        "language": req.language,
        "expression": req.expression,
        "data": req.data
    }
    
@app.post("/api/validate")
def validate(req: EvaluateRequest):
    return {
        "success": True,
        "message": "Expresión válida",
        "expression": req.expression
    }