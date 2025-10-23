// app/ocr-tool/page.tsx
"use client";

import Header from "@/app/components/structure/Header";
import Footer from "@/app/components/structure/Footer";
import { useEffect, useRef, useState } from "react";

const OCRToolPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    console.log("OCR route mounted (visible test)");
  }, []);

  const onChooseClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  };
  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first");
   
    try {
      const backend = "http://localhost:8000/upload";
      const res = await fetch(backend, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, content_type: file.type }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const uploadUrl: string = data.upload_url;
      const publicUrl: string = data.public_url;

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });
      if (!putRes.ok) throw new Error("Upload to S3 failed");

    } catch (err) {
      console.error(err);
      
    } 
  };


  return (
    <div>
      <Header />
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // global background may be black; keep this page visually distinct
          background: "#000",
        }}
      >
        <div
          style={{
            width: 700,
            maxWidth: "95%",
            background: "#fff",
            color: "#000",
            padding: 28,
            borderRadius: 12,
            boxShadow: "0 6px 30px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginTop: 0 }}>OCR Tool — Visible Upload Test</h1>

          <input
            ref={fileInputRef}
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div style={{ margin: "16px 0" }}>
            <button
              onClick={onChooseClick}
              style={{
                background: "#0070f3",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Choose Image
            </button>
          </div>

          {file ? (
            <div style={{ marginTop: 12 }}>
              <strong>Selected:</strong> {file.name}
            </div>
          ) : (
            <div style={{ marginTop: 12, color: "#444" }}>No file selected</div>
          )}

          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => alert(file ? `Would upload: ${file.name}` : "Please choose a file")}
              style={{
                background: "#222",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Submit Photo (test)
            </button>
          </div>

         
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OCRToolPage;
