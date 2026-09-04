export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold mb-4">ProofPath</h1>
        <p className="text-xl text-gray-400 mb-8">
          Prove you can do the job.
        </p>
        <a href="/jobs" className="bg-white text-black px-8 py-4 rounded-xl text-lg font-semibold">
          Build My Career Proof
        </a>
      </div>
    </main>
  );
}