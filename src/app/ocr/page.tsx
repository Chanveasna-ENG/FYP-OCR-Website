"use client";
import { useState } from "react";
import OCRUpload from "@/app/ocr/OCRUpload";
import OCROutput from "@/app/ocr/OCROutput";
import uploadCss from "@/app/styling/ocr-upload.module.css";
import Header from "../components/structure/Header";
import Footer from "../components/structure/Footer";

// Import the new shared type
import { OCRResultWithPreview } from "./types";

export default function OCRToolPage() {
  // --- MODIFICATION ---
  // The state now holds an array of results, or null.
  const [results, setResults] = useState<null | OCRResultWithPreview[]>(null);

  // This function is passed to the child (OCRUpload)
  // It receives the *array* of results when the child is done.
  const handleSuccess = (allResults: OCRResultWithPreview[]) => {
    setResults(allResults);
  };

  // This function is passed to the grandchild (OCROutput)
  const handleReset = () => {
    // Revoke all the old preview URLs to prevent memory leaks
    results?.forEach(result => {
      if (result.previewUrl) {
        URL.revokeObjectURL(result.previewUrl);
      }
    });
    setResults(null);
  };

  return (
    <>
      <Header />
      {/* Header uses the .text style from the upload CSS */}
      <section className={uploadCss.text}>
        <h1>សាកល្បង OCR របស់យើង</h1>
        <br/>
        <p>ផ្ទុក​រូបភាព​ឡើង ហើយ​ទទួល​បាន​អត្ថបទ​ខ្មែរ​ភ្លាមៗ</p>
      </section>

      {/* --- MODIFICATION ---
        This logic now renders EITHER the upload component
        OR the list of output components.
      */}
      {!results ? (
        <OCRUpload onSuccess={handleSuccess} />
      ) : (
        <>
          {/* We now map over the results array */}
          {results.map((result, index) => (
            <OCROutput
              key={result.filename}
              previewUrl={result.previewUrl}
              text={result.text}
              // Only show "Upload Another" on the very last item
              onReset={index === results.length - 1 ? handleReset : undefined}
            />
          ))}
        </>
      )}

      <Footer />
    </>
  );
}