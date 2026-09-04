"use client";
import { useState } from "react";

export default function JobsPage() {
  const [jobText, setJobText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (jobText.trim().length < 100) {
      setError("Please paste a complete job description.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: jobText }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Something went wrong. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Job Intelligence</h1>
        <p className="text-gray-400 mb-8">Paste a job description to extract required capabilities.</p>

        <textarea
          value={jobText}
          onChange={(e) => setJobText(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full h-64 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white resize-none"
        />

        {error && <p className="mt-2 text-red-400">{error}</p>}

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="mt-4 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Analyze Job"}
        </button>

        {result && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-6">{result.role}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.capabilities.map((cap: any) => (
                <div key={cap.name} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{cap.name}</h3>
                    <span className="text-green-400 font-bold">{cap.importance}%</span>
                  </div>
                  <p className="text-gray-400 text-sm">{cap.description}</p>
                  <p className="text-gray-600 text-xs mt-2">Category: {cap.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}