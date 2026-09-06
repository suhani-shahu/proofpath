from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.job_analyzer import analyze_job
from app.services.session_service import update_job_capabilities

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)

class JobAnalyzeRequest(BaseModel):
    raw_text: str
    title: str | None = None
    company: str | None = None
    session_id: str | None = None

@router.post("/analyze")
async def analyze_job_endpoint(request: JobAnalyzeRequest):
    if len(request.raw_text.strip()) < 100:
        raise HTTPException(
            status_code=400,
            detail="Job description too short."
        )
    
    try:
        result = await analyze_job(request.raw_text)
        
        if request.session_id and result.get("capabilities"):
            update_job_capabilities(
                session_id=request.session_id,
                role=result.get("role", "Unknown Role"),
                capabilities=result.get("capabilities", [])
            )
        
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )