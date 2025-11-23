"use client";

import { useRef, useState } from "react";
import styles from "@/app/styling/ocr-upload.module.css";
import {
  FileMetadata,
  InitiateUploadResponse,
  OCRFinalResult,
  OCRResultWithPreview,
} from "./types";

// --- Configuration ---
const MAX_TOTAL_SIZE_MB = 20; // Set your MB cap
const MB_IN_BYTES = 1024 * 1024;
// ---------------------

type Props = {
  // The parent's function, updated to accept an array of results
  onSuccess: (results: OCRResultWithPreview[]) => void;
};

export default function OCRUpload({ onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  // State now holds an array of Files
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Drag & Drop or Select Files");

  const prevent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const pick = () => {
    if (busy) return;
    inputRef.current?.click();
  };

  // Handles file selection from drag-drop or click
  const handleFileSelection = (fileList: FileList | null) => {
    if (busy || !fileList) return;
    const newFiles = Array.from(fileList);
    if (newFiles.length === 0) return;

    // Check for MB Cap
    const totalSize = newFiles.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE_MB * MB_IN_BYTES) {
      setError(
        `Total size exceeds ${MAX_TOTAL_SIZE_MB}MB. Please select fewer files.`,
      );
      setFiles([]);
    } else {
      setError(null);
      setFiles(newFiles);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(e.target.files);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    prevent(e);
    handleFileSelection(e.dataTransfer.files);
  };

  // --- This is the new 3-Step Upload Function ---
  const handleSubmit = async () => {
    if (files.length === 0) return;

    setBusy(true); // --- SPINNER ON ---
    setError(null);

    // Create preview URLs to use later
    const previewUrlMap = new Map<string, string>();
    files.forEach(file => {
      previewUrlMap.set(file.name, URL.createObjectURL(file));
    });

    try {
      // -----------------------------------------------------------------
      // STEP 1: Tell backend we *want* to upload files
      // -----------------------------------------------------------------
      setStatus("Initializing session...");
      const fileMetas: FileMetadata[] = files.map(f => ({
        filename: f.name,
        content_type: f.type,
      }));

      const initResp = await fetch("http://103.253.145.16:8000/api/initiate-uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: fileMetas }),
      });
      if (!initResp.ok) throw new Error("Failed to initialize upload session.");
      const { job_id, uploads } =
        (await initResp.json()) as InitiateUploadResponse;

      // -----------------------------------------------------------------
      // STEP 2: Upload all files *directly to S3* in parallel
      // -----------------------------------------------------------------
      setStatus(`Uploading ${files.length} file(s) to S3...`);
      const uploadPromises = uploads.map(upload => {
        const file = files.find(f => f.name === upload.filename);
        if (!file) return Promise.reject(`File ${upload.filename} not found`);

        return fetch(upload.upload_url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
      });
      const s3Results = await Promise.allSettled(uploadPromises);
      if (s3Results.some(r => r.status === "rejected")) {
        throw new Error("One or more files failed to upload to S3.");
      }

      // -----------------------------------------------------------------
      // STEP 3: Tell backend to start the *slow* OCR process
      // -----------------------------------------------------------------
      setStatus("Processing images... (This may take a minute)");

      const ocrResp = await fetch("http://103.253.145.16:8000/api/get-ocr-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_id: job_id }),
      });
      if (!ocrResp.ok)
        throw new Error("The OCR process failed on the server.");

      const finalResults = (await ocrResp.json()) as OCRFinalResult[];

      // -----------------------------------------------------------------
      // STEP 4: All done! Send results to parent.
      // -----------------------------------------------------------------
      setStatus("Process complete!");

      const resultsWithPreviews = finalResults.map(result => ({
        ...result,
        previewUrl: previewUrlMap.get(result.filename) || "",
      }));

      // Call the parent's function with the final array of results
      onSuccess(resultsWithPreviews);
    } catch (err: unknown) {
      console.error("Upload process failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "An unknown error occurred.");
    } finally {
      setBusy(false); // --- SPINNER OFF ---
      setStatus("Drag & Drop or Select Files");
    }
  };

  return (
    <div className={styles["upload-panel"]}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className={styles.hiddenInput}
        multiple // <-- Allow multiple files
        disabled={busy}
      />

      <label
        onClick={pick}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={onDrop}
        className={busy ? styles.disabledLabel : ""}
      >
        <div className={styles.icon}>☁️⬆️</div>
        <div className={styles.labelText}>
          {busy
            ? status
            : `Drag & Drop or Select Files (${files.length} selected)`}
        </div>
      </label>

      {/* Show list of selected files */}
      {files.length > 0 && !busy && (
        <div className={styles.selected}>
          <strong>Selected:</strong>
          <ul
            style={{
              listStyleType: "disc",
              listStylePosition: "inside",
              maxHeight: "100px",
              overflowY: "auto",
              paddingLeft: "20px",
            }}
          >
            {files.map((file, i) => (
              <li key={i}>
                {file.name} ({(file.size / MB_IN_BYTES).toFixed(2)} MB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Show error message */}
      {error && <div className={styles.error}>{error}</div>}

      <button
        className={styles["upload-btn"]}
        type="button"
        onClick={handleSubmit} // <-- Use new function
        disabled={busy || files.length === 0}
      >
        {busy ? (
          <>
            <div className={styles.spinner}></div>
            <span>{status}</span>
          </>
        ) : (
          `Submit ${files.length} File(s)`
        )}
      </button>

      {/* --- Add this CSS to your styles/ocr-upload.module.css file --- */}
      <style>{`
        .${styles.spinner} {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 4px solid #ffffff;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .${styles.error} {
          color: red;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .${styles.disabledLabel} {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}