export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  
  let sessionId = localStorage.getItem("proofpath_session");
  
  if (!sessionId) {
    sessionId = "session_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("proofpath_session", sessionId);
  }
  
  return sessionId;
}