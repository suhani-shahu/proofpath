"use client";
import { useState, useEffect } from "react";

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

export default function DashboardPage() {
  const [capabilities, setCapabilities] = useState<Capability[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/capabilities/")
      .then((res) => res.json())
      .then((data) => {
        setCapabilities(data.capabilities);
        setSummary(data.summary);
      });
  }, []);

  function getStatusIcon(status: string) {
    if (status === "DEMONSTRATED") return "✅";
    if (status === "PARTIAL") return "◐";
    return "❌";
  }

  function getStatusColor(status: string) {
    if (status === "DEMONSTRATED") return "text-green-400 border-green-800";
    if (status === "PARTIAL") return "text-yellow-400 border-yellow-800";
    return "text-red-400 border-red-900";
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-gray-400 text-sm mb-6 block">Back to Home</a>
        <h1 className="text-4xl font-bold mb-2">Capability Dashboard</h1>
        <p className="text-gray-400 mb-8">Your verified capability profile.</p>

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
                <span className="text-sm font-semibold">{cap.confidence}%</span>
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
        <button
          onClick={() => window.location.href="/missions"}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Start a Proof Mission
        </button>
      </div>
    </main>
  );
}