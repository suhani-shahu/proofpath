"use client";
import { useState, useEffect } from "react";

interface Mission {
  id: string;
  title: string;
  capability: string;
  difficulty: string;
  estimated_minutes: number;
  scenario: string;
  description: string;
  requirements: string[];
}

interface EvaluationResult {
  correctness: number;
  implementation: number;
  best_practices: number;
  documentation: number;
  overall_score: number;
  status: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selected, setSelected] = useState<Mission | null>(null);
  const [submission, setSubmission] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/missions/")
      .then((res) => res.json())
      .then((data) => setMissions(data.missions));
  }, []);

  async function handleSubmit() {
    if (submission.trim().length < 20) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/evaluations/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission_id: selected!.id,
          submission: submission,
        }),
      });
      const data = await res.json();
      setEvaluation(data);
    } catch {
      alert("Evaluation failed. Is backend running?");
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string) {
    if (status === "DEMONSTRATED") return "text-green-400";
    if (status === "PARTIAL") return "text-yellow-400";
    return "text-red-400";
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-gray-400 text-sm mb-6 block">← Back to Home</a>
        <h1 className="text-4xl font-bold mb-2">Proof Missions</h1>
        <p className="text-gray-400 mb-8">Complete a mission to demonstrate your capability.</p>

        {!selected ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => { setSelected(mission); setEvaluation(null); setSubmission(""); }}
                className="bg-gray-900 border border-gray-700 rounded-xl p-6 cursor-pointer hover:border-white transition"
              >
                <span className="text-xs text-blue-400 font-semibold uppercase">{mission.capability}</span>
                <h3 className="text-lg font-bold mt-2 mb-2">{mission.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{mission.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{mission.difficulty}</span>
                  <span>{mission.estimated_minutes} min</span>
                </div>
              </div>
            ))}
          </div>
        ) : !evaluation ? (
          <div>
            <button onClick={() => setSelected(null)} className="text-gray-400 text-sm mb-6 block">← Back to Missions</button>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
              <span className="text-blue-400 text-sm font-semibold uppercase">{selected.capability}</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">{selected.title}</h2>
              <p className="text-gray-300 mb-6">{selected.scenario}</p>
              <h3 className="font-semibold mb-3">Requirements:</h3>
              <ul className="space-y-2">
                {selected.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-green-400 mt-1">✓</span> {req}
                  </li>
                ))}
              </ul>
            </div>
            <h3 className="font-semibold mb-3">Your Submission</h3>
            <textarea
              value={submission}
              onChange={(e) => setSubmission(e.target.value)}
              placeholder="Paste your GitHub repo URL and explain your solution in detail..."
              className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white resize-none mb-4"
            />
            <button
              onClick={handleSubmit}
              disabled={loading || submission.trim().length < 20}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "AI Evaluating..." : "Submit Mission"}
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => setSelected(null)} className="text-gray-400 text-sm mb-6 block">← Back to Missions</button>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
              <h2 className="text-2xl font-bold mb-2">Mission Evaluation</h2>
              <p className="text-gray-400 mb-6">{selected.title}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Correctness", value: evaluation.correctness },
                  { label: "Implementation", value: evaluation.implementation },
                  { label: "Best Practices", value: evaluation.best_practices },
                  { label: "Documentation", value: evaluation.documentation },
                ].map((item) => (
                  <div key={item.label} className="bg-black rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white">{item.value}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-6 p-4 bg-black rounded-xl">
                <div className="text-5xl font-bold">{evaluation.overall_score}</div>
                <div>
                  <div className={`text-lg font-bold ${getStatusColor(evaluation.status)}`}>
                    {evaluation.status}
                  </div>
                  <div className="text-gray-400 text-sm">Overall Score</div>
                </div>
              </div>

              <p className="text-gray-300 mb-6">{evaluation.feedback}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i} className="text-gray-300 text-sm">+ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-2">Improvements</h4>
                  <ul className="space-y-1">
                    {evaluation.improvements.map((s, i) => (
                      <li key={i} className="text-gray-300 text-sm">- {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <button
              onClick={() => { setSelected(null); setEvaluation(null); setSubmission(""); }}
              className="bg-white text-black px-6 py-3 rounded-xl font-semibold"
            >
              Try Another Mission
            </button>
          </div>
        )}
      </div>
    </main>
  );
}