"use client";
import { useState } from "react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://localhost:8000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Resume analysis failed. Is backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto">
        <a href="/" className="text-gray-400 text-sm mb-6 block">Back to Home</a>
        <h1 className="text-4xl font-bold mb-2">Resume Analysis</h1>
        <p className="text-gray-400 mb-8">Upload your resume to extract your current capabilities.</p>

        <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 mb-6">
          <label className="block mb-4 font-semibold">Upload Resume (PDF only)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-gray-400 mb-4"
          />
          {file && <p className="text-green-400 text-sm mb-4">Selected: {file.name}</p>}
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {result && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{result.name}</h2>
            <p className="text-gray-400 mb-6">{result.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.capabilities?.map((cap: any, i: number) => (
                <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                  <div className="flex justify-between mb-2">
                    <h3 className="font-bold">{cap.name}</h3>
                    <span className="text-green-400">{cap.confidence}%</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-2">{cap.category}</p>
                  <p className="text-gray-400 text-sm">{cap.evidence}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}