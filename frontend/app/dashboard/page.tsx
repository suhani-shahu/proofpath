"use client";
import { useState, useEffect } from "react";
import { getSessionId } from "@/lib/session";

interface Capability {
  name: string;
  category: string;
  status: string;
  confidence: number;
  evidence: string[];
  score: number;
}

interface Summary {
  total: number;
  demonstrated: number;
  partial: number;
  unknown: number;
  readiness_score: number;
}

interface NextMission {
  capability: string;
  reason: string;
  mission_id: string;
}

export default function DashboardPage() {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [jobRole, setJobRole] = useState("");
  const [nextMission, setNextMission] = useState<NextMission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`http://localhost:8000/api/capabilities/?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setCapabilities(data.capabilities || []);
        setSummary(data.summary);
        setJobRole(data.job_role || "");
        setNextMission(data.next_mission || null);
        setLoading(false);
      });
  }, []);

  function getStatusIcon(status: string) {
    if (status === "DEMONSTRATED") return "✅";
    if (status === "PARTIAL") return "◐";
    return "❌";
  }

  function getStatusColor(status: string) {
    if (status === "DEMONSTRATED") return "border-green-800";
    if (status === "PARTIAL") return "border-yellow-800";
    return "border-red-900";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-gray-400 text-sm mb-6 block">Back to Home</a>
        <h1 className="text-4xl font-bold mb-2">Capability Dashboard</h1>
        {jobRole && <p className="text-blue-400 mb-2">Target Role: {jobRole}</p>}
        <p className="text-gray-400 mb-8">Your verified capability profile.</p>

        {capabilities.length === 0 ? (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-10 text-center">
            <p className="text-gray-400 mb-4">No capabilities yet!</p>
            <p className="text-gray-500 text-sm mb-6">Start by analyzing a job description.</p>
            <a href="/jobs" className="bg-white text-black px-6 py-3 rounded-xl font-semibold">
              Analyze a Job
            </a>
          </div>
        ) : (
          <>
            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-gray-900 rounded-xl p-5 text-center">
                  <div className="text-4xl font-bold text-white">{summary.readiness_score}%</div>
                  <div className="text-gray-400 text-sm mt-1">Readiness</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-5 text-center">
                  <div className="text-4xl font-bold text-green-400">{summary.demonstrated}</div>
                  <div className="text-gray-400 text-sm mt-1">Demonstrated</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-5 text-center">
                  <div className="text-4xl font-bold text-yellow-400">{summary.partial}</div>
                  <div className="text-gray-400 text-sm mt-1">Partial</div>
                </div>
                <div className="bg-gray-900 rounded-xl p-5 text-center">
                  <div className="text-4xl font-bold text-red-400">{summary.unknown}</div>
                  <div className="text-gray-400 text-sm mt-1">Not Proven</div>
                </div>
              </div>
            )}

            {nextMission && (
              <div className="bg-blue-950 border border-blue-700 rounded-xl p-6 mb-8">
                <p className="text-blue-400 text-xs font-semibold uppercase mb-2">Next Best Mission</p>
                <h3 className="text-xl font-bold mb-2">Prove: {nextMission.capability}</h3>
                <p className="text-gray-300 text-sm mb-4">{nextMission.reason}</p>
                <button
                  onClick={() => window.location.href = "/missions"}
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Start Mission
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {capabilities.map((cap) => (
                <div
                  key={cap.name}
                  className={`bg-gray-900 border rounded-xl p-5 ${getStatusColor(cap.status)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span>{getStatusIcon(cap.status)}</span>
                      <h3 className="font-bold text-white text-lg">{cap.name}</h3>
                    </div>
                    <span className="text-sm font-semibold text-gray-400">{cap.confidence}%</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3">{cap.category}</p>
                  {cap.evidence.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {cap.evidence.map((e, i) => (
                        <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                          {e}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600">No evidence yet — complete a mission!</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}