export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <div className="max-w-3xl text-center">
        <h1 className="text-6xl font-bold mb-4">ProofPath</h1>
        <p className="text-xl text-gray-400 mb-12">
          Do not just claim the skill. Prove you can do the job.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/jobs" className="bg-gray-900 border border-gray-700 hover:border-white transition rounded-xl p-6 text-left">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-bold mb-1">Job Intelligence</h3>
            <p className="text-gray-400 text-sm">Analyze job descriptions and extract required capabilities.</p>
          </a>
          <a href="/resume" className="bg-gray-900 border border-gray-700 hover:border-white transition rounded-xl p-6 text-left">
            <div className="text-2xl mb-2">📄</div>
            <h3 className="font-bold mb-1">Resume Analysis</h3>
            <p className="text-gray-400 text-sm">Upload your resume to extract your current capabilities.</p>
          </a>
          <a href="/dashboard" className="bg-gray-900 border border-gray-700 hover:border-white transition rounded-xl p-6 text-left">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-bold mb-1">My Dashboard</h3>
            <p className="text-gray-400 text-sm">See your verified capability profile and readiness score.</p>
          </a>
          <a href="/missions" className="bg-gray-900 border border-gray-700 hover:border-white transition rounded-xl p-6 text-left">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-bold mb-1">Proof Missions</h3>
            <p className="text-gray-400 text-sm">Complete real work tasks to demonstrate your capabilities.</p>
          </a>
        </div>
      </div>
    </main>
  );
}