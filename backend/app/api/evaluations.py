from fastapi import APIRouter
from pydantic import BaseModel
from app.services.evaluation_service import evaluate_submission
from app.services.session_service import update_demonstrated_capability
from app.api.missions import MISSIONS

router = APIRouter(
    prefix="/api/evaluations",
    tags=["Evaluations"]
)

class EvaluationRequest(BaseModel):
    mission_id: str
    submission: str
    session_id: str | None = None

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

    if request.session_id and result.get("overall_score", 0) >= 60:
        update_demonstrated_capability(
            session_id=request.session_id,
            capability=mission["capability"],
            score=result.get("overall_score", 0)
        )

    return result