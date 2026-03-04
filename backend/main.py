from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json
from pathlib import Path

from shared.helper import (
    evaluate_expression,
    validate_expression,
    compare_results
)

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


#ENDPOINTS

@app.get("/")
def root():
    return {"status": "API running"}


@app.get("/api/challenges")
def get_challenges():
    return load_challenges()


@app.post("/api/challenges/{challenge_id}/submit")
def submit_challenge(challenge_id: int, req: SubmitRequest):
    challenges = load_challenges()["challenges"]

    challenge = next(
        (c for c in challenges if c["id"] == challenge_id),
        None
    )

    if not challenge:
        return {
            "success": False,
            "message": "Challenge no encontrado"
        }

    result = evaluate_expression(
        req.expression,
        challenge["json_input"],
        "CEL",
        req.engine
    )

    if not result.get("success"):
        return result

    obtained = result.get("result")
    expected = challenge.get("expected_result")

    passed = compare_results(obtained, expected)

    return {
        "success": True,
        "passed": passed,
        "expected": expected,
        "obtained": obtained,
        "challenge_id": challenge_id,
        "challenge": challenge.get("title")
    }


@app.post("/api/evaluate")
def evaluate(req: EvaluateRequest):
    return evaluate_expression(
        req.expression,
        req.data,
        req.language,
        req.engine
    )


@app.post("/api/validate")
def validate(req: EvaluateRequest):
    return validate_expression(
        req.expression,
        req.data,
        req.language,
        req.engine
    )