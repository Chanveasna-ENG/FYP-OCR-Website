// These are the types for your API flow
// (Based on the shapes you provided)

// For Step 1: POST /api/initiate-uploads
export type FileMetadata = {
  filename: string;
  content_type: string;
};

export type PresignedUpload = {
  filename: string;
  key: string;
  upload_url: string;
};

export type InitiateUploadResponse = {
  job_id: string;
  uploads: PresignedUpload[];
};

// For Step 3: POST /api/get-ocr-results
// NOTE: I'm including 'confidence' here, as your OCROutput component needs it.
export type OCRFinalResult = {
  filename: string;
  text: string;
};

// This is the final data structure we'll pass to the parent page
export type OCRResultWithPreview = OCRFinalResult & {
  previewUrl: string;
};