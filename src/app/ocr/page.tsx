"use client";

import { useState } from "react";
// Import Global Structure components
import Header from "@/components/structure/Header";
import Footer from "@/components/structure/Footer";

// Import OCR-specific components
import OCRHeader from "@/components/ocr/OCRHeader";
import OCRUpload from "@/components/ocr/OCRUpload";
import OCROutput from "@/components/ocr/OCROutput";
import { OCRResultWithPreview } from "@/types/ocr";

export default function OCRPage() {
  const [results, setResults] = useState<OCRResultWithPreview[]>([]);

  const handleSuccess = (newResults: OCRResultWithPreview[]) => {
    setResults(newResults);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setResults([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* 1. Global Navigation */}
      <Header />

      {/* 2. Main Content (bg-black here fixes the white gaps) */}
      <main className="flex-grow bg-black pb-20 text-white">
        <OCRHeader />

        <div className="container mx-auto px-4 md:px-6">
          {results.length > 0 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-white">Results</h2>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm font-medium text-blue-400 bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/40 rounded-lg transition-colors"
                >
                  Upload New Files
                </button>
              </div>

              {results.map((result, index) => (
                <OCROutput
                  key={index}
                  previewUrl={result.previewUrl}
                  text={result.text}
                  onReset={index === 0 ? handleReset : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <OCRUpload onSuccess={handleSuccess} />
            </div>
          )}
        </div>
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
}

// src\app\ocr\page.tsx