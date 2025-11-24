export default function OCRHeader() {
  return (
    <section className="text-center py-16 px-4 space-y-4 bg-black">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
        Try Our <span className="text-blue-500">OCR Tool</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        Upload your images below and get accurate Khmer text extraction instantly.
      </p>
    </section>
  );
}
// src/ocr/OCRHeader.tsx