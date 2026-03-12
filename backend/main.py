from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
from pathlib import Path
import requests
import os
from dotenv import load_dotenv

from shared.helper import (
    evaluate_expression,
    validate_expression,
    compare_results
)

load_dotenv()

TURNSTILE_SECRET = os.getenv("TURNSTILE_SECRET")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CHALLENGES_PATH = Path(__file__).parent / "challenges.json"

def load_challenges():
    if not CHALLENGES_PATH.exists():
        return {"challenges": []}
    with open(CHALLENGES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

# MODELOS
class SubmitRequest(BaseModel):
    expression: str
    engine: Optional[str] = "common"

class EvaluateRequest(BaseModel):
    language: str
    expression: str
    data: dict
    engine: Optional[str] = "common"

class LoginRequest(BaseModel):
    captcha: str

@app.get("/")
def root():
    return {"status": "API running"}

@app.get("/api/challenges")
def get_challenges():
    return load_challenges()

@app.post("/api/challenges/{challenge_id}/submit")
def submit_challenge(challenge_id: int, req: SubmitRequest):
    challenges_data = load_challenges()
    challenges = challenges_data.get("challenges", [])
    challenge = next((c for c in challenges if c["id"] == challenge_id), None)

    if not challenge:
        return {"passed": False, "expected": None, "obtained": "No encontrado"}

    # 🔹 PASO 1: Extraemos el input tal cual viene
    variables = challenge["json_input"]

    # 🔹 PASO 2: Identificamos el lenguaje real
    engine_name = req.engine.lower()
    language = "STARLARK" if engine_name == "starlark" else "CEL"

    # 🔹 PASO 3: Evaluamos
    result = evaluate_expression(
        req.expression,
        variables,
        language,
        engine_name
    )

    if not result.get("success"):
        return {
            "passed": False,
            "expected": challenge.get("expected_result"),
            "obtained": result.get("message", "Error")
        }

    obtained = result.get("result")
    expected = challenge.get("expected_result")
    passed = compare_results(obtained, expected)

    return {
        "passed": passed,
        "expected": expected,
        "obtained": obtained
    }

@app.post("/api/evaluate")
def evaluate(req: EvaluateRequest):
    return evaluate_expression(req.expression, req.data, req.language, req.engine)

@app.post("/api/validate")
def validate(req: EvaluateRequest):
    return validate_expression(req.expression, req.data, req.language, req.engine)

@app.post("/api/login")
def login(req: LoginRequest):
    response = requests.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        data={"secret": TURNSTILE_SECRET, "response": req.captcha}
    )
    return {"success": response.json().get("success", False)}