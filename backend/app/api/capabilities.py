from fastapi import APIRouter

router = APIRouter(
    prefix="/api/capabilities",
    tags=["Capabilities"]
)

USER_CAPABILITIES = [
    {
        "name": "Docker",
        "category": "Containerization",
        "status": "DEMONSTRATED",
        "confidence": 86,
        "evidence": ["Resume mention", "Proof Mission completed"],
        "score": 86
    },
    {
        "name": "AWS",
        "category": "Cloud",
        "status": "PARTIAL",
        "confidence": 45,
        "evidence": ["Resume mention"],
        "score": 45
    },
    {
        "name": "Linux",
        "category": "Operating Systems",
        "status": "PARTIAL",
        "confidence": 50,
        "evidence": ["Resume mention"],
        "score": 50
    },
    {
        "name": "CI/CD",
        "category": "DevOps",
        "status": "UNKNOWN",
        "confidence": 0,
        "evidence": [],
        "score": 0
    },
    {
        "name": "Python",
        "category": "Programming",
        "status": "DEMONSTRATED",
        "confidence": 80,
        "evidence": ["Resume mention", "GitHub projects"],
        "score": 80
    },
    {
        "name": "Git",
        "category": "Version Control",
        "status": "DEMONSTRATED",
        "confidence": 75,
        "evidence": ["Resume mention", "GitHub activity"],
        "score": 75
    },
    {
        "name": "Monitoring",
        "category": "DevOps",
        "status": "UNKNOWN",
        "confidence": 0,
        "evidence": [],
        "score": 0
    }
]

@router.get("/")
async def get_capabilities():
    total = len(USER_CAPABILITIES)
    demonstrated = len([c for c in USER_CAPABILITIES if c["status"] == "DEMONSTRATED"])
    partial = len([c for c in USER_CAPABILITIES if c["status"] == "PARTIAL"])
    unknown = len([c for c in USER_CAPABILITIES if c["status"] == "UNKNOWN"])
    readiness = round((demonstrated * 100 + partial * 50) / total)

    return {
        "capabilities": USER_CAPABILITIES,
        "summary": {
            "total": total,
            "demonstrated": demonstrated,
            "partial": partial,
            "unknown": unknown,
            "readiness_score": readiness
        }
    }