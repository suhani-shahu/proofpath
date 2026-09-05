from fastapi import APIRouter
from pydantic import BaseModel
from app.services.evaluation_service import evaluate_submission
from app.api.missions import MISSIONS

router = APIRouter(
    prefix="/api/evaluations",
    tags=["Evaluations"]
)

class EvaluationRequest(BaseModel):
    mission_id: str
    submission: str

@router.post("/evaluate")
async def evaluate(request: EvaluationRequest):
    mission = None
    for m in MISSIONS.values():
        if m["id"] == request.mission_id:
            mission = m
            break

    if not mission:
        return {"error": "Mission not found"}

    result = await evaluate_submission(
        mission_title=mission["title"],
        capability=mission["capability"],
        requirements=mission["requirements"],
        submission=request.submission
    )

    return result