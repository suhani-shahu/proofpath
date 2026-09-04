import json
from app.services.ai_service import generate_json
from app.prompts.job_analysis import (
    JOB_ANALYSIS_SYSTEM_PROMPT,
    JOB_ANALYSIS_USER_PROMPT
)

async def analyze_job(job_description: str) -> dict:
    prompt = JOB_ANALYSIS_USER_PROMPT.format(
        job_description=job_description
    )
    
    result = await generate_json(
        system_prompt=JOB_ANALYSIS_SYSTEM_PROMPT,
        user_prompt=prompt
    )
    
    return result