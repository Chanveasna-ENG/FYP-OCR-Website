"use client";

import { useRef, useState } from "react";
import styles from "@/app/styling/ocr-upload.module.css";

export type OCRResult = { text: string; confidence: number };

type Props = { onSuccess: (res: OCRResult, previewUrl: string) => void };

export default function OCRUpload({ onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const pick = () => inputRef.current?.click();

  const onFile = (f: File | null) => setFile(f ?? null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFile(e.target.files?.[0] ?? null);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); e.stopPropagation();
    onFile(e.dataTransfer.files?.[0] ?? null);
  };
  const prevent = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };

  const upload = async () => {
    if (!file) return alert("Please select a file first.");
    try {
      setBusy(true);
      const fd = new FormData();
      fd.append("file", file);
      const resp = await fetch("/api/ocr", { method: "POST", body: fd });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json() as OCRResult;
      const previewUrl = URL.createObjectURL(file);
      onSuccess(data, previewUrl);
    } catch (e) {
      console.error(e);
      alert("Upload/OCR failed.");
    } finally {
      setBusy(false);
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
      />

      <label
        onClick={pick}
        onDragOver={prevent}
        onDragEnter={prevent}
        onDrop={onDrop}
      >
        <div className={styles.icon}>☁️⬆️</div>
        <div className={styles.labelText}>Drag &amp; Drop or<br/>Select File</div>
      </label>

      {file && <div className={styles.selected}>Selected: <strong>{file.name}</strong></div>}

      <button
        className={styles["upload-btn"]}
        type="button"
        onClick={upload}
        disabled={busy}
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
    </div>
  );
}
