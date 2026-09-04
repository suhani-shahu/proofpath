from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.supabase import supabase
from app.api.jobs import router as jobs_router

app = FastAPI(
    title="ProofPath API",
    description="AI-powered work capability verification platform",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs_router)

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "proofpath-api"
    }

@app.get("/test-db")
async def test_db():
    try:
        result = supabase.table("capabilities").select("*").limit(1).execute()
        return {
            "status": "connected",
            "message": "Supabase connection successful"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }