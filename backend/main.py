from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# IMPORTAMOS LAS FUNCIONES
from shared.helper import evaluate_expression, validate_expression

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
    return evaluate_expression(req.expression, req.data)


@app.post("/api/validate")
def validate(req: EvaluateRequest):
    return validate_expression(req.expression, req.data)