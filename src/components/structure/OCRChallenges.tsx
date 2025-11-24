"use client";

import { Database, Bot, Zap } from "lucide-react";

export default function OCRChallenges() {
  const challenges = [
    {
      icon: Database,
      title: "Data-Scarce Language",
      description:
        "There is no large, public Khmer OCR dataset with handwriting, layouts, or detailed annotations. Most Khmer documents are offline or locked in images and PDFs, so researchers have very little clean text or labeled examples to train modern models.",
    },
    {
      icon: Bot,
      title: "DIY Dataset Generator",
      description:
        "Because ready-made datasets don’t exist, we generate our own. Using sources like the Khmer Dictionary 2022, we render paragraphs with random font sizes, line spacing, and padding onto different backgrounds—then automatically create bounding boxes and labels for every word.",
    },
    {
      icon: Zap,
      title: "Real-World Noise & Confusion",
      description:
        "Real scans are never perfect, so our synthetic images aren’t either. We add motion blur, JPEG compression, brightness and color shifts, slight rotations, and even “negative” samples in other languages to teach the model to survive noisy cameras, bad scans, and mixed-language pages.",
    },
  ];

  return (
    <section className="bg-black text-white py-24 border-t border-gray-900" id="challenges">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            The <span className="text-blue-500">OCR Challenge</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Why building Khmer OCR is harder than English—and how we solved it.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((item, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-gray-900/40 border border-gray-800 hover:border-blue-500/50 hover:bg-gray-900 transition-all duration-300 relative overflow-hidden"
            >
              {/* Subtle Gradient Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-gray-100 group-hover:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}