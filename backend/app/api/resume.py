from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.resume_parser import analyze_resume

router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)

@router.post("/analyze")
async def analyze_resume_endpoint(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported."
        )
    
    file_bytes = await file.read()
    
    if len(file_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File too large. Max 5MB."
        )
    
    try:
        result = await analyze_resume(file_bytes)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(e)}"
        )