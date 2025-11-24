"use client";

import { useState, useEffect } from "react";
import { ScanSearch, Type, FileOutput } from "lucide-react";

export default function OurPipeline() {
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    {
      id: "yolo",
      title: "YOLOv8 Detection",
      icon: ScanSearch,
      text: "We built a custom detection model based on YOLOv8-nano instead of using a generic pretrained model, so we can optimize it for Khmer text, smaller model size, and faster inference.",
      color: "blue",
    },
    {
      id: "crnn",
      title: "CRNN Recognition",
      icon: Type,
      text: "We use a CRNN model with bi-directional LSTMs, so it can both “see” character shapes and “remember” context from left and right, giving us much better accuracy on Khmer words.",
      color: "purple",
    },
    {
      id: "output",
      title: "Pipeline Output",
      icon: FileOutput,
      text: "A custom pipeline script links YOLO and CRNN, sorting detected boxes, cropping each region, preprocessing it, and batching everything into tensors for high-accuracy Khmer text recognition.",
      color: "green",
    },
  ];

  // Auto-advance slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [pipelineSteps.length]);

  return (
    <section className="bg-black text-white min-h-screen py-24 flex flex-col justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/40 via-black to-black pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center gap-12">
        
        {/* Level 2 Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Our <span className="text-blue-500">Pipeline</span>
          </h2>
          <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full" />
        </div>

        {/* Dynamic Description (Changes with Slide) */}
        <div className="max-w-4xl mx-auto text-center h-32 md:h-24 transition-opacity duration-500">
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 key={activeStep}">
            {pipelineSteps[activeStep].text}
          </p>
        </div>

        {/* Center Slideshow (Visual Representation) */}
        <div className="w-full max-w-3xl aspect-video bg-gray-900/50 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden flex items-center justify-center group">
          {/* In a real app, use <Image> here. Using Icons for now as placeholders */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
          
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out transform
                  ${index === activeStep ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-x-8"}
                `}
              >
                {/* Visual Placeholder for the Model View */}
                <div className={`p-12 rounded-full bg-${step.color}-900/20 border border-${step.color}-500/30 shadow-[0_0_60px_rgba(0,0,0,0.5)]`}>
                    <Icon className={`w-32 h-32 text-${step.color}-500`} />
                </div>
                <div className="absolute bottom-8 left-0 right-0 text-center z-20">
                    <span className="text-sm font-mono text-gray-400 uppercase tracking-widest">Visualizing Step {index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Column Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-8">
          {pipelineSteps.map((step, index) => {
            const isActive = index === activeStep;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(index)} // Allow manual click
                className={`
                  cursor-pointer p-6 rounded-xl border transition-all duration-500 relative overflow-hidden
                  ${isActive 
                    ? "bg-gray-800 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)] scale-105 z-10" 
                    : "bg-gray-900/30 border-gray-800 hover:bg-gray-900 hover:border-gray-700"
                  }
                `}
              >
                {/* Progress Bar (Only visible when active) */}
                {isActive && (
                   <div className="absolute top-0 left-0 h-1 bg-blue-500 animate-[width_5s_linear_forwards] w-full" />
                )}

                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${isActive ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isActive ? "text-white" : "text-gray-400"}`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                      Step 0{index + 1}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// src\components\structure\OurPipeline.tsx