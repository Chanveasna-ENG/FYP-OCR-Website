"use client";

import { Download, RefreshCw } from "lucide-react";
import Image from "next/image";

type Props = {
  previewUrl: string;
  text: string;
  onReset?: () => void;
};

export default function OCROutput({ previewUrl, text, onReset }: Props) {
  const downloadTxt = () => {
    const blob = new Blob([text ?? ""], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ocr_output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
        
        {/* Left Column: Image Preview */}
        <div className="p-6 bg-black/40 flex flex-col h-full">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Original Input
          </h3>
          <div className="flex-grow flex items-center justify-center bg-black/50 rounded-xl border border-dashed border-gray-800 min-h-[400px] overflow-hidden relative group">
            {previewUrl ? (
                <Image 
                  src={previewUrl} 
                  alt="Preview" 
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized
                />
            ) : (
              <div className="text-gray-600 text-sm">No Preview Available</div>
            )}
          </div>
          <button 
            onClick={downloadTxt}
            className="mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-800 border border-gray-700 text-gray-200 font-semibold rounded-xl hover:bg-gray-700 hover:text-white transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            Download Text File
          </button>
        </div>

        {/* Right Column: OCR Text Result */}
        <div className="p-6 flex flex-col h-full bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Extracted Text
            </h3>
            {onReset && (
              <button 
                onClick={onReset}
                className="text-xs flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors font-medium px-3 py-1.5 rounded-full hover:bg-blue-900/20"
              >
                <RefreshCw className="w-3 h-3" />
                New Upload
              </button>
            )}
          </div>
          
          <div className="flex-grow bg-black rounded-xl border border-gray-800 p-1 shadow-inner min-h-[400px] relative">
            <textarea 
              readOnly 
              className="w-full h-full resize-none text-gray-300 font-mono text-sm leading-relaxed focus:outline-none bg-transparent p-4 custom-scrollbar"
              value={text || "(No text recognized)"}
            />
            {/* Copy Button Overlay (Optional Enhancement) */}
            {/* <button 
                onClick={() => navigator.clipboard.writeText(text)}
                className="absolute bottom-4 right-4 p-2 bg-gray-800 text-gray-400 rounded-lg hover:text-white hover:bg-gray-700 transition-colors shadow-lg"
                title="Copy to Clipboard"
            >
                <span className="text-xs font-bold">COPY</span>
            </button> */}
          </div>
        </div>

      </div>
    </div>
  );
}