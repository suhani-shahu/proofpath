from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.job_analyzer import analyze_job

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)

class JobAnalyzeRequest(BaseModel):
    raw_text: str
    title: str | None = None
    company: str | None = None

@router.post("/analyze")
async def analyze_job_endpoint(request: JobAnalyzeRequest):
    if len(request.raw_text.strip()) < 100:
        raise HTTPException(
            status_code=400,
            detail="Job description too short. Please paste the full description."
        )
    
    try:
        result = await analyze_job(request.raw_text)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )