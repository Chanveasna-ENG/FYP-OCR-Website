"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, FileText, Lock } from "lucide-react";
import { OCRResultWithPreview } from "@/types/ocr";
import { processOCRJob } from "@/lib/ocr-service";
import { useAuth } from "@/context/AuthContext";

const MAX_TOTAL_SIZE_MB = 20;
const MB_IN_BYTES = 1024 * 1024;

type Props = {
  onSuccess: (results: OCRResultWithPreview[]) => void;
};

export default function OCRUpload({ onSuccess }: Props) {
  const { user, openLoginModal } = useAuth(); // Get auth state
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Idle");

  const handleInteraction = () => {
    if (!user) {
      openLoginModal(); // Open modal if not logged in
      return;
    }
    if (busy) return;
    inputRef.current?.click();
  };

  const handleFileSelection = (fileList: FileList | null) => {
    if (!user) return; // Double check
    if (busy || !fileList) return;
    const newFiles = Array.from(fileList);
    if (newFiles.length === 0) return;

    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE_MB * MB_IN_BYTES) {
      setError(`Total size exceeds ${MAX_TOTAL_SIZE_MB}MB.`);
      return;
    }

    setError(null);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (files.length === 0) return;
    setBusy(true);
    setError(null);

    // Create Previews
    const previewMap = new Map<string, string>();
    files.forEach((f) => previewMap.set(f.name, URL.createObjectURL(f)));

    try {
      setStatus("Uploading...");
      const finalResults = await processOCRJob(files);

      setStatus("Processing...");
      const resultsWithPreviews = finalResults.map((res) => ({
        ...res,
        previewUrl: previewMap.get(res.filename) || "",
      }));

      onSuccess(resultsWithPreviews);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelection(e.target.files)}
        disabled={busy}
      />

      <div
        onClick={handleInteraction}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!user) {
            openLoginModal();
            return;
          }
          handleFileSelection(e.dataTransfer.files);
        }}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all relative overflow-hidden
          ${busy ? "opacity-50 cursor-wait bg-gray-900 border-gray-800" : "bg-gray-900 border-gray-700 hover:border-blue-500 hover:bg-gray-800"}
          ${error ? "border-red-500 bg-red-900/20" : ""}
        `}
      >
        {/* Lock Overlay for Non-Logged In Users */}
        {!user && (
          <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center">
            <div className="p-4 bg-gray-800/90 rounded-full mb-3 shadow-xl border border-gray-700">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-lg font-bold text-white">Login Required</p>
            <p className="text-sm text-gray-400 mt-1">Click here to sign in and upload</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {busy ? (
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          ) : (
            <div className="p-4 bg-gray-800 rounded-full">
              <Upload className="w-8 h-8 text-blue-400" />
            </div>
          )}
          <div className="space-y-1">
            <p className="text-lg font-medium text-gray-200">
              {busy ? status : "Drag & drop files here"}
            </p>
            {!busy && <p className="text-sm text-gray-500">or click to browse</p>}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-400 bg-red-900/20 border border-red-900 rounded-lg text-center font-medium">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider pl-1">
            Selected Files ({files.length})
          </h3>
          <div className="grid gap-3">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm group hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="p-2 bg-blue-900/30 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400 shrink-0" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-200 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / MB_IN_BYTES).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                {!busy && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="p-2 hover:bg-red-900/30 rounded-full text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={busy}
            className={`
              w-full py-4 px-6 rounded-xl font-bold text-white text-lg transition-all shadow-lg
              ${busy 
                ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/20 hover:-translate-y-0.5 active:translate-y-0"
              }
            `}
          >
            {busy ? "Processing..." : "Start OCR Process"}
          </button>
        </div>
      )}
    </div>
  );
}