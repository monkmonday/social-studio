"use client";
import { useState } from "react";

interface Slide {
  slideNumber: number;
  title: string;
  body: string;
}

const gradients = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-yellow-500",
  "from-green-500 to-teal-500",
  "from-red-500 to-pink-500",
  "from-indigo-500 to-purple-500",
];

const formats = ["Carousel", "Instagram Post", "Story"];

export default function Home() {
  const [idea, setIdea] = useState("");
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState("Carousel");
  const [copied, setCopied] = useState<number | null>(null);

  const generate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setSlides([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, format }),
      });
      const data = await res.json();
      setSlides(data.slides);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copySlide = (slide: Slide, index: number) => {
    const text = `${slide.title}\n\n${slide.body}`;
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const text = slides
      .map((s) => `Slide ${s.slideNumber}: ${s.title}\n${s.body}`)
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
            Social Studio
          </h1>
          <p className="text-gray-400 text-lg">
            Turn a rough idea into a polished social media creative
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8">

          {/* Format Selector */}
          <div className="flex gap-3 mb-4">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  format === f
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f === "Carousel" ? "🎠 Carousel" : f === "Instagram Post" ? "📸 Post" : "📱 Story"}
              </button>
            ))}
          </div>

          <textarea
            className="w-full bg-gray-800 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            rows={4}
            placeholder={
              format === "Carousel"
                ? "e.g. Carousel for parents about why kids forget what they learn — explain the forgetting curve"
                : format === "Instagram Post"
                ? "e.g. Single post about the importance of daily math practice for kids"
                : "e.g. Story about 3 signs your child is ready for advanced math"
            }
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={generate}
              disabled={loading || !idea.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-all"
            >
              {loading ? "✨ Generating..." : "✨ Generate"}
            </button>
            {slides.length > 0 && (
              <button
                onClick={generate}
                disabled={loading}
                className="px-6 bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl transition-all"
              >
                🔄 Redo
              </button>
            )}
          </div>
          {error && <p className="text-red-400 mt-3 text-center">{error}</p>}
        </div>

        {/* Slides Output */}
        {slides.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-300">
                {format} — {slides.length} Slides
              </h2>
              <button
                onClick={copyAll}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm font-semibold transition-all"
              >
                📋 Copy All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${gradients[i % gradients.length]} p-1 rounded-2xl`}
                >
                  <div className="bg-gray-900 rounded-2xl p-6 h-full flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Slide {slide.slideNumber}
                      </span>
                      <h3 className="text-xl font-bold mt-2 mb-3 text-white">
                        {slide.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{slide.body}</p>
                    </div>
                    <button
                      onClick={() => copySlide(slide, i)}
                      className="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-gray-400 hover:text-white transition-all"
                    >
                      {copied === i ? "✅ Copied!" : "📋 Copy Slide"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}