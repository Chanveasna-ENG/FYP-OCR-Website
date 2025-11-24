import { FileMetadata, InitiateUploadResponse, OCRFinalResult } from "@/types/ocr";

const API_BASE_URL = "http://103.253.145.16:8000/api";

export async function processOCRJob(files: File[]): Promise<OCRFinalResult[]> {
  // 1. Initiate Session
  const fileMetas: FileMetadata[] = files.map((f) => ({
    filename: f.name,
    content_type: f.type,
  }));

  const initResp = await fetch(`${API_BASE_URL}/initiate-uploads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ files: fileMetas }),
  });

  if (!initResp.ok) throw new Error("Failed to initiate upload session.");
  const { job_id, uploads } = (await initResp.json()) as InitiateUploadResponse;

  // 2. Parallel Upload to S3
  const uploadPromises = uploads.map((upload) => {
    const file = files.find((f) => f.name === upload.filename);
    if (!file) return Promise.reject(`File ${upload.filename} not found`);

    return fetch(upload.upload_url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
  });

  const s3Results = await Promise.allSettled(uploadPromises);
  if (s3Results.some((r) => r.status === "rejected")) {
    throw new Error("One or more files failed to upload to S3.");
  }

  // 3. Trigger OCR Processing
  const ocrResp = await fetch(`${API_BASE_URL}/get-ocr-results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ job_id }),
  });

  if (!ocrResp.ok) throw new Error("The OCR process failed on the server.");

  return (await ocrResp.json()) as OCRFinalResult[];
}