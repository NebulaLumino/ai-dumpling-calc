"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-red-500";
const ACCENT_TEXT = "text-red-400";
const ACCENT_GLOW = "shadow-red-500/20";

export default function DumplingCalculator() {
  const [numDumplings, setNumDumplings] = useState("");
  const [fillingType, setFillingType] = useState("");
  const [wrapperType, setWrapperType] = useState("");
  const [flavorEnhancers, setFlavorEnhancers] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numDumplings || !fillingType || !wrapperType) {
      setError("Please fill in number of dumplings, filling type, and wrapper type.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numDumplings, fillingType, wrapperType, flavorEnhancers }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🥟</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Dumpling & Filling Calculator</h1>
          <p className="text-sm text-gray-400">Ingredient quantities & pleating technique tips</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Number of Dumplings</label>
            <input type="number" value={numDumplings} onChange={e => setNumDumplings(e.target.value)} placeholder="e.g., 40, 60, 100"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Filling Type</label>
            <select value={fillingType} onChange={e => setFillingType(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select filling type...</option>
              <option value="pork" className="bg-gray-900">Pork (ground)</option>
              <option value="pork and cabbage" className="bg-gray-900">Pork & Cabbage</option>
              <option value="chicken" className="bg-gray-900">Chicken</option>
              <option value="beef" className="bg-gray-900">Beef</option>
              <option value="shrimp" className="bg-gray-900">Shrimp</option>
              <option value="vegetable" className="bg-gray-900">Vegetable</option>
              <option value="tofu" className="bg-gray-900">Tofu</option>
              <option value="lamb" className="bg-gray-900">Lamb</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Wrapper Type</label>
            <select value={wrapperType} onChange={e => setWrapperType(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select wrapper type...</option>
              <option value="wheat flour (standard)" className="bg-gray-900">Wheat Flour (standard)</option>
              <option value="cake flour (transparent)" className="bg-gray-900">Cake Flour (transparent/shumai)</option>
              <option value="wonton wrappers" className="bg-gray-900">Wonton Wrappers</option>
              <option value="rice flour" className="bg-gray-900">Rice Flour (glutinoaus)</option>
              <option value="handmade thin" className="bg-gray-900">Handmade Thin Wrappers</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Flavor Enhancers (optional)</label>
            <textarea value={flavorEnhancers} onChange={e => setFlavorEnhancers(e.target.value)} rows={2}
              placeholder="e.g., sesame oil, ginger, shaoxing wine, chili oil, five-spice..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors resize-none" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Calculating Recipe..." : "Calculate Dumpling Recipe"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your dumpling recipe will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
