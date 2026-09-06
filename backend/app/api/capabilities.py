from fastapi import APIRouter
from app.services.session_service import get_session_data

router = APIRouter(
    prefix="/api/capabilities",
    tags=["Capabilities"]
)

@router.get("/")
async def get_capabilities(session_id: str = "default"):
    session = get_session_data(session_id)
    
    job_capabilities = session.get("job_capabilities", [])
    demonstrated = session.get("demonstrated_capabilities", [])
    demonstrated_names = [d["name"] for d in demonstrated]

    capabilities = []

    for cap in job_capabilities:
        name = cap.get("name", "")
        is_demonstrated = any(
            name.lower() in d.lower() or d.lower() in name.lower()
            for d in demonstrated_names
        )
        
        demo_data = next(
            (d for d in demonstrated if name.lower() in d["name"].lower()),
            None
        )

        capabilities.append({
            "name": name,
            "category": cap.get("category", "General"),
            "status": "DEMONSTRATED" if is_demonstrated else "UNKNOWN",
            "confidence": demo_data["score"] if demo_data else 0,
            "evidence": ["Proof Mission completed"] if is_demonstrated else [],
            "score": demo_data["score"] if demo_data else 0
        })

    total = len(capabilities)
    demonstrated_count = len([c for c in capabilities if c["status"] == "DEMONSTRATED"])
    unknown_count = len([c for c in capabilities if c["status"] == "UNKNOWN"])
    readiness = round((demonstrated_count / total * 100)) if total > 0 else 0

    return {
        "capabilities": capabilities,
        "job_role": session.get("job_role", ""),
        "summary": {
            "total": total,
            "demonstrated": demonstrated_count,
            "partial": 0,
            "unknown": unknown_count,
            "readiness_score": readiness
        }
    }