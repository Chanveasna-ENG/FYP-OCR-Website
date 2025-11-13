"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import styles from "@/app/styling/ocr-upload.module.css";

import { styled } from "@mui/material/styles";
import { Box, Button, Chip, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export type OCRResult = { text: string; confidence: number };
type Props = { onSuccess: (res: OCRResult, previewUrl: string) => void };

// Visually hidden input (keeps keyboard/label behavior clean)
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function OCRUpload({ onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // CHANGED: support multiple files
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);


  // pick — unchanged name/signature
  const pick = () => inputRef.current?.click();

  // onFile — same name (now accepts File | File[] | null)
  const onFile = (f: File | File[] | null) => {
    if (!f) return setFiles([]);
    if (Array.isArray(f)) return setFiles(f);
    setFiles([f]);
  };

  // onChange — same name (collect all selected files)
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    onFile(list.length ? list : null);
  };

  // onDrop — same name (HTMLLabelElement to match old typing)
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const list = e.dataTransfer?.files ? Array.from(e.dataTransfer.files) : [];
    onFile(list.length ? list : null);
  };

  // prevent — same name
  const prevent = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Create preview URLs (revoked on change/unmount)
  const previews = useMemo(
    () => files.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [files]
  );

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // upload — same name (calls onSuccess once per file)
  const upload = async () => {
    if (!files.length) return alert("Please select at least one file first.");
    try {
      setBusy(true);

      const tasks = previews.map(async ({ file, url }) => {
        const fd = new FormData();
        fd.append("file", file);
        const resp = await fetch("/api/ocr", { method: "POST", body: fd });
        if (!resp.ok) throw new Error(await resp.text());
        const data = (await resp.json()) as OCRResult;
        onSuccess(data, url); // <— same callback signature as before
      });

      const results = await Promise.allSettled(tasks);
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed) alert(`${failed} file(s) failed to upload/OCR.`);
    } catch (e) {
      console.error(e);
      alert("Upload/OCR failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles["upload-panel"]}>
      {/* Hidden input preserved to keep original structure/classes if needed */}
      <VisuallyHiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        className={styles.hiddenInput}
      />

      {/* Label acts as drop target (same as old), but styled with MUI */}
      <label
        // clicking still triggers pick()
        onClick={pick}
        onDragOver={(e) => {
          prevent(e);
          setDragOver(true);
        }}
        onDragEnter={(e) => {
          prevent(e);
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          prevent(e);
          setDragOver(false);
        }}
        onDrop={onDrop}
        style={{ display: "block" }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: "1px dashed",
            borderColor: dragOver ? "primary.main" : "divider",
            bgcolor: dragOver ? "action.hover" : "background.paper",
            textAlign: "center",
            transition: "all 120ms ease",
          }}
        >
        {/* lettering in the box */}
          <div className={styles.icon}>
          {<CloudUploadIcon />}
          </div> 
          <div className={styles.labelText}>
            Drag &amp; Drop or
            <br />
            Select Files
          </div>
          {files.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`${files.length} selected`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Box>
      </label>

      {/* Simple preview grid (uses your CSS container, minimal inline styles) */}
      {previews.length > 0 && (
        <Box
          sx={{
            mt: 1.5,
            display: "grid",
            gap: 8,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" },
          }}
        >
          {previews.map(({ file, url }) => (
            <Box key={file.name + file.size} sx={{ textAlign: "center" }}>
              <img
                src={url}
                alt={file.name}
                style={{
                  width: "100%",
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <Typography
                variant="caption"
                title={file.name}
                sx={{ display: "block", mt: 0.5 }}
                noWrap
              >
                {file.name}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* Selected filename(s) text (keeps your old look) */}
      {files.length === 1 && (
        <div className={styles.selected}>
          Selected: <strong>{files[0].name}</strong>
        </div>
      )}
      {files.length > 1 && (
        <div className={styles.selected}>
          Selected: <strong>{files.length} files</strong>
        </div>
      )}

      {/* Actions: Centered Upload and Clear buttons */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onClick={upload}
          disabled={busy || files.length === 0}
          sx={{
            backgroundColor: "black", // Set button background to black
            color: "white", // Set text color to white
            "&:hover": {
              backgroundColor: "#333", // Darker shade on hover
            },
          }}
        >
          {busy ? "Uploading…" : "Upload"}
        </Button>

        <Button
          variant="text"
          disabled={busy || files.length === 0}
          onClick={() => onFile(null)}
          sx={{
            color: "black", // Set text color to black for "Clear" button
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}
