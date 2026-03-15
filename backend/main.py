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

# Cargar variables de entorno
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


# ENDPOINTS

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
            "passed": False,
            "expected": None,
            "obtained": None
        }

    # 🔹 ENVOLVEMOS EL JSON EN data
    variables = {
        "data": challenge["json_input"]
    }

    result = evaluate_expression(
        req.expression,
        variables,
        "CEL",
        req.engine
    )

    if not result.get("success"):
        return {
            "passed": False,
            "expected": challenge.get("expected_result"),
            "obtained": None
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

    variables = {
        "data": req.data
    }

    return evaluate_expression(
        req.expression,
        variables,
        req.language,
        req.engine
    )


@app.post("/api/validate")
def validate(req: EvaluateRequest):

    variables = {
        "data": req.data
    }

    return validate_expression(
        req.expression,
        variables,
        req.language,
        req.engine
    )


# LOGIN

@app.post("/api/login")
def login(req: LoginRequest):

    response = requests.post(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        data={
            "secret": TURNSTILE_SECRET,
            "response": req.captcha
        }
    )

    result = response.json()

    if not result.get("success"):
        return {"success": False, "message": "Captcha inválido"}

    return {"success": True}