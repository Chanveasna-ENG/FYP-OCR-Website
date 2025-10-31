"use client";
import { useState } from "react";
import OCRUpload, { OCRResult } from "@/app/ocr/OCRUpload";
import OCROutput from "@/app/ocr/OCROutput";
import uploadCss from "@/app/styling/ocr-upload.module.css";
import Header from "../components/structure/Header";

export default function OCRToolPage() {
  const [result, setResult] = useState<null | (OCRResult & { previewUrl: string })>(null);

  return (
    <>
    <Header/>
      {/* Header uses the .text style from the upload CSS */}
      <section className={uploadCss.text}>
        <h1>Try Our OCR</h1>
        <p>Upload an image and get Khmer text instantly</p>
      </section>

      {!result ? (
        <OCRUpload onSuccess={(r, url) => setResult({ ...r, previewUrl: url })} />
      ) : (
        <OCROutput
          previewUrl={result.previewUrl}
          text={result.text}
          confidence={result.confidence}
          onReset={() => setResult(null)}
        />
      )}
    </>
  );
}
