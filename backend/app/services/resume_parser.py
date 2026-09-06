import io
from PyPDF2 import PdfReader
from app.services.ai_service import generate_json

RESUME_SYSTEM_PROMPT = """
You are a resume analyzer for ProofPath.

Extract technical capabilities from a resume.

Return JSON only.
"""

RESUME_USER_PROMPT = """
Analyze this resume and extract technical capabilities.

RESUME TEXT:
{resume_text}

Return this exact JSON:
{{
  "name": "candidate name or Unknown",
  "capabilities": [
    {{
      "name": "capability name",
      "category": "category",
      "confidence": 0-100,
      "evidence": "where you found this in the resume"
    }}
  ],
  "summary": "2 sentence summary of the candidate"
}}
"""

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

async def analyze_resume(file_bytes: bytes) -> dict:
    resume_text = extract_text_from_pdf(file_bytes)
    
    if len(resume_text) < 50:
        return {"error": "Could not extract text from PDF"}
    
    prompt = RESUME_USER_PROMPT.format(resume_text=resume_text[:3000])
    
    result = await generate_json(
        system_prompt=RESUME_SYSTEM_PROMPT,
        user_prompt=prompt
    )
    
    return result