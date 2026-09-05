from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/missions",
    tags=["Missions"]
)

MISSIONS = {
    "docker": {
        "id": "docker-001",
        "title": "Containerize a Broken API",
        "capability": "Docker",
        "difficulty": "INTERMEDIATE",
        "estimated_minutes": 45,
        "scenario": "A development team has a Python REST API that works locally but fails when another engineer tries to run it. Your task is to containerize it properly.",
        "description": "Create a working Docker setup for a Python API so any engineer can run it consistently.",
        "requirements": [
            "Create a working Dockerfile",
            "Expose the correct application port",
            "Configure environment variables",
            "Add a health check",
            "Provide clear run instructions in README"
        ]
    },
    "cicd": {
        "id": "cicd-001",
        "title": "Fix a Broken CI/CD Pipeline",
        "capability": "CI/CD",
        "difficulty": "INTERMEDIATE",
        "estimated_minutes": 45,
        "scenario": "Your team's GitHub Actions pipeline is failing on every push. Deployments are blocked. You need to diagnose and fix it.",
        "description": "Debug and fix a broken GitHub Actions workflow so the team can deploy again.",
        "requirements": [
            "Identify why the pipeline is failing",
            "Fix the GitHub Actions YAML",
            "Ensure tests run correctly",
            "Ensure deployment step works",
            "Document what was wrong and how you fixed it"
        ]
    },
    "linux": {
        "id": "linux-001",
        "title": "Diagnose a Production Server Issue",
        "capability": "Linux",
        "difficulty": "INTERMEDIATE",
        "estimated_minutes": 30,
        "scenario": "A production Linux server is running slowly and users are complaining. You need to diagnose the issue and fix it.",
        "description": "Use Linux command line tools to identify and resolve a server performance problem.",
        "requirements": [
            "Check CPU and memory usage",
            "Identify the problematic process",
            "Check disk space",
            "Review system logs",
            "Provide a diagnosis report"
        ]
    }
}

@router.get("/")
async def get_missions():
    return {"missions": list(MISSIONS.values())}

@router.get("/{mission_id}")
async def get_mission(mission_id: str):
    for mission in MISSIONS.values():
        if mission["id"] == mission_id:
            return mission
    return {"error": "Mission not found"}