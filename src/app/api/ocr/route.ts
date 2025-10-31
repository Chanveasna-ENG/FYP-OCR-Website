import { NextResponse } from "next/server";

// Very simple mock OCR endpoint.
// Accepts multipart/form-data with a "file" field.
// Returns a Khmer sample text and a random-ish confidence.
export async function POST(req: Request) {
  try {
    const ctype = req.headers.get("content-type") || "";
    if (!ctype.includes("multipart/form-data")) {
      return new NextResponse("Expected multipart/form-data", { status: 400 });
    }

    // Read the file (we won't actually OCR it – dummy only)
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // Pretend we did OCR here
    const fakeText = "សួស្តី ពិភពលោក";  // “Hello, world” (Khmer)
    const confidence = 0.93;

    return NextResponse.json({ text: fakeText, confidence });
  } catch (e: any) {
    return new NextResponse(e?.message || "Server error", { status: 500 });
  }
}
