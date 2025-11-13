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

  // State variables
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

      {/* Box with dashed border */}
      <label
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
            border: "0px dashed", // inner box
            borderColor: dragOver ? "primary.main" : "divider",
            bgcolor: dragOver ? "action.hover" : "background.paper",
            textAlign: "center",
            transition: "all 120ms ease",
            minHeight: "150px", // Ensure the box maintains its height
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto", // Allow vertical scroll for the dropzone
            maxHeight: "300px", // Limit the height of the container to enable scroll
          }}
        >
          {/* If files are selected, display image preview */}
          {files.length === 0 ? (
            <>
              <div className={styles.icon}>
                <CloudUploadIcon sx={{ fontSize: 60 }} />
              </div>
              <div className={styles.labelText}>
                Select or Drop your file here.
              </div>
            </>
          ) : (
            <>
              {/* TASK 1: Scrollable file preview box */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  overflowX: "auto", // Allow horizontal scroll (left-to-right)
                  flexWrap: "nowrap", // Prevent wrapping of images
                  width: "100%",
                  p: 1, // Padding for scrollbar visibility
                }}
              >
                {previews.map(({ file, url }) => (
                  // Container for the image box + text
                  <Box
                    key={file.name + file.size}
                    sx={{
                      width: 100, // TASK 2/3: Fixed width for the entire item
                      flexShrink: 0, // Prevent item from shrinking
                      textAlign: "center",
                    }}
                  >
                    {/* TASK 2: Fixed 100x100 box for the image */}
                    <Box
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        bgcolor: "background.default", // Shows empty space
                      }}
                    >
                      <img
                        src={url}
                        alt={file.name}
                        style={{
                          width: "auto", // Maintain aspect ratio
                          height: "auto", // Maintain aspect ratio
                          maxWidth: "100%", // Fit within box
                          maxHeight: "100%", // Fit within box
                          objectFit: "contain", // Maintain aspect ratio
                        }}
                      />
                    </Box>
                    {/* TASK 3: Text label */}
                    <Typography
                      variant="caption"
                      title={file.name}
                      sx={{
                        display: "block",
                        mt: 0.5,
                        width: "100%", // Matches container width (100px)
                        overflow: "hidden", // Truncate
                        textOverflow: "ellipsis", // Add "..."
                        whiteSpace: "nowrap", // Single line
                      }}
                    >
                      {file.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </label>

      {/* Centered Upload and Clear buttons */}
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