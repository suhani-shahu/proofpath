from fastapi import APIRouter
from app.services.session_service import get_session_data

router = APIRouter(
    prefix="/api/capabilities",
    tags=["Capabilities"]
)

# Only recommend capabilities that actually have a mission available
MISSION_MAP = {
    "docker": "docker-001",
    "containeriz": "docker-001",
    "ci/cd": "cicd-001",
    "pipeline": "cicd-001",
    "linux": "linux-001",
    "server": "linux-001",
}

def find_mission_id(capability_name: str):
    name_lower = capability_name.lower()
    for keyword, mission_id in MISSION_MAP.items():
        if keyword in name_lower:
            return mission_id
    return None

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
            (d for d in demonstrated if name.lower() in d["name"].lower() or d["name"].lower() in name.lower()),
            None
        )

        capabilities.append({
            "name": name,
            "category": cap.get("category", "General"),
            "status": "DEMONSTRATED" if is_demonstrated else "UNKNOWN",
            "confidence": demo_data["score"] if demo_data else 0,
            "evidence": ["Proof Mission completed"] if is_demonstrated else [],
            "score": demo_data["score"] if demo_data else 0,
            "importance": cap.get("importance", 50)
        })

    total = len(capabilities)
    demonstrated_count = len([c for c in capabilities if c["status"] == "DEMONSTRATED"])
    unknown_count = len([c for c in capabilities if c["status"] == "UNKNOWN"])
    readiness = round((demonstrated_count / total * 100)) if total > 0 else 0

    # Only recommend capabilities that have an actual mission available
    unknown_caps = [c for c in capabilities if c["status"] == "UNKNOWN"]
    available_caps = [c for c in unknown_caps if find_mission_id(c["name"])]
    available_caps.sort(key=lambda x: x.get("importance", 0), reverse=True)
    
    next_mission = None
    if available_caps:
        next_cap = available_caps[0]
        mission_id = find_mission_id(next_cap["name"])
        
        next_mission = {
            "capability": next_cap["name"],
            "reason": f"{next_cap['name']} is required for your target role and has no evidence yet.",
            "mission_id": mission_id
        }

    return {
        "capabilities": capabilities,
        "job_role": session.get("job_role", ""),
        "summary": {
            "total": total,
            "demonstrated": demonstrated_count,
            "partial": 0,
            "unknown": unknown_count,
            "readiness_score": readiness
        },
        "next_mission": next_mission
    }