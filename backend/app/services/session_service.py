from app.db.supabase import supabase

def get_or_create_session(session_id: str) -> dict:
    existing = (
        supabase
        .table("user_sessions")
        .select("*")
        .eq("session_id", session_id)
        .execute()
    )
    
    if existing.data:
        return existing.data[0]
    
    created = (
        supabase
        .table("user_sessions")
        .insert({"session_id": session_id})
        .execute()
    )
    
    return created.data[0]

def update_job_capabilities(session_id: str, role: str, capabilities: list):
    get_or_create_session(session_id)
    
    supabase.table("user_sessions").update({
        "job_role": role,
        "job_capabilities": capabilities
    }).eq("session_id", session_id).execute()

def update_demonstrated_capability(session_id: str, capability: str, score: int):
    session = get_or_create_session(session_id)
    
    demonstrated = session.get("demonstrated_capabilities", [])
    demonstrated = [d for d in demonstrated if d["name"] != capability]
    demonstrated.append({"name": capability, "score": score, "status": "DEMONSTRATED"})
    
    total = len(session.get("job_capabilities", []))
    readiness = round((len(demonstrated) / total * 100)) if total > 0 else 0
    
    supabase.table("user_sessions").update({
        "demonstrated_capabilities": demonstrated,
        "readiness_score": readiness
    }).eq("session_id", session_id).execute()

def get_session_data(session_id: str) -> dict:
    return get_or_create_session(session_id)